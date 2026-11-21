import crypto from 'node:crypto';
import { Resend } from 'resend';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';

const MAX_BODY_BYTES = 16 * 1024;
const MIN_FILL_TIME_MS = 2000;
const MAX_TOKEN_AGE_MS = 2 * 60 * 60 * 1000; // 2 hours
const MAX_FUTURE_SKEW_MS = 5000;

// In-memory fast pre-filter (per warm serverless instance)
const MEMORY_POST_WINDOW_MS = 15 * 60 * 1000;
const MEMORY_POST_MAX = 6;
const MEMORY_GET_WINDOW_MS = 10 * 60 * 1000;
const MEMORY_GET_MAX = 30;
const MAX_MEMORY_ENTRIES = 2000;

// Distributed Firestore rate limits (persisted across instances)
const IP_WINDOW_MS = 15 * 60 * 1000;
const IP_MAX_PER_WINDOW = 5;
const IP_DAY_WINDOW_MS = 24 * 60 * 60 * 1000;
const IP_MAX_PER_DAY = 15;
const EMAIL_WINDOW_MS = 15 * 60 * 1000;
const EMAIL_MAX_PER_WINDOW = 3;
const DUPLICATE_WINDOW_MS = 10 * 60 * 1000;

const EMAIL_LOCAL_REGEX = /^[a-z0-9._%+-]{1,64}$/i;
const EMAIL_DOMAIN_REGEX =
    /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*\.[a-z]{2,24}$/i;
const PHONE_REGEX = /^[+\d][\d\s\-/()]{4,39}$/;
const NONCE_REGEX = /^[a-f0-9]{32}$/;

const ALLOWED_REQUESTED_WITH = new Set(['xmlhttprequest', 'fetch']);

const ALLOWED_SERVICES = new Set([
    'allgemein',
    'lackierungen',
    'ausbeulservice',
    'smart-repair',
    'leasingruecklaeufer',
    'hagelschaeden',
    'fahrzeugaufbereitung',
]);

const SERVICE_LABELS = {
    allgemein: 'Allgemeine Anfrage',
    lackierungen: 'Autolackierung / Teillackierung',
    ausbeulservice: 'Mobiler Ausbeulservice (Dellentechnik)',
    'smart-repair': 'Smart Repair / Spot Repair',
    leasingruecklaeufer: 'Leasingrückläufer-Service',
    hagelschaeden: 'Hagelschaden-Instandsetzung',
    fahrzeugaufbereitung: 'Fahrzeugaufbereitung & Politur',
};

const BIDI_CONTROL_CHARS = new Set([
    0x061c, // Arabic Letter Mark
    0x200e, // Left-to-Right Mark
    0x200f, // Right-to-Left Mark
    0x202a, // LRE
    0x202b, // RLE
    0x202c, // PDF
    0x202d, // LRO
    0x202e, // RLO
    0x2066, // LRI
    0x2067, // RLI
    0x2068, // FSI
    0x2069, // PDI
]);

const postRateLimitStore = new Map();
const getRateLimitStore = new Map();
const usedNonceFallbackStore = new Map();
const duplicateFallbackStore = new Map();

class ConfigError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ConfigError';
    }
}

class PayloadTooLargeError extends Error {
    constructor(message) {
        super(message);
        this.name = 'PayloadTooLargeError';
    }
}

class BadJsonError extends Error {
    constructor(message) {
        super(message);
        this.name = 'BadJsonError';
    }
}

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function stripUnsafeChars(value, { allowNewlines = false } = {}) {
    let result = '';
    for (let i = 0; i < value.length; i += 1) {
        const code = value.charCodeAt(i);
        if (BIDI_CONTROL_CHARS.has(code)) {
            continue;
        }
        if (code === 0x2028 || code === 0x2029) {
            result += allowNewlines ? '\n' : ' ';
            continue;
        }
        if (code === 0x0a) {
            result += allowNewlines ? '\n' : ' ';
            continue;
        }
        if (code === 0x0d) {
            if (!allowNewlines) {
                result += ' ';
            }
            continue;
        }
        if (code === 0x09) {
            result += ' ';
            continue;
        }
        if (code < 0x20 || code === 0x7f) {
            continue;
        }
        result += value[i];
    }
    return result;
}

function sanitizeSingleLine(value, maxLength) {
    return stripUnsafeChars(value, { allowNewlines: false })
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, maxLength);
}

function sanitizeMultiline(value, maxLength) {
    return stripUnsafeChars(value, { allowNewlines: true })
        .replace(/\n{4,}/g, '\n\n\n')
        .trim()
        .slice(0, maxLength);
}

function isValidEmail(email) {
    if (!email || email.length < 5 || email.length > 180) return false;
    const atIndex = email.indexOf('@');
    if (atIndex <= 0 || atIndex !== email.lastIndexOf('@')) return false;

    const localPart = email.slice(0, atIndex);
    const domainPart = email.slice(atIndex + 1);

    if (!EMAIL_LOCAL_REGEX.test(localPart) || !EMAIL_DOMAIN_REGEX.test(domainPart)) {
        return false;
    }
    if (localPart.startsWith('.') || localPart.endsWith('.') || localPart.includes('..')) {
        return false;
    }
    if (domainPart.includes('..')) {
        return false;
    }
    return true;
}

function isValidPhone(phone) {
    if (!phone) return true;
    if (phone.length > 40 || !PHONE_REGEX.test(phone)) return false;
    if (phone.indexOf('+', 1) !== -1) return false;
    const digits = phone.replace(/\D/g, '');
    return digits.length >= 6 && digits.length <= 20;
}

function sanitizeTelHref(phone) {
    const hasLeadingPlus = phone.startsWith('+');
    const digits = phone.replace(/\D/g, '');
    return `${hasLeadingPlus ? '+' : ''}${digits}`;
}

function getDerivedKey(purpose) {
    const baseSecret = process.env.CONTACT_TOKEN_SECRET || process.env.RESEND_API_KEY;
    if (!baseSecret || typeof baseSecret !== 'string' || baseSecret.trim().length < 8) {
        throw new ConfigError('Missing required server environment variables');
    }
    return crypto
        .createHmac('sha256', baseSecret.trim())
        .update(`damiko-contact:${purpose}:v1`)
        .digest();
}

function hashIdentifier(namespace, value) {
    return crypto
        .createHmac('sha256', getDerivedKey('rate-limit'))
        .update(`${namespace}:${value}`)
        .digest('hex')
        .slice(0, 32);
}

function createFormToken() {
    const payload = {
        v: 1,
        iat: Date.now(),
        nonce: crypto.randomBytes(16).toString('hex'),
    };
    const payloadB64 = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
    const sig = crypto
        .createHmac('sha256', getDerivedKey('form-token'))
        .update(payloadB64)
        .digest('base64url');
    return `${payloadB64}.${sig}`;
}

function verifyFormToken(token) {
    if (typeof token !== 'string' || token.length < 20 || token.length > 512) {
        return { ok: false, code: 'INVALID_TOKEN' };
    }

    const dotIndex = token.indexOf('.');
    if (dotIndex <= 0 || dotIndex !== token.lastIndexOf('.')) {
        return { ok: false, code: 'INVALID_TOKEN' };
    }

    const payloadB64 = token.slice(0, dotIndex);
    const sigB64 = token.slice(dotIndex + 1);

    let expectedSigBuf;
    let actualSigBuf;
    try {
        expectedSigBuf = crypto
            .createHmac('sha256', getDerivedKey('form-token'))
            .update(payloadB64)
            .digest();
        actualSigBuf = Buffer.from(sigB64, 'base64url');
    } catch {
        return { ok: false, code: 'INVALID_TOKEN' };
    }

    if (
        expectedSigBuf.length !== actualSigBuf.length ||
        !crypto.timingSafeEqual(expectedSigBuf, actualSigBuf)
    ) {
        return { ok: false, code: 'INVALID_TOKEN' };
    }

    let payload;
    try {
        payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8'));
    } catch {
        return { ok: false, code: 'INVALID_TOKEN' };
    }

    if (
        !payload ||
        typeof payload !== 'object' ||
        payload.v !== 1 ||
        typeof payload.iat !== 'number' ||
        !Number.isFinite(payload.iat) ||
        typeof payload.nonce !== 'string' ||
        !NONCE_REGEX.test(payload.nonce)
    ) {
        return { ok: false, code: 'INVALID_TOKEN' };
    }

    const ageMs = Date.now() - payload.iat;
    if (ageMs < -MAX_FUTURE_SKEW_MS) {
        return { ok: false, code: 'INVALID_TOKEN' };
    }
    if (ageMs < MIN_FILL_TIME_MS) {
        return { ok: false, code: 'TOO_FAST' };
    }
    if (ageMs > MAX_TOKEN_AGE_MS) {
        return { ok: false, code: 'TOKEN_EXPIRED' };
    }

    return { ok: true, nonce: payload.nonce };
}

function getResendClient() {
    if (!process.env.RESEND_API_KEY) {
        return null;
    }
    return new Resend(process.env.RESEND_API_KEY);
}

function getFirestoreClient() {
    if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
        return null;
    }

    if (!getApps().length) {
        let serviceAccount;
        try {
            serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        } catch {
            throw new ConfigError('Invalid FIREBASE_SERVICE_ACCOUNT JSON');
        }
        initializeApp({
            credential: cert(serviceAccount),
        });
    }

    return getFirestore();
}

function getClientIp(req) {
    // Prefer Vercel's edge-verified client IP header over spoofable X-Forwarded-For
    const vercelForwarded = req.headers['x-vercel-forwarded-for'];
    if (typeof vercelForwarded === 'string' && vercelForwarded.trim()) {
        return vercelForwarded.split(',')[0].trim();
    }
    const realIp = req.headers['x-real-ip'];
    if (typeof realIp === 'string' && realIp.trim()) {
        return realIp.trim();
    }
    const forwarded = req.headers['x-forwarded-for'];
    if (typeof forwarded === 'string' && forwarded.trim()) {
        return forwarded.split(',')[0].trim();
    }
    return String(req.socket?.remoteAddress || 'unknown').trim();
}

function isLocalHost(host) {
    return (
        host === 'localhost' ||
        host.startsWith('localhost:') ||
        host === '127.0.0.1' ||
        host.startsWith('127.0.0.1:')
    );
}

function getConfiguredAllowedOrigins() {
    const raw = process.env.ALLOWED_ORIGINS;
    if (typeof raw !== 'string' || !raw.trim()) return null;
    const allowed = new Set();
    for (const entry of raw.split(',')) {
        const trimmed = entry.trim();
        if (!trimmed) continue;
        try {
            const parsed = new URL(trimmed);
            const hostLower = parsed.host.toLowerCase();
            if (parsed.protocol === 'https:' || (parsed.protocol === 'http:' && isLocalHost(hostLower))) {
                allowed.add(parsed.origin.toLowerCase());
            }
        } catch {
            // Ignore malformed configured origin entries
        }
    }
    return allowed.size > 0 ? allowed : null;
}

function matchesExpectedOrigin(rawUrl, expectedHost) {
    try {
        const parsed = new URL(rawUrl);
        const hostLower = parsed.host.toLowerCase();
        const isSafeProtocol =
            parsed.protocol === 'https:' || (parsed.protocol === 'http:' && isLocalHost(hostLower));
        if (!isSafeProtocol) return false;

        if (hostLower === expectedHost) return true;

        const configuredOrigins = getConfiguredAllowedOrigins();
        if (configuredOrigins && configuredOrigins.has(parsed.origin.toLowerCase())) {
            return true;
        }
        return false;
    } catch {
        return false;
    }
}

function isAllowedRequestOrigin(req, { requireExplicitOrigin = true } = {}) {
    const rawHost = req.headers['x-forwarded-host'] || req.headers.host;
    if (typeof rawHost !== 'string' || !rawHost.trim()) return false;
    const expectedHost = rawHost.split(',')[0].trim().toLowerCase();

    // Enforce Fetch Metadata strictly (same-origin only)
    const secFetchSite = req.headers['sec-fetch-site'];
    if (typeof secFetchSite === 'string' && secFetchSite.trim()) {
        if (secFetchSite.trim().toLowerCase() !== 'same-origin') {
            return false;
        }
    }

    // Require custom header to block simple cross-origin HTML form / CSRF requests
    const requestedWith = req.headers['x-requested-with'];
    if (
        typeof requestedWith !== 'string' ||
        !ALLOWED_REQUESTED_WITH.has(requestedWith.trim().toLowerCase())
    ) {
        return false;
    }

    const origin = req.headers.origin;
    if (typeof origin === 'string' && origin.trim()) {
        return matchesExpectedOrigin(origin.trim(), expectedHost);
    }

    const referer = req.headers.referer;
    if (typeof referer === 'string' && referer.trim()) {
        return matchesExpectedOrigin(referer.trim(), expectedHost);
    }

    if (
        !requireExplicitOrigin &&
        typeof secFetchSite === 'string' &&
        secFetchSite.trim().toLowerCase() === 'same-origin'
    ) {
        return true;
    }

    return false;
}

function checkMemoryRateLimit(store, key, windowMs, maxRequests) {
    const now = Date.now();
    for (const [entryKey, entry] of store.entries()) {
        if (now - entry.windowStart > windowMs) {
            store.delete(entryKey);
        }
    }

    if (store.size >= MAX_MEMORY_ENTRIES && !store.has(key)) {
        const oldestKey = store.keys().next().value;
        if (oldestKey !== undefined) store.delete(oldestKey);
    }

    const current = store.get(key);
    if (!current) {
        store.set(key, { count: 1, windowStart: now });
        return { limited: false, retryAfterSec: 0 };
    }

    if (current.count >= maxRequests) {
        const retryAfterSec = Math.max(1, Math.ceil((current.windowStart + windowMs - now) / 1000));
        return { limited: true, retryAfterSec };
    }

    current.count += 1;
    return { limited: false, retryAfterSec: 0 };
}

function checkMemoryGuardsFallback({ nonce, contentHash }) {
    const now = Date.now();
    for (const [key, exp] of usedNonceFallbackStore.entries()) {
        if (exp <= now) usedNonceFallbackStore.delete(key);
    }
    for (const [key, exp] of duplicateFallbackStore.entries()) {
        if (exp <= now) duplicateFallbackStore.delete(key);
    }

    if (usedNonceFallbackStore.has(nonce)) {
        return { allowed: false, reason: 'TOKEN_REPLAY', retryAfterSec: 0 };
    }

    const dupExp = duplicateFallbackStore.get(contentHash);
    if (dupExp && dupExp > now) {
        return {
            allowed: false,
            reason: 'DUPLICATE',
            retryAfterSec: Math.max(1, Math.ceil((dupExp - now) / 1000)),
        };
    }

    if (usedNonceFallbackStore.size >= MAX_MEMORY_ENTRIES) {
        const oldestKey = usedNonceFallbackStore.keys().next().value;
        if (oldestKey !== undefined) usedNonceFallbackStore.delete(oldestKey);
    }
    if (duplicateFallbackStore.size >= MAX_MEMORY_ENTRIES) {
        const oldestKey = duplicateFallbackStore.keys().next().value;
        if (oldestKey !== undefined) duplicateFallbackStore.delete(oldestKey);
    }

    usedNonceFallbackStore.set(nonce, now + MAX_TOKEN_AGE_MS);
    duplicateFallbackStore.set(contentHash, now + DUPLICATE_WINDOW_MS);
    return { allowed: true };
}

function parseJsonBody(req) {
    const contentLengthHeader = req.headers['content-length'];
    if (typeof contentLengthHeader === 'string' && contentLengthHeader.trim()) {
        const declaredLength = Number(contentLengthHeader);
        if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES) {
            throw new PayloadTooLargeError('Die Anfrage ist zu groß.');
        }
    }

    let rawBody;
    try {
        rawBody = req.body;
    } catch {
        throw new BadJsonError('Ungültiges JSON-Format.');
    }

    if (rawBody === undefined || rawBody === null || rawBody === '') {
        throw new BadJsonError('Leere Anfrage.');
    }

    if (Buffer.isBuffer(rawBody)) {
        if (rawBody.length > MAX_BODY_BYTES) {
            throw new PayloadTooLargeError('Die Anfrage ist zu groß.');
        }
        try {
            const parsed = JSON.parse(rawBody.toString('utf8'));
            if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
                throw new BadJsonError('Ungültiges JSON-Format.');
            }
            return parsed;
        } catch (err) {
            if (err instanceof BadJsonError) throw err;
            throw new BadJsonError('Ungültiges JSON-Format.');
        }
    }

    if (typeof rawBody === 'string') {
        if (Buffer.byteLength(rawBody, 'utf8') > MAX_BODY_BYTES) {
            throw new PayloadTooLargeError('Die Anfrage ist zu groß.');
        }
        try {
            const parsed = JSON.parse(rawBody);
            if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
                throw new BadJsonError('Ungültiges JSON-Format.');
            }
            return parsed;
        } catch (err) {
            if (err instanceof BadJsonError) throw err;
            throw new BadJsonError('Ungültiges JSON-Format.');
        }
    }

    if (typeof rawBody !== 'object' || Array.isArray(rawBody)) {
        throw new BadJsonError('Ungültiges JSON-Format.');
    }

    if (Buffer.byteLength(JSON.stringify(rawBody), 'utf8') > MAX_BODY_BYTES) {
        throw new PayloadTooLargeError('Die Anfrage ist zu groß.');
    }

    return rawBody;
}

function readOptionalStringField(body, key) {
    if (!Object.hasOwn(body, key)) {
        return { present: false, value: '' };
    }
    const value = body[key];
    if (value === undefined || value === null) {
        return { present: false, value: '' };
    }
    if (typeof value !== 'string') {
        return { present: true, invalidType: true, value: '' };
    }
    return { present: true, value };
}

async function checkFirestoreGuardsAndConsumeNonce(db, { ipHash, emailHash, contentHash, nonce }) {
    const now = Date.now();
    const rateLimitsCol = db.collection('_rate_limits');
    const ipRef = rateLimitsCol.doc(`ip_${ipHash}`);
    const emailRef = rateLimitsCol.doc(`em_${emailHash}`);
    const dupRef = rateLimitsCol.doc(`dup_${contentHash}`);
    const nonceRef = db.collection('_contact_nonces').doc(nonce);

    return db.runTransaction(async (tx) => {
        const [nonceSnap, ipSnap, emailSnap, dupSnap] = await Promise.all([
            tx.get(nonceRef),
            tx.get(ipRef),
            tx.get(emailRef),
            tx.get(dupRef),
        ]);

        if (nonceSnap.exists) {
            return { allowed: false, reason: 'TOKEN_REPLAY', retryAfterSec: 0 };
        }

        const dupData = dupSnap.exists ? dupSnap.data() : null;
        if (dupData && typeof dupData.expiresAtMs === 'number' && dupData.expiresAtMs > now) {
            const retryAfterSec = Math.max(1, Math.ceil((dupData.expiresAtMs - now) / 1000));
            return { allowed: false, reason: 'DUPLICATE', retryAfterSec };
        }

        const ipData = ipSnap.exists ? ipSnap.data() : null;
        const ipWindowStart =
            ipData && typeof ipData.windowStart === 'number' && now - ipData.windowStart < IP_WINDOW_MS
                ? ipData.windowStart
                : now;
        const ipCount = ipWindowStart === ipData?.windowStart ? Number(ipData.count || 0) : 0;

        const ipDayStart =
            ipData && typeof ipData.dayStart === 'number' && now - ipData.dayStart < IP_DAY_WINDOW_MS
                ? ipData.dayStart
                : now;
        const ipDayCount = ipDayStart === ipData?.dayStart ? Number(ipData.dayCount || 0) : 0;

        if (ipCount >= IP_MAX_PER_WINDOW) {
            const retryAfterSec = Math.max(1, Math.ceil((ipWindowStart + IP_WINDOW_MS - now) / 1000));
            return { allowed: false, reason: 'RATE_LIMITED', retryAfterSec };
        }
        if (ipDayCount >= IP_MAX_PER_DAY) {
            const retryAfterSec = Math.max(1, Math.ceil((ipDayStart + IP_DAY_WINDOW_MS - now) / 1000));
            return { allowed: false, reason: 'RATE_LIMITED', retryAfterSec };
        }

        const emailData = emailSnap.exists ? emailSnap.data() : null;
        const emailWindowStart =
            emailData && typeof emailData.windowStart === 'number' && now - emailData.windowStart < EMAIL_WINDOW_MS
                ? emailData.windowStart
                : now;
        const emailCount = emailWindowStart === emailData?.windowStart ? Number(emailData.count || 0) : 0;

        if (emailCount >= EMAIL_MAX_PER_WINDOW) {
            const retryAfterSec = Math.max(1, Math.ceil((emailWindowStart + EMAIL_WINDOW_MS - now) / 1000));
            return { allowed: false, reason: 'RATE_LIMITED', retryAfterSec };
        }

        tx.set(ipRef, {
            windowStart: ipWindowStart,
            count: ipCount + 1,
            dayStart: ipDayStart,
            dayCount: ipDayCount + 1,
            expiresAt: Timestamp.fromMillis(ipDayStart + IP_DAY_WINDOW_MS),
        });

        tx.set(emailRef, {
            windowStart: emailWindowStart,
            count: emailCount + 1,
            expiresAt: Timestamp.fromMillis(emailWindowStart + EMAIL_WINDOW_MS),
        });

        tx.set(dupRef, {
            expiresAtMs: now + DUPLICATE_WINDOW_MS,
            expiresAt: Timestamp.fromMillis(now + DUPLICATE_WINDOW_MS),
        });

        tx.set(nonceRef, {
            usedAt: Timestamp.fromMillis(now),
            expiresAt: Timestamp.fromMillis(now + MAX_TOKEN_AGE_MS + 60 * 60 * 1000),
        });

        return { allowed: true };
    });
}

export default async function handler(req, res) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Vary', 'Origin');
    res.setHeader('X-Content-Type-Options', 'nosniff');

    if (req.method === 'GET') {
        if (!isAllowedRequestOrigin(req, { requireExplicitOrigin: false })) {
            return res.status(403).json({ error: 'Forbidden origin' });
        }

        const clientIp = getClientIp(req);
        const getLimit = checkMemoryRateLimit(
            getRateLimitStore,
            clientIp,
            MEMORY_GET_WINDOW_MS,
            MEMORY_GET_MAX,
        );
        if (getLimit.limited) {
            res.setHeader('Retry-After', String(getLimit.retryAfterSec));
            return res.status(429).json({ error: 'Zu viele Anfragen. Bitte warten Sie einen kurzen Moment.' });
        }

        try {
            const token = createFormToken();
            return res.status(200).json({ token, expiresInMs: MAX_TOKEN_AGE_MS });
        } catch (error) {
            console.error('Contact token error:', error?.name || 'Error');
            return res.status(503).json({
                error: 'Das Kontaktformular ist vorübergehend nicht verfügbar. Bitte rufen Sie uns unter 0151 40 3333 75 an.',
            });
        }
    }

    if (req.method !== 'POST') {
        res.setHeader('Allow', 'GET, POST');
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const contentType = req.headers['content-type'];
    const mediaType = typeof contentType === 'string' ? contentType.split(';')[0].trim().toLowerCase() : '';
    if (mediaType !== 'application/json') {
        return res.status(415).json({ error: 'Unsupported Media Type' });
    }

    if (!isAllowedRequestOrigin(req, { requireExplicitOrigin: true })) {
        return res.status(403).json({ error: 'Forbidden origin' });
    }

    const clientIp = getClientIp(req);
    const memLimit = checkMemoryRateLimit(
        postRateLimitStore,
        clientIp,
        MEMORY_POST_WINDOW_MS,
        MEMORY_POST_MAX,
    );
    if (memLimit.limited) {
        res.setHeader('Retry-After', String(memLimit.retryAfterSec));
        return res.status(429).json({
            error: 'Zu viele Anfragen. Bitte versuchen Sie es in einigen Minuten erneut.',
        });
    }

    try {
        const body = parseJsonBody(req);

        // Reject non-string field types (guards against nested object/NoSQL-style payloads)
        const nameField = readOptionalStringField(body, 'name');
        const emailField = readOptionalStringField(body, 'email');
        const phoneField = readOptionalStringField(body, 'phone');
        const serviceField = readOptionalStringField(body, 'service');
        const messageField = readOptionalStringField(body, 'message');
        const websiteField = readOptionalStringField(body, 'website');
        const tokenField = readOptionalStringField(body, 'formToken');

        if (
            nameField.invalidType ||
            emailField.invalidType ||
            phoneField.invalidType ||
            serviceField.invalidType ||
            messageField.invalidType ||
            websiteField.invalidType ||
            tokenField.invalidType
        ) {
            return res.status(400).json({ error: 'Ungültige Eingabedaten.' });
        }

        // Honeypot check against automated spam bots
        if (websiteField.value.trim().length > 0) {
            return res.status(200).json({ success: true, message: 'Inquiry sent successfully' });
        }

        // Signed anti-bot / anti-replay form token check
        const tokenCheck = verifyFormToken(tokenField.value);
        if (!tokenCheck.ok) {
            if (tokenCheck.code === 'TOO_FAST') {
                return res.status(400).json({
                    code: 'TOO_FAST',
                    error: 'Bitte nehmen Sie sich einen kurzen Moment Zeit und senden Sie Ihre Anfrage erneut.',
                });
            }
            if (tokenCheck.code === 'TOKEN_EXPIRED') {
                return res.status(403).json({
                    code: 'TOKEN_EXPIRED',
                    error: 'Ihre Formular-Sitzung ist abgelaufen. Bitte klicken Sie noch einmal auf „Kostenlose Anfrage senden“.',
                });
            }
            return res.status(403).json({
                code: 'INVALID_TOKEN',
                error: 'Sicherheitsprüfung fehlgeschlagen. Bitte laden Sie die Seite kurz neu und versuchen Sie es erneut.',
            });
        }

        const name = sanitizeSingleLine(nameField.value, 120);
        const email = sanitizeSingleLine(emailField.value, 180).toLowerCase();
        const phone = sanitizeSingleLine(phoneField.value, 40);
        const rawService = sanitizeSingleLine(serviceField.value || 'allgemein', 80);
        const service = ALLOWED_SERVICES.has(rawService) ? rawService : 'allgemein';
        const message = sanitizeMultiline(messageField.value, 4000);

        if (!name || !email || !message) {
            return res.status(400).json({ error: 'Bitte füllen Sie alle Pflichtfelder aus.' });
        }

        if (name.length < 2) {
            return res.status(400).json({ error: 'Bitte geben Sie einen gültigen Namen ein (mindestens 2 Zeichen).' });
        }

        if (!isValidEmail(email)) {
            return res.status(400).json({ error: 'Bitte geben Sie eine gültige E-Mail-Adresse ein.' });
        }

        if (!isValidPhone(phone)) {
            return res.status(400).json({
                error: 'Bitte geben Sie eine gültige Telefonnummer an (oder lassen Sie das Feld leer).',
            });
        }

        if (message.length < 10) {
            return res.status(400).json({
                error: 'Bitte beschreiben Sie Ihr Anliegen etwas genauer (mindestens 10 Zeichen).',
            });
        }

        const resend = getResendClient();
        if (!resend) {
            console.error('Contact API configuration error: RESEND_API_KEY missing');
            return res.status(503).json({
                error: 'Das Kontaktformular ist vorübergehend nicht verfügbar. Bitte rufen Sie uns unter 0151 40 3333 75 an.',
            });
        }

        if (process.env.VERCEL_ENV === 'production' && !process.env.RESEND_FROM_EMAIL) {
            console.warn('RESEND_FROM_EMAIL is not configured in production; using onboarding@resend.dev fallback.');
        }

        const ipHash = hashIdentifier('ip', clientIp);
        const emailHash = hashIdentifier('email', email);
        const contentHash = hashIdentifier(
            'content',
            `${email}|${message.toLowerCase().replace(/\s+/g, ' ')}`,
        );

        let db = null;
        try {
            db = getFirestoreClient();
        } catch (dbInitError) {
            console.error('Firestore initialization error:', dbInitError?.name || 'Error');
        }

        // Distributed Firestore rate limits, duplicate detection, and atomic one-time nonce consumption
        let guardResult;
        if (db) {
            try {
                guardResult = await checkFirestoreGuardsAndConsumeNonce(db, {
                    ipHash,
                    emailHash,
                    contentHash,
                    nonce: tokenCheck.nonce,
                });
            } catch (guardError) {
                console.error('Firestore guard error:', guardError?.name || 'Error', guardError?.code || '');
                guardResult = checkMemoryGuardsFallback({ nonce: tokenCheck.nonce, contentHash });
            }
        } else {
            guardResult = checkMemoryGuardsFallback({ nonce: tokenCheck.nonce, contentHash });
        }

        if (!guardResult.allowed) {
            if (guardResult.reason === 'TOKEN_REPLAY') {
                return res.status(409).json({
                    code: 'TOKEN_REPLAY',
                    error: 'Diese Anfrage wurde bereits verarbeitet. Für eine weitere Anfrage klicken Sie bitte erneut auf Senden.',
                });
            }
            if (guardResult.reason === 'DUPLICATE') {
                res.setHeader('Retry-After', String(guardResult.retryAfterSec));
                return res.status(409).json({
                    code: 'DUPLICATE',
                    error: 'Diese identische Anfrage wurde gerade erst übermittelt. Wir melden uns kurzfristig bei Ihnen.',
                });
            }
            res.setHeader('Retry-After', String(guardResult.retryAfterSec));
            return res.status(429).json({
                error: 'Zu viele Anfragen. Bitte versuchen Sie es in einigen Minuten erneut oder rufen Sie uns direkt an.',
            });
        }

        // 1. Save inquiry in Firebase Firestore (best-effort, no raw IP stored)
        let firestoreSaved = false;
        if (db) {
            try {
                await db.collection('inquiries').add({
                    name,
                    email,
                    ...(phone ? { phone } : {}),
                    service,
                    message,
                    source: 'damiko.de',
                    createdAt: new Date().toISOString(),
                });
                firestoreSaved = true;
            } catch (dbError) {
                console.error('Firestore write failed:', {
                    name: dbError?.name,
                    code: dbError?.code,
                });
            }
        }

        // 2. Send notification email via Resend
        const fromEmail = process.env.RESEND_FROM_EMAIL || 'Beulendoktor Damiko Website <onboarding@resend.dev>';
        const toEmail = process.env.CONTACT_TO_EMAIL || 'info@damiko.de';
        const serviceLabel = SERVICE_LABELS[service] || service;
        const phoneLine = phone ? `\nTelefon: ${phone}` : '';
        const safeTelHref = phone ? sanitizeTelHref(phone) : '';
        const phoneRow = phone
            ? `<tr><td style="padding:8px 12px;color:#555;font-weight:600;vertical-align:top;">Telefon:</td><td style="padding:8px 12px;color:#111;"><a href="tel:${escapeHtml(safeTelHref)}" style="color:#111;">${escapeHtml(phone)}</a></td></tr>`
            : '';
        const safeMailtoHref = encodeURIComponent(email).replace(/%40/g, '@');

        const html = `
<!doctype html>
<html lang="de">
<body style="margin:0;padding:24px;background:#f4f3f8;font-family:Arial,Helvetica,sans-serif;color:#111;">
  <div style="max-width:600px;margin:0 auto;background:#ffffff;border:1px solid #e2dfee;border-radius:8px;overflow:hidden;">
    <div style="background:#292045;color:#ffffff;padding:20px 24px;border-bottom:4px solid #fef579;">
      <h2 style="margin:0;font-size:18px;font-weight:700;color:#fef579;">Neue Website-Anfrage – Beulendoktor Damiko</h2>
      <p style="margin:4px 0 0;font-size:13px;color:#d8d4e8;">Eingegangen über damiko.de</p>
    </div>
    <div style="padding:20px 24px;">
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        <tr><td style="padding:8px 12px;color:#555;font-weight:600;width:130px;vertical-align:top;">Name:</td><td style="padding:8px 12px;color:#111;">${escapeHtml(name)}</td></tr>
        <tr><td style="padding:8px 12px;color:#555;font-weight:600;vertical-align:top;">E-Mail:</td><td style="padding:8px 12px;color:#111;"><a href="mailto:${escapeHtml(safeMailtoHref)}" style="color:#111;">${escapeHtml(email)}</a></td></tr>
        ${phoneRow}
        <tr><td style="padding:8px 12px;color:#555;font-weight:600;vertical-align:top;">Leistung:</td><td style="padding:8px 12px;color:#111;">${escapeHtml(serviceLabel)}</td></tr>
      </table>
      <div style="margin-top:16px;padding:16px;background:#f8f7fc;border-radius:6px;border:1px solid #e7e4f2;">
        <div style="font-size:12px;font-weight:700;color:#292045;text-transform:uppercase;margin-bottom:8px;">Nachricht</div>
        <div style="font-size:14px;line-height:1.6;color:#111;white-space:pre-wrap;">${escapeHtml(message)}</div>
      </div>
      <p style="margin:20px 0 0;font-size:12px;color:#666;">Sie können direkt auf diese E-Mail antworten – die Antwort geht automatisch an ${escapeHtml(email)}.</p>
    </div>
  </div>
</body>
</html>`.trim();

        const { error: emailError } = await resend.emails.send({
            from: fromEmail,
            to: [toEmail],
            replyTo: email,
            subject: `Neue Anfrage über damiko.de: ${name} (${serviceLabel})`,
            text: `Neue Anfrage über damiko.de\n\nName: ${name}\nE-Mail: ${email}${phoneLine}\nLeistung: ${serviceLabel}\n\nNachricht:\n${message}`,
            html,
        });

        if (emailError) {
            console.error('Resend delivery error:', {
                name: emailError?.name,
                statusCode: emailError?.statusCode,
            });
            return res.status(502).json({
                error: firestoreSaved
                    ? 'Ihre Anfrage wurde gespeichert, die E-Mail-Benachrichtigung konnte jedoch nicht zugestellt werden. Bitte rufen Sie bei dringenden Anliegen direkt unter 0151 40 3333 75 an.'
                    : 'Die Anfrage konnte derzeit nicht zugestellt werden. Bitte rufen Sie uns direkt unter 0151 40 3333 75 an oder schreiben Sie per WhatsApp.',
            });
        }

        return res.status(200).json({ success: true, message: 'Inquiry sent successfully' });
    } catch (error) {
        if (error instanceof PayloadTooLargeError) {
            return res.status(413).json({ error: error.message });
        }
        if (error instanceof BadJsonError || error?.statusCode === 400) {
            return res.status(400).json({ error: 'Ungültiges JSON-Format.' });
        }
        if (error instanceof ConfigError) {
            console.error('Contact API configuration error:', error.message);
            return res.status(503).json({
                error: 'Das Kontaktformular ist vorübergehend nicht verfügbar. Bitte rufen Sie uns unter 0151 40 3333 75 an.',
            });
        }
        console.error('Contact API unexpected error:', {
            name: error?.name,
            code: error?.code,
        });
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
