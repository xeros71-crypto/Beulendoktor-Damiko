import { Link } from 'react-router-dom';
import { BUSINESS_INFO } from '../data/businessSchema';
import { LOGO_FALLBACK_SRC, LOGO_WEBP_96, getResponsiveWebpSrcSet } from '../utils/responsiveImage';
import styles from './Hero.module.css';

const HERO_MAIN_IMAGE = '/gallery/arbeit-2-porsche-911.jpg';
const HERO_MAIN_WEBP_SRCSET = getResponsiveWebpSrcSet(HERO_MAIN_IMAGE);

const trustItems = [
    {
        highlight: 'Seit 2014',
        title: 'Etablierter Fachbetrieb',
        desc: 'Persönlich geführt in Frankfurt am Main (60433)',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
        ),
    },
    {
        highlight: 'Lack & Dellen',
        title: 'Erfahrung in Autolackierung & Dellentechnik',
        desc: 'Teillackierung, Smart Repair & PDR aus einer Hand',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="M9 12l2 2 4-4" />
            </svg>
        ),
    },
    {
        highlight: 'Profi-Technik',
        title: 'Moderne Ausstattung',
        desc: 'Staubfreie Lackierkabine, Farbanalyse & PDR-Spezialwerkzeug',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
            </svg>
        ),
    },
    {
        highlight: 'Fair & Klar',
        title: 'Transparente Angebote',
        desc: 'Schnelle Vorab-Einschätzung per WhatsApp Foto-Check',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
        ),
    },
];

const Hero = () => {
    const scrollToContact = () => {
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section className={styles.hero}>
            <div className={styles.ambientGlow} aria-hidden="true" />

            <div className={styles.inner}>
                <div className={styles.heroGrid}>
                    <div className={styles.contentCol}>
                        <div className={styles.eyebrow}>
                            <span className={styles.eyebrowAccent} aria-hidden="true" />
                            <span>Seit {BUSINESS_INFO.foundedYear} · Autolackiererei Frankfurt (60433) · Rhein-Main</span>
                        </div>

                        <h1 className={styles.title}>
                            Autolackierer in Frankfurt – Lackierung, Smart Repair &amp; Beulendoktor
                        </h1>

                        <p className={styles.description}>
                            Professionelle Autolackierung, Teillackierung, Smart Repair, mobiler Ausbeulservice &amp;
                            Leasingrückläufer-Service in Frankfurt am Main. Exakte Farbanpassung in der modernen
                            Lackierkabine – auf Wunsch bequem mit Hol- &amp; Bringservice.
                        </p>

                        <div className={styles.actions}>
                            <button type="button" className={styles.ctaPrimary} onClick={scrollToContact}>
                                <span>Individuelles Angebot anfragen</span>
                            </button>
                            <a
                                href={BUSINESS_INFO.whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.ctaSecondary}
                            >
                                <span>WhatsApp Foto-Check</span>
                            </a>
                        </div>

                        <div className={styles.quickMeta}>
                            <a href={BUSINESS_INFO.phoneHref} className={styles.phoneLink}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                </svg>
                                <span>Direktkontakt: <strong>{BUSINESS_INFO.phoneDisplay}</strong></span>
                            </a>
                            <span className={styles.metaDivider} aria-hidden="true">·</span>
                            <span className={styles.metaLocation}>Hagebuttenweg 2, 60433 Frankfurt-Nord</span>
                        </div>
                    </div>

                    <div className={styles.visualCol}>
                        <div className={styles.visualFrame}>
                            <div className={styles.frameAccentTop} aria-hidden="true" />
                            <picture>
                                {HERO_MAIN_WEBP_SRCSET && (
                                    <source
                                        type="image/webp"
                                        srcSet={HERO_MAIN_WEBP_SRCSET}
                                        sizes="(max-width: 768px) 92vw, 540px"
                                    />
                                )}
                                <img
                                    src={HERO_MAIN_IMAGE}
                                    alt="Referenzarbeit Autolackierung & Dellentechnik am Porsche 911 bei Beulendoktor Damiko in Frankfurt"
                                    className={styles.heroImage}
                                    width={640}
                                    height={640}
                                    fetchPriority="high"
                                    decoding="async"
                                />
                            </picture>

                            <div className={styles.imageOverlayBar}>
                                <div className={styles.overlayBrand}>
                                    <picture>
                                        <source type="image/webp" srcSet={LOGO_WEBP_96} />
                                        <img
                                            src={LOGO_FALLBACK_SRC}
                                            alt="Damiko Wappen"
                                            className={styles.overlayLogo}
                                            width={36}
                                            height={44}
                                            decoding="async"
                                        />
                                    </picture>
                                    <div>
                                        <span className={styles.overlayKicker}>Echte Werkstatt-Referenz</span>
                                        <strong className={styles.overlayTitle}>Werkslack-Qualität &amp; PDR-Präzision</strong>
                                    </div>
                                </div>
                                <Link to="/galerie" className={styles.overlayLink}>
                                    Referenzen &rarr;
                                </Link>
                            </div>
                        </div>

                        <div className={styles.statBadge}>
                            <span className={styles.statBadgeValue}>Bis 75 %</span>
                            <span className={styles.statBadgeText}>Kostenersparnis beim lackschadenfreien Ausbeulen</span>
                        </div>
                    </div>
                </div>

                <div className={styles.trustBar} role="region" aria-label="Vertrauensmerkmale von Beulendoktor Damiko">
                    {trustItems.map((item) => (
                        <div key={item.title} className={styles.trustItem}>
                            <div className={styles.trustIcon}>{item.icon}</div>
                            <div className={styles.trustBody}>
                                <span className={styles.trustHighlight}>{item.highlight}</span>
                                <h2 className={styles.trustTitle}>{item.title}</h2>
                                <p className={styles.trustDesc}>{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Hero;
