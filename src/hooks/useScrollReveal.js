import { useEffect } from 'react';

const useScrollReveal = (key) => {
    useEffect(() => {
        const reveals = document.querySelectorAll('.reveal');
        if (!reveals.length) return;

        if (typeof IntersectionObserver === 'undefined') {
            reveals.forEach((el) => el.classList.add('active'));
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
            { rootMargin: '100px 0px 60px 0px', threshold: 0.01 },
        );

        reveals.forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, [key]);
};

export default useScrollReveal;
