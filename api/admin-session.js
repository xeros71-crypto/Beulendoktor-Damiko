import {
    getClientIp,
    isAllowedOrigin,
    hasFetchCsrfHeader,
    isAuthBlocked,
    recordAuthFailure,
    clearAuthFailures,
    verifyPassword,
    createSessionToken,
    verifyAdminSession,
    setSessionCookie,
    clearSessionCookie,
    parseJsonBody,
} from './_adminAuth.js';

export default async function handler(req, res) {
    res.setHeader('Cache-Control', 'no-store, max-age=0');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Vary', 'Origin, Cookie');

    try {
        if (req.method === 'GET') {
            return res.status(200).json({
                authenticated: verifyAdminSession(req),
                configured: Boolean(process.env.ADMIN_PASSWORD),
            });
        }

        if (!isAllowedOrigin(req)) {
            return res.status(403).json({ error: 'Forbidden origin' });
        }

        if (!hasFetchCsrfHeader(req)) {
            return res.status(403).json({ error: 'Ungültige Anfrage.' });
        }

        if (req.method === 'DELETE') {
            clearSessionCookie(req, res);
            return res.status(200).json({ authenticated: false });
        }

        if (req.method === 'POST') {
            if (!process.env.ADMIN_PASSWORD) {
                return res.status(503).json({
                    error: 'ADMIN_PASSWORD ist in Vercel noch nicht hinterlegt.',
                });
            }

            const contentType = String(req.headers['content-type'] || '').toLowerCase();
            if (!contentType.startsWith('application/json')) {
                return res.status(415).json({ error: 'Unsupported Media Type' });
            }

            const ip = getClientIp(req);
            if (isAuthBlocked(ip)) {
                res.setHeader('Retry-After', '900');
                return res.status(429).json({
                    error: 'Zu viele fehlgeschlagene Anmeldeversuche. Bitte in 15 Minuten erneut versuchen.',
                });
            }

            const { body, error: parseError, status: parseStatus } = parseJsonBody(req);
            if (parseError) {
                return res.status(parseStatus || 400).json({ error: parseError });
            }

            const providedPassword = Object.hasOwn(body, 'password') && typeof body.password === 'string'
                ? body.password
                : '';

            if (!verifyPassword(providedPassword)) {
                recordAuthFailure(ip);
                return res.status(401).json({ error: 'Ungültiges Admin-Passwort.' });
            }

            clearAuthFailures(ip);
            const token = createSessionToken();
            setSessionCookie(req, res, token);
            return res.status(200).json({ authenticated: true });
        }

        res.setHeader('Allow', 'GET, POST, DELETE');
        return res.status(405).json({ error: 'Method not allowed' });
    } catch (error) {
        console.error('Admin Session Error:', {
            name: error?.name,
            message: error?.message,
        });
        return res.status(500).json({ error: 'Serverfehler bei der Anmeldung.' });
    }
}
