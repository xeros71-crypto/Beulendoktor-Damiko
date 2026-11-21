import { useEffect, useRef } from 'react';
import { BUSINESS_INFO } from '../data/businessSchema';
import styles from './Hero.module.css';

const usps = [
    {
        title: 'Professionell',
        desc: 'Über 10 Jahre Erfahrung in Autolackierung & Dellentechnik',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
        ),
    },
    {
        title: 'Bestes Equipment',
        desc: 'Moderne Lackierkabine, Dellen-Lichttechnik & Profi-Werkzeuge',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
            </svg>
        ),
    },
    {
        title: 'Exzellente Materialien',
        desc: 'Hochwertige Lacksysteme & Lackpflege für langanhaltenden Werterhalt',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="M9 12l2 2 4-4" />
            </svg>
        ),
    },
];

const Hero = () => {
    const bgImageRef = useRef(null);
    const contentRef = useRef(null);

    useEffect(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        let rafId = null;
        const applyParallax = () => {
            rafId = null;
            const y = window.scrollY;
            if (y > window.innerHeight * 1.4) return;

            if (bgImageRef.current) {
                bgImageRef.current.style.transform = `translate3d(0, ${y * 0.24}px, 0) scale(${1.06 + y * 0.00018})`;
            }
            if (contentRef.current) {
                const opacity = Math.max(0.15, 1 - y / (window.innerHeight * 0.85));
                contentRef.current.style.transform = `translate3d(0, ${y * 0.12}px, 0)`;
                contentRef.current.style.opacity = String(opacity);
            }
        };

        const onScroll = () => {
            if (rafId === null) {
                rafId = window.requestAnimationFrame(applyParallax);
            }
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', onScroll);
            if (rafId !== null) window.cancelAnimationFrame(rafId);
        };
    }, []);

    const scrollToContact = () => {
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    };

    const scrollToServices = () => {
        document.getElementById('leistungen')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section className={styles.hero}>
            <div className={styles.background}>
                <div ref={bgImageRef} className={styles.bgImage} aria-hidden="true" />
                <div className={styles.lightSweep} aria-hidden="true" />
                <div className={styles.overlay} aria-hidden="true" />
            </div>

            <div className={styles.inner}>
                <div ref={contentRef} className={styles.content}>
                    <div className={styles.heroLogoContainer}>
                        <div className={styles.logoAura} aria-hidden="true" />
                        <img
                            src="/images/damiko-logo-shield.png"
                            alt="Beulendoktor Damiko – Dellen, Lack, Leasing"
                            className={styles.heroLogo}
                            width={220}
                            height={262}
                            fetchPriority="high"
                            decoding="async"
                        />
                    </div>

                    <p className={styles.kicker}>
                        <span className={styles.kickerLine} aria-hidden="true" />
                        <span>Seit {BUSINESS_INFO.foundedYear} · Frankfurt · Wetterau · Rhein-Main</span>
                        <span className={styles.kickerLine} aria-hidden="true" />
                    </p>

                    <h1 className={styles.title}>
                        Autolackierung, Smart Repair &amp; Beulendoktor
                    </h1>

                    <p className={styles.description}>
                        Smart Repair · Lackierung · Mobiler Ausbeulservice · Leasingrückläufer-Service.
                        Präzises Handwerk für makellosen Lack und spürbaren Werterhalt – auch bequem mit Hol- &amp; Bringservice.
                    </p>

                    <div className={styles.actions}>
                        <button type="button" className={styles.ctaPrimary} onClick={scrollToContact}>
                            <span>Individuelles Angebot anfragen</span>
                        </button>
                        <a href={BUSINESS_INFO.phoneHref} className={styles.ctaSecondary}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                            </svg>
                            <span>{BUSINESS_INFO.phoneDisplay}</span>
                        </a>
                        <a
                            href={BUSINESS_INFO.whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.ctaWhatsapp}
                        >
                            <span>WhatsApp Foto-Check</span>
                        </a>
                    </div>
                </div>

                <div className={`${styles.uspStrip} reveal-stagger`} aria-label="Unsere Qualitätsversprechen">
                    {usps.map((usp) => (
                        <div key={usp.title} className={styles.uspCard}>
                            <div className={styles.uspIcon}>{usp.icon}</div>
                            <div>
                                <h2 className={styles.uspTitle}>{usp.title}</h2>
                                <p className={styles.uspDesc}>{usp.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    type="button"
                    className={styles.scrollCue}
                    onClick={scrollToServices}
                    aria-label="Nach unten zu den Leistungen scrollen"
                >
                    <span>Entdecken</span>
                    <span className={styles.scrollLine} aria-hidden="true" />
                </button>
            </div>
        </section>
    );
};

export default Hero;
