import { useEffect, useRef } from 'react';
import styles from './ScrollProgress.module.css';

const ScrollProgress = () => {
    const barRef = useRef(null);

    useEffect(() => {
        let rafId = null;

        const updateProgress = () => {
            rafId = null;
            const bar = barRef.current;
            if (!bar) return;

            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = docHeight > 0 ? Math.min(1, Math.max(0, scrollTop / docHeight)) : 0;
            bar.style.transform = `scaleX(${progress})`;
        };

        const onScroll = () => {
            if (rafId === null) {
                rafId = window.requestAnimationFrame(updateProgress);
            }
        };

        updateProgress();
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onScroll);
            if (rafId !== null) window.cancelAnimationFrame(rafId);
        };
    }, []);

    return (
        <div className={styles.track} aria-hidden="true">
            <div ref={barRef} className={styles.bar} />
        </div>
    );
};

export default ScrollProgress;
