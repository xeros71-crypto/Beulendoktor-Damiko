import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import styles from './ScrollProgress.module.css';

const ScrollProgress = ({ routeKey }) => {
    const barRef = useRef(null);

    useEffect(() => {
        let rafId = null;
        let measureRafId = null;
        let maxScroll = 0;

        const updateBar = () => {
            rafId = null;
            const bar = barRef.current;
            if (!bar) return;
            const progress = maxScroll > 0 ? Math.min(1, Math.max(0, window.scrollY / maxScroll)) : 0;
            bar.style.transform = `scaleX(${progress})`;
        };

        const scheduleMeasure = (observedHeight) => {
            if (measureRafId !== null) return;
            measureRafId = window.requestAnimationFrame(() => {
                measureRafId = null;
                const docHeight = typeof observedHeight === 'number'
                    ? observedHeight
                    : document.documentElement.scrollHeight;
                maxScroll = Math.max(0, docHeight - window.innerHeight);
                updateBar();
            });
        };

        const onScroll = () => {
            if (rafId === null) {
                rafId = window.requestAnimationFrame(updateBar);
            }
        };

        const onResize = () => scheduleMeasure();

        scheduleMeasure();
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onResize, { passive: true });

        let resizeObserver;
        if (typeof ResizeObserver !== 'undefined') {
            resizeObserver = new ResizeObserver((entries) => {
                const entry = entries[0];
                scheduleMeasure(entry?.contentRect?.height);
            });
            resizeObserver.observe(document.body);
        }

        return () => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onResize);
            if (resizeObserver) resizeObserver.disconnect();
            if (rafId !== null) window.cancelAnimationFrame(rafId);
            if (measureRafId !== null) window.cancelAnimationFrame(measureRafId);
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
