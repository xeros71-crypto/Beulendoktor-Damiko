import crypto from 'node:crypto';

const AUTH_WINDOW_MS = 15 * 60 * 1000;
const AUTH_MAX_FAILURES = 10;
const MAX_AUTH_ENTRIES = 2000;
const SESSION_TTL_SECONDS = 8 * 60 * 60; // 8 Stunden
const MAX_BODY_BYTES = 1024 * 1024; // 1 MB (fuer komprimierte Bild-Uploads)
const authFailures = new Map();

function isSecureRequest(req) {
    const proto = req.headers['x-forwarded-proto'];
    if (typeof proto === 'string') {
        return proto.split(',')[0].trim() === 'https';
    }
    return Boolean(req.socket?.encrypted) || process.env.VERCEL === '1';
}

function getCookieName(req) {
    return isSecureRequest(req) ? '__Host-damiko_admin' : 'damiko_admin';
}

function getSigningKey() {
    const explicitSecret = process.env.ADMIN_SESSION_SECRET || '';
    const adminPassword = process.env.ADMIN_PASSWORD || '';
    if (!adminPassword) {
        return null;
    }
    return crypto
        .createHash('sha256')
        .update(`damiko:admin-session:v1:${explicitSecret}:${adminPassword}`, 'utf8')
        .digest();
}

export function getClientIp(req) {
    const vercelForwarded = req.headers['x-vercel-forwarded-for'];
    if (typeof vercelForwarded === 'string' && vercelForwarded.trim()) {
        return vercelForwarded.split(',')[0].trim();
    }
    const realIp = req.headers['x-real-ip'];
    if (typeof realIp === 'string' && realIp.trim()) return realIp.trim();
    const forwarded = req.headers['x-forwarded-for'];
    if (typeof forwarded === 'string' && forwarded.trim()) {
        return forwarded.split(',')[0].trim();
    }
    return String(req.socket?.remoteAddress || 'unknown').trim();
}

export function isAllowedOrigin(req) {
    const secFetchSite = String(req.headers['sec-fetch-site'] || '').toLowerCase();
    if (secFetchSite && secFetchSite !== 'same-origin' && secFetchSite !== 'same-site') {
        return false;
    }

    const host = String(req.headers.host || '').toLowerCase().trim();
    const candidate = req.headers.origin || req.headers.referer;
    if (!candidate || !host) return false;

    try {
        const parsed = new URL(candidate);
        const isLocal = parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1';
        if (parsed.protocol !== 'https:' && !isLocal) return false;
        return parsed.host.toLowerCase() === host;
    } catch {
        return false;
    }
}

export function hasFetchCsrfHeader(req) {
    return String(req.headers['x-requested-with'] || '').toLowerCase() === 'fetch';
}

export function isAuthBlocked(ip) {
    const now = Date.now();
    for (const [k, entry] of authFailures.entries()) {
        if (now - entry.start > AUTH_WINDOW_MS) authFailures.delete(k);
    }
    const entry = authFailures.get(ip);
    return Boolean(entry && entry.count >= AUTH_MAX_FAILURES);
}

export function recordAuthFailure(ip) {
    const now = Date.now();
    if (authFailures.size >= MAX_AUTH_ENTRIES && !authFailures.has(ip)) {
        const oldestKey = authFailures.keys().next().value;
        if (oldestKey !== undefined) authFailures.delete(oldestKey);
    }
    const entry = authFailures.get(ip);
    if (!entry) {
        authFailures.set(ip, { count: 1, start: now });
    } else {
        entry.count += 1;
    }
}

export function clearAuthFailures(ip) {
    authFailures.delete(ip);
}

export function verifyPassword(provided) {
    const expected = process.env.ADMIN_PASSWORD || '';
    if (!expected || typeof provided !== 'string' || !provided) return false;

    const hashA = crypto.createHash('sha256').update(expected, 'utf8').digest();
    const hashB = crypto.createHash('sha256').update(provided, 'utf8').digest();
    return crypto.timingSafeEqual(hashA, hashB);
}

function parseCookies(cookieHeader) {
    const map = {};
    if (typeof cookieHeader !== 'string' || !cookieHeader) return map;
    for (const part of cookieHeader.split(';')) {
        const idx = part.indexOf('=');
        if (idx === -1) continue;
        const name = part.slice(0, idx).trim();
        const value = part.slice(idx + 1).trim();
        if (name) map[name] = value;
    }
    return map;
}

export function createSessionToken() {
    const key = getSigningKey();
    if (!key) throw new Error('Missing ADMIN_PASSWORD');

    const nowSec = Math.floor(Date.now() / 1000);
    const payload = {
        iat: nowSec,
        exp: nowSec + SESSION_TTL_SECONDS,
        jti: crypto.randomBytes(16).toString('hex'),
    };
    const encodedPayload = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
    const signature = crypto.createHmac('sha256', key).update(encodedPayload).digest('base64url');
    return `${encodedPayload}.${signature}`;
}

export function verifySessionToken(token) {
    if (typeof token !== 'string' || !token) return false;
    const key = getSigningKey();
    if (!key) return false;

    const parts = token.split('.');
    if (parts.length !== 2) return false;
    const [encodedPayload, providedSig] = parts;
    if (!encodedPayload || !providedSig) return false;

    const expectedSig = crypto.createHmac('sha256', key).update(encodedPayload).digest('base64url');
    const a = Buffer.from(expectedSig, 'utf8');
    const b = Buffer.from(providedSig, 'utf8');
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false;

    try {
        const payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf8'));
        const nowSec = Math.floor(Date.now() / 1000);
        return typeof payload.exp === 'number' && payload.exp > nowSec;
    } catch {
        return false;
    }
}

export function verifyAdminSession(req) {
    const cookies = parseCookies(req.headers.cookie);
    const token = cookies[getCookieName(req)];
    return verifySessionToken(token);
}

export function setSessionCookie(req, res, token) {
    const secure = isSecureRequest(req);
    const parts = [
        `${getCookieName(req)}=${token}`,
        'Path=/',
        'HttpOnly',
        'SameSite=Strict',
        `Max-Age=${SESSION_TTL_SECONDS}`,
    ];
    if (secure) parts.push('Secure');
    res.setHeader('Set-Cookie', parts.join('; '));
}

export function clearSessionCookie(req, res) {
    const secure = isSecureRequest(req);
    const parts = [
        `${getCookieName(req)}=`,
        'Path=/',
        'HttpOnly',
        'SameSite=Strict',
        'Max-Age=0',
    ];
    if (secure) parts.push('Secure');
    res.setHeader('Set-Cookie', parts.join('; '));
}

export function parseJsonBody(req) {
    const contentLength = Number(req.headers['content-length'] || 0);
    if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
        return { status: 413, error: 'Die Anfrage ist zu groß (max. 1 MB).' };
    }

    let rawBody;
    try {
        rawBody = req.body;
    } catch {
        return { status: 400, error: 'Ungültiges JSON-Format.' };
    }

    if (rawBody === undefined || rawBody === null || rawBody === '') {
        return { body: {} };
    }

    if (typeof rawBody === 'string') {
        if (Buffer.byteLength(rawBody, 'utf8') > MAX_BODY_BYTES) {
            return { status: 413, error: 'Die Anfrage ist zu groß (max. 1 MB).' };
        }
        try {
            const parsed = JSON.parse(rawBody);
            if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
                return { status: 400, error: 'Ungültiges JSON-Format.' };
            }
            return { body: parsed };
        } catch {
            return { status: 400, error: 'Ungültiges JSON-Format.' };
        }
    }

    if (typeof rawBody !== 'object' || Array.isArray(rawBody)) {
        return { status: 400, error: 'Ungültiges JSON-Format.' };
    }

    if (Buffer.byteLength(JSON.stringify(rawBody), 'utf8') > MAX_BODY_BYTES) {
        return { status: 413, error: 'Die Anfrage ist zu groß (max. 1 MB).' };
    }

    return { body: rawBody };
}

export function requireAdminSession(req, res) {
    if (!isAllowedOrigin(req)) {
        res.status(403).json({ error: 'Forbidden origin' });
        return false;
    }
    if (!hasFetchCsrfHeader(req)) {
        res.status(403).json({ error: 'Ungültige Anfrage.' });
        return false;
    }
    if (!verifyAdminSession(req)) {
        res.status(401).json({ error: 'Sitzung ungültig oder abgelaufen. Bitte erneut anmelden.' });
        return false;
    }
    return true;
}
