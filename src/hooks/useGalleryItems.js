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

        const runFetch = () => {
            fetchGalleryOnce().then((loaded) => {
                if (active) setItems(loaded);
            });
        };

        if (cachedItems) {
            runFetch();
            return () => {
                active = false;
            };
        }

        // On the homepage preview ('referenzen'), static items are already prerendered below the fold;
        // wait until the user scrolls or interacts before calling the serverless /api/gallery endpoint.
        if (sectionFilter === 'referenzen' && typeof window !== 'undefined') {
            const onFirstInteraction = () => {
                cleanupListeners();
                runFetch();
            };

            const cleanupListeners = () => {
                window.removeEventListener('scroll', onFirstInteraction);
                window.removeEventListener('pointerdown', onFirstInteraction);
                window.removeEventListener('touchstart', onFirstInteraction);
                window.removeEventListener('keydown', onFirstInteraction);
            };

            window.addEventListener('scroll', onFirstInteraction, { passive: true, once: true });
            window.addEventListener('pointerdown', onFirstInteraction, { passive: true, once: true });
            window.addEventListener('touchstart', onFirstInteraction, { passive: true, once: true });
            window.addEventListener('keydown', onFirstInteraction, { passive: true, once: true });

            return () => {
                active = false;
                cleanupListeners();
            };
        }

        runFetch();
        return () => {
            active = false;
        };
    }, [sectionFilter]);

    if (!sectionFilter) return items;
    const filtered = items.filter((item) => (item.section || 'referenzen') === sectionFilter);
    return filtered.length > 0 ? filtered : items.slice(0, 6);
}
