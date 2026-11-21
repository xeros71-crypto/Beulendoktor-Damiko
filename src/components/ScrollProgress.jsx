import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import styles from './ScrollProgress.module.css';

const ScrollProgress = ({ routeKey }) => {
    const barRef = useRef(null);

    useEffect(() => {
        let rafId = null;
        let maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

        const updateBar = () => {
            rafId = null;
            const bar = barRef.current;
            if (!bar) return;
            const progress = maxScroll > 0 ? Math.min(1, Math.max(0, window.scrollY / maxScroll)) : 0;
            bar.style.transform = `scaleX(${progress})`;
        };

        const measure = () => {
            maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
            updateBar();
        };

        const onScroll = () => {
            if (rafId === null) {
                rafId = window.requestAnimationFrame(updateBar);
            }
        };

        measure();
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', measure, { passive: true });

        let resizeObserver;
        if (typeof ResizeObserver !== 'undefined') {
            resizeObserver = new ResizeObserver(measure);
            resizeObserver.observe(document.body);
        }

        return () => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', measure);
            if (resizeObserver) resizeObserver.disconnect();
            if (rafId !== null) window.cancelAnimationFrame(rafId);
        };
    }, [routeKey]);

    return (
        <div className={styles.track} aria-hidden="true">
            <div ref={barRef} className={styles.bar} />
        </div>
    );
};

ScrollProgress.propTypes = {
    routeKey: PropTypes.string,
};

export default ScrollProgress;
