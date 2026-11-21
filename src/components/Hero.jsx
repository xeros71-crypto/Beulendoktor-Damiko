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
    const scrollToContact = () => {
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section className={styles.hero}>
            <div className={styles.background}>
                <div className={styles.overlay}></div>
            </div>

            <div className={styles.inner}>
                <div className={styles.content}>
                    <div className={styles.heroLogoContainer}>
                        <img
                            src="/images/damiko-logo-shield.png"
                            alt="Beulendoktor Damiko – Dellen, Lack, Leasing"
                            className={styles.heroLogo}
                            width={240}
                            height={286}
                            fetchPriority="high"
                            decoding="async"
                        />
                    </div>

                    <p className={styles.kicker}>Seit {BUSINESS_INFO.foundedYear} · Frankfurt · Wetterau · Rhein-Main</p>

                    <h1 className={styles.title}>
                        Autolackierung, Smart Repair &amp; Beulendoktor
                    </h1>

                    <p className={styles.description}>
                        Smart Repair · Lackierung · Mobiler Ausbeulservice · Leasingrückläufer-Service.
                        Präzises Handwerk für makellosen Lack und spürbaren Werterhalt – auch bequem mit Hol- &amp; Bringservice.
                    </p>

                    <div className={styles.actions}>
                        <button type="button" className={styles.ctaPrimary} onClick={scrollToContact}>
                            Individuelles Angebot anfragen
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

                <div className={styles.uspStrip} aria-label="Unsere Qualitätsversprechen">
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
            </div>
        </section>
    );
};

export default Hero;
