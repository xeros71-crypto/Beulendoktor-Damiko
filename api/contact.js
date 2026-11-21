import { Resend } from 'resend';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const MAX_RATE_LIMIT_ENTRIES = 2000;

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

const rateLimitStore = new Map();

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function getClients() {
    if (!process.env.RESEND_API_KEY || !process.env.FIREBASE_SERVICE_ACCOUNT) {
        throw new Error('Missing required server environment variables');
    }

    if (!getApps().length) {
        initializeApp({
            credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)),
        });
    }

    return {
        db: getFirestore(),
        resend: new Resend(process.env.RESEND_API_KEY),
    };
}

function getClientIp(req) {
    const realIp = req.headers['x-real-ip'];
    if (typeof realIp === 'string' && realIp.trim()) return realIp.trim();
    const vercelForwarded = req.headers['x-vercel-forwarded-for'];
    if (typeof vercelForwarded === 'string' && vercelForwarded.trim()) {
        return vercelForwarded.split(',')[0].trim();
    }
    const forwarded = req.headers['x-forwarded-for'];
    if (typeof forwarded === 'string' && forwarded.trim()) {
        return forwarded.split(',')[0].trim();
    }
    return String(req.socket?.remoteAddress || 'unknown').trim();
}

function isAllowedOrigin(req) {
    const origin = req.headers.origin;
    const host = req.headers.host;
    if (!origin || !host) return true;
    try {
        return new URL(origin).host === host;
    } catch {
        return false;
    }
}

function isRateLimited(ip) {
    const now = Date.now();
    for (const [key, entry] of rateLimitStore.entries()) {
        if (now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
            rateLimitStore.delete(key);
        }
    }

    if (rateLimitStore.size >= MAX_RATE_LIMIT_ENTRIES && !rateLimitStore.has(ip)) {
        const oldestKey = rateLimitStore.keys().next().value;
        if (oldestKey !== undefined) rateLimitStore.delete(oldestKey);
    }

    const current = rateLimitStore.get(ip);
    if (!current) {
        rateLimitStore.set(ip, { count: 1, windowStart: now });
        return false;
    }

    if (current.count >= RATE_LIMIT_MAX_REQUESTS) {
        return true;
    }

    current.count += 1;
    return false;
}

function sanitizeSingleLine(value, maxLength) {
    if (typeof value !== 'string') return '';
    return value.replace(/[\r\n]+/g, ' ').trim().slice(0, maxLength);
}

function parseJsonBody(req) {
    let rawBody;
    try {
        rawBody = req.body;
    } catch {
        return { error: 'Ungültiges JSON-Format.' };
    }

    if (rawBody === undefined || rawBody === null || rawBody === '') {
        return { body: {} };
    }

    if (typeof rawBody === 'string') {
        try {
            const parsed = JSON.parse(rawBody);
            if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
                return { error: 'Ungültiges JSON-Format.' };
            }
            return { body: parsed };
        } catch {
            return { error: 'Ungültiges JSON-Format.' };
        }
    }

    if (typeof rawBody !== 'object' || Array.isArray(rawBody)) {
        return { error: 'Ungültiges JSON-Format.' };
    }

    return { body: rawBody };
}

export default async function handler(req, res) {
    res.setHeader('Cache-Control', 'no-store');

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    if (!isAllowedOrigin(req)) {
        return res.status(403).json({ error: 'Forbidden origin' });
    }

    const clientIp = getClientIp(req);
    if (isRateLimited(clientIp)) {
        return res.status(429).json({ error: 'Zu viele Anfragen. Bitte versuche es in wenigen Minuten erneut.' });
    }

    try {
        const { body, error: parseError } = parseJsonBody(req);
        if (parseError) {
            return res.status(400).json({ error: parseError });
        }

        // Honeypot check against automated spam bots
        if (typeof body.website === 'string' && body.website.trim().length > 0) {
            return res.status(200).json({ success: true, message: 'Inquiry sent successfully' });
        }

        const name = sanitizeSingleLine(body.name, 120);
        const email = sanitizeSingleLine(body.email, 180);
        const phone = sanitizeSingleLine(body.phone || '', 40);
        const rawService = sanitizeSingleLine(body.service || 'allgemein', 80);
        const service = ALLOWED_SERVICES.has(rawService) ? rawService : 'allgemein';
        const message = typeof body.message === 'string' ? body.message.trim().slice(0, 4000) : '';

        if (!name || !email || !message) {
            return res.status(400).json({ error: 'Bitte fülle alle Pflichtfelder aus.' });
        }

        if (!EMAIL_REGEX.test(email)) {
            return res.status(400).json({ error: 'Bitte gib eine gültige E-Mail-Adresse ein.' });
        }

        const { db, resend } = getClients();

        // 1. Save inquiry in Firebase Firestore
        await db.collection('inquiries').add({
            name,
            email,
            ...(phone ? { phone } : {}),
            service,
            message,
            source: 'damiko.de',
            createdAt: new Date().toISOString(),
        });

        // 2. Send notification email via Resend
        const fromEmail = process.env.RESEND_FROM_EMAIL || 'Beulendoktor Damiko Website <onboarding@resend.dev>';
        const toEmail = process.env.CONTACT_TO_EMAIL || 'info@damiko.de';
        const serviceLabel = SERVICE_LABELS[service] || service;
        const phoneLine = phone ? `\nTelefon: ${phone}` : '';
        const phoneRow = phone
            ? `<tr><td style="padding:8px 12px;color:#555;font-weight:600;vertical-align:top;">Telefon:</td><td style="padding:8px 12px;color:#111;"><a href="tel:${escapeHtml(phone)}" style="color:#111;">${escapeHtml(phone)}</a></td></tr>`
            : '';

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
        <tr><td style="padding:8px 12px;color:#555;font-weight:600;vertical-align:top;">E-Mail:</td><td style="padding:8px 12px;color:#111;"><a href="mailto:${escapeHtml(email)}" style="color:#111;">${escapeHtml(email)}</a></td></tr>
        ${phoneRow}
        <tr><td style="padding:8px 12px;color:#555;font-weight:600;vertical-align:top;">Leistung:</td><td style="padding:8px 12px;color:#111;">${escapeHtml(serviceLabel)}</td></tr>
      </table>
      <div style="margin-top:16px;padding:16px;background:#f8f7fc;border-radius:6px;border:1px solid #e7e4f2;">
        <div style="font-size:12px;font-weight:700;color:#292045;text-transform:uppercase;margin-bottom:8px;">Nachricht</div>
        <div style="font-size:14px;line-height:1.6;color:#111;white-space:pre-wrap;">${escapeHtml(message)}</div>
      </div>
      <p style="margin:20px 0 0;font-size:12px;color:#666;">Du kannst direkt auf diese E-Mail antworten – die Antwort geht automatisch an ${escapeHtml(email)}.</p>
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
            console.error('Resend Error:', emailError);
            return res.status(502).json({
                error: 'Deine Anfrage wurde gespeichert, die E-Mail-Benachrichtigung konnte jedoch nicht zugestellt werden. Bitte ruf uns bei dringenden Anliegen direkt unter 0151 40 3333 75 an.',
            });
        }

        return res.status(200).json({ success: true, message: 'Inquiry sent successfully' });
    } catch (error) {
        if (error instanceof SyntaxError || error?.statusCode === 400 || /invalid json/i.test(String(error?.message || ''))) {
            return res.status(400).json({ error: 'Ungültiges JSON-Format.' });
        }
        console.error('API Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
