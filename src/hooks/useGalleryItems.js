import { useState, useEffect } from 'react';
import { galleryItems, workshopHighlights } from '../data/gallery';

const STATIC_ITEMS = [
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

let cachedItems = null;
let inflightPromise = null;

function isSafeDisplaySrc(src) {
    if (typeof src !== 'string') return false;
    const v = src.trim();
    if (v.startsWith('/gallery/') || v.startsWith('/images/')) return true;
    return (
        v.startsWith('data:image/jpeg;base64,') ||
        v.startsWith('data:image/png;base64,') ||
        v.startsWith('data:image/webp;base64,')
    );
}

async function fetchGalleryOnce() {
    if (cachedItems) return cachedItems;
    if (inflightPromise) return inflightPromise;

    inflightPromise = fetch('/api/gallery', { credentials: 'same-origin' })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
            if (data && Array.isArray(data.items) && data.items.length > 0) {
                const safe = data.items.filter((item) => item && isSafeDisplaySrc(item.src));
                if (safe.length > 0) {
                    cachedItems = safe;
                    return safe;
                }
            }
            return STATIC_ITEMS;
        })
        .catch(() => STATIC_ITEMS)
        .finally(() => {
            inflightPromise = null;
        });

    return inflightPromise;
}

export function invalidateGalleryCache() {
    cachedItems = null;
}

export default function useGalleryItems(sectionFilter) {
    const [items, setItems] = useState(() => cachedItems || STATIC_ITEMS);

    useEffect(() => {
        let active = true;
        fetchGalleryOnce().then((loaded) => {
            if (active) setItems(loaded);
        });
        return () => {
            active = false;
        };
    }, []);

    if (!sectionFilter) return items;
    const filtered = items.filter((item) => (item.section || 'referenzen') === sectionFilter);
    return filtered.length > 0 ? filtered : items.slice(0, 6);
}
