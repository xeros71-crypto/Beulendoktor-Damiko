import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { requireAdminSession, parseJsonBody } from './_adminAuth.js';
import { galleryItems, workshopHighlights } from '../src/data/gallery.js';

const COLLECTION_NAME = 'gallery';
const DOC_ID_REGEX = /^[A-Za-z0-9_-]{1,120}$/;
const LOCAL_ASSET_REGEX = /^\/(?:gallery|images)\/[A-Za-z0-9._-]+\.(?:jpg|jpeg|png|webp)$/i;
const MAX_DATA_URL_LENGTH = 650000;
const ALLOWED_SECTIONS = new Set(['referenzen', 'werkstatt']);
const ALLOWED_CATEGORIES = new Set([
    'Autolackierung',
    'Lackierung & Smart Repair',
    'Ausbeulservice',
    'Ausbeulservice & Lack',
    'Smart Repair',
    'Leasingrückläufer',
    'Hagelschäden',
    'Fahrzeugaufbereitung',
]);

const INITIAL_ITEMS = [
    ...galleryItems.map((item, idx) => ({
        ...item,
        section: 'referenzen',
        order: idx + 1,
    })),
    ...workshopHighlights.map((item, idx) => ({
        ...item,
        section: 'werkstatt',
        order: galleryItems.length + idx + 1,
    })),
];

function getDb() {
    if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
        return null;
    }

    let serviceAccount;
    try {
        serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    } catch {
        throw new Error('Invalid FIREBASE_SERVICE_ACCOUNT JSON');
    }

    if (!getApps().length) {
        initializeApp({
            credential: cert(serviceAccount),
        });
    }
    return getFirestore();
}

function cleanText(value, maxLength) {
    if (typeof value !== 'string') return '';
    let result = '';
    for (let i = 0; i < value.length; i += 1) {
        const code = value.charCodeAt(i);
        if (code < 32 || code === 127 || code === 0x2028 || code === 0x2029) {
            result += ' ';
        } else {
            result += value[i];
        }
    }
    return result.replace(/\s+/g, ' ').trim().slice(0, maxLength);
}

function isValidImageSrc(value) {
    if (typeof value !== 'string') return false;
    const v = value.trim();
    if (!v) return false;
    if (LOCAL_ASSET_REGEX.test(v)) return true;
    if (
        (v.startsWith('data:image/jpeg;base64,') ||
            v.startsWith('data:image/png;base64,') ||
            v.startsWith('data:image/webp;base64,')) &&
        v.length <= MAX_DATA_URL_LENGTH
    ) {
        return true;
    }
    return false;
}

function isValidDocId(id) {
    return typeof id === 'string' && DOC_ID_REGEX.test(id);
}

function sortItems(items) {
    return [...items].sort((a, b) => {
        const orderA = typeof a.order === 'number' ? a.order : 9999;
        const orderB = typeof b.order === 'number' ? b.order : 9999;
        if (orderA !== orderB) return orderA - orderB;
        return String(b.createdAt || '').localeCompare(String(a.createdAt || ''));
    });
}

async function ensureSeeded(db) {
    const col = db.collection(COLLECTION_NAME);
    const snap = await col.get();
    if (!snap.empty) {
        return sortItems(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    }

    const now = Date.now();
    const seeded = [];
    for (let i = 0; i < INITIAL_ITEMS.length; i += 1) {
        const item = INITIAL_ITEMS[i];
        const payload = {
            title: item.title,
            category: item.category,
            alt: item.alt || item.title,
            src: item.src,
            section: item.section,
            order: item.order,
            createdAt: new Date(now - i * 1000).toISOString(),
        };
        const ref = await col.add(payload);
        seeded.push({ id: ref.id, ...payload });
    }
    return sortItems(seeded);
}

function readOwn(obj, key) {
    return Object.hasOwn(obj, key) ? obj[key] : undefined;
}

export default async function handler(req, res) {
    res.setHeader('Cache-Control', 'no-store, max-age=0');
    res.setHeader('Pragma', 'no-cache');

    try {
        const db = getDb();

        if (req.method === 'GET') {
            if (!db) {
                return res.status(200).json({
                    items: INITIAL_ITEMS,
                    storageConfigured: false,
                });
            }

            const items = await ensureSeeded(db);
            return res.status(200).json({
                items,
                storageConfigured: true,
            });
        }

        if (!requireAdminSession(req, res)) {
            return;
        }

        if (!db) {
            return res.status(503).json({
                error: 'Firebase Firestore (FIREBASE_SERVICE_ACCOUNT) ist in Vercel noch nicht konfiguriert.',
            });
        }

        const contentType = String(req.headers['content-type'] || '').toLowerCase();
        if (req.method !== 'DELETE' && !contentType.startsWith('application/json')) {
            return res.status(415).json({ error: 'Unsupported Media Type' });
        }

        const { body, error: parseError, status: parseStatus } = parseJsonBody(req);
        if (parseError) {
            return res.status(parseStatus || 400).json({ error: parseError });
        }

        if (req.method === 'POST') {
            const title = cleanText(readOwn(body, 'title'), 140);
            const rawCategory = cleanText(readOwn(body, 'category') || 'Autolackierung', 60);
            const category = ALLOWED_CATEGORIES.has(rawCategory) ? rawCategory : 'Autolackierung';
            const alt = cleanText(readOwn(body, 'alt') || title, 240);
            const src = cleanText(readOwn(body, 'src'), MAX_DATA_URL_LENGTH);
            const rawSection = cleanText(readOwn(body, 'section') || 'referenzen', 20);
            const section = ALLOWED_SECTIONS.has(rawSection) ? rawSection : 'referenzen';
            const rawOrder = Number(readOwn(body, 'order'));

            if (!title || !src) {
                return res.status(400).json({ error: 'Titel und Bild sind Pflichtfelder.' });
            }
            if (!isValidImageSrc(src)) {
                return res.status(400).json({
                    error: 'Ungültige Bilddatei oder Bild zu groß (max. ~450 KB nach Komprimierung).',
                });
            }

            const existing = await ensureSeeded(db);
            const nextOrder = Number.isFinite(rawOrder)
                ? Math.max(1, Math.min(999, Math.round(rawOrder)))
                : existing.length + 1;

            const payload = {
                title,
                category,
                alt,
                src,
                section,
                order: nextOrder,
                createdAt: new Date().toISOString(),
            };
            const docRef = await db.collection(COLLECTION_NAME).add(payload);

            return res.status(201).json({ id: docRef.id, item: { id: docRef.id, ...payload } });
        }

        if (req.method === 'PUT') {
            const id = cleanText(readOwn(body, 'id'), 120);
            if (!isValidDocId(id)) {
                return res.status(400).json({ error: 'Ungültige Bild-ID.' });
            }

            const updates = { updatedAt: new Date().toISOString() };

            if (readOwn(body, 'title') !== undefined) {
                const title = cleanText(readOwn(body, 'title'), 140);
                if (!title) return res.status(400).json({ error: 'Titel darf nicht leer sein.' });
                updates.title = title;
            }
            if (readOwn(body, 'category') !== undefined) {
                const rawCategory = cleanText(readOwn(body, 'category'), 60);
                updates.category = ALLOWED_CATEGORIES.has(rawCategory) ? rawCategory : 'Autolackierung';
            }
            if (readOwn(body, 'alt') !== undefined) {
                updates.alt = cleanText(readOwn(body, 'alt'), 240);
            }
            if (readOwn(body, 'src') !== undefined) {
                const src = cleanText(readOwn(body, 'src'), MAX_DATA_URL_LENGTH);
                if (!isValidImageSrc(src)) {
                    return res.status(400).json({ error: 'Ungültige Bilddatei oder Bild zu groß.' });
                }
                updates.src = src;
            }
            if (readOwn(body, 'section') !== undefined) {
                const rawSection = cleanText(readOwn(body, 'section'), 20);
                updates.section = ALLOWED_SECTIONS.has(rawSection) ? rawSection : 'referenzen';
            }
            if (readOwn(body, 'order') !== undefined) {
                const order = Number(readOwn(body, 'order'));
                if (Number.isFinite(order)) {
                    updates.order = Math.max(1, Math.min(999, Math.round(order)));
                }
            }

            try {
                await db.collection(COLLECTION_NAME).doc(id).update(updates);
            } catch (err) {
                if (err?.code === 5) {
                    return res.status(404).json({ error: 'Galerie-Eintrag wurde nicht gefunden.' });
                }
                throw err;
            }

            return res.status(200).json({ ok: true });
        }

        if (req.method === 'DELETE') {
            const id = cleanText(req.query?.id || readOwn(body, 'id'), 120);
            if (!isValidDocId(id)) {
                return res.status(400).json({ error: 'Ungültige oder fehlende Bild-ID.' });
            }
            await db.collection(COLLECTION_NAME).doc(id).delete();
            return res.status(200).json({ ok: true });
        }

        res.setHeader('Allow', 'GET, POST, PUT, DELETE');
        return res.status(405).json({ error: 'Method not allowed' });
    } catch (error) {
        console.error('Gallery API Error:', {
            name: error?.name,
            code: error?.code,
            message: error?.message,
        });
        return res.status(500).json({ error: 'Serverfehler beim Verarbeiten der Galerie.' });
    }
}
