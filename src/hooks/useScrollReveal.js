import { useEffect } from 'react';

const REVEAL_SELECTOR = '.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-stagger';

const useScrollReveal = (key) => {
    useEffect(() => {
        const elements = Array.from(document.querySelectorAll(REVEAL_SELECTOR));
        if (!elements.length) return;

        if (
            typeof IntersectionObserver === 'undefined' ||
            window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ) {
            elements.forEach((el) => el.classList.add('active'));
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('active');
                        observer.unobserve(entry.target);
                    }
                }
            },
            { rootMargin: '80px 0px -40px 0px', threshold: 0.05 },
        );

        elements.forEach((el) => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.95) {
                el.classList.add('active');
            } else {
                observer.observe(el);
            }
        });

        return () => observer.disconnect();
    }, [key]);
};

export default useScrollReveal;
