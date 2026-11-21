import { Link } from 'react-router-dom';
import { BUSINESS_INFO } from '../data/businessSchema';
import { REGIONAL_GROUPS } from '../data/regionalPages';
import { LOGO_FALLBACK_SRC, LOGO_WEBP_320 } from '../utils/responsiveImage';
import styles from './Footer.module.css';

const Footer = () => {
    return (
        <footer id="site-footer" className={styles.footer}>
            <div className={styles.brandBar}>
                <Link to="/" className={styles.logoLink} aria-label="Beulendoktor Damiko Startseite">
                    <picture>
                        <source type="image/webp" srcSet={LOGO_WEBP_320} />
                        <img
                            src={LOGO_FALLBACK_SRC}
                            alt="Lack- & Beulendoktor Damiko – Dellen, Lack, Leasing"
                            className={styles.logoImage}
                            width={160}
                            height={195}
                            loading="lazy"
                            decoding="async"
                        />
                    </picture>
                </Link>

                <div className={styles.socialLinks} role="group" aria-label="Social Media">
                    <a
                        href={BUSINESS_INFO.instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.socialLink}
                        aria-label="Beulendoktor Damiko auf Instagram"
                        title="Instagram"
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                        </svg>
                    </a>
                    <a
                        href={BUSINESS_INFO.facebookUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.socialLink}
                        aria-label="Beulendoktor Damiko auf Facebook"
                        title="Facebook"
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                        </svg>
                    </a>
                </div>

                <a
                    href={BUSINESS_INFO.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.whatsappButton}
                    aria-label="WhatsApp Chat mit Beulendoktor Damiko starten"
                >
                    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M20.52 3.48A11.86 11.86 0 0 0 12.06 0C5.49 0 .15 5.34.15 11.91c0 2.1.55 4.15 1.59 5.96L0 24l6.31-1.65a11.87 11.87 0 0 0 5.75 1.47h.01c6.57 0 11.91-5.34 11.91-11.91 0-3.18-1.24-6.17-3.46-8.43Zm-8.46 18.33h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.27c0-5.45 4.44-9.89 9.9-9.89 2.64 0 5.13 1.03 7 2.9a9.82 9.82 0 0 1 2.9 7c0 5.45-4.44 9.89-9.91 9.89Zm5.42-7.41c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.06 2.88 1.21 3.08.15.2 2.09 3.19 5.06 4.47.71.31 1.26.49 1.69.63.71.23 1.35.2 1.86.12.57-.08 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35Z" />
                    </svg>
                    <span>WhatsApp schreiben</span>
                </a>
            </div>

            <div className={styles.container}>
                <div className={styles.column}>
                    <p className={styles.title}>Über Damiko</p>
                    <p className={styles.text}>
                        Seit {BUSINESS_INFO.foundedYear} Ihr Spezialist für Autolackierungen, Smart Repair,
                        lackschadenfreie Dellentechnik, Hagelschäden und Leasingrückläufer in Frankfurt am Main,
                        der Wetterau und im gesamten Rhein-Main-Gebiet.
                    </p>
                    <p className={styles.partnerBadge}>{BUSINESS_INFO.partnerNote}</p>
                </div>

                <div className={styles.column}>
                    <p className={styles.title}>Leistungen</p>
                    <ul className={styles.links}>
                        <li><Link to="/lackierungen">Autolackierungen</Link></li>
                        <li><Link to="/ausbeulservice">Mobiler Ausbeulservice</Link></li>
                        <li><Link to="/smart-repair">Smart Repair</Link></li>
                        <li><Link to="/leasingruecklaeufer">Leasingrückläufer-Service</Link></li>
                        <li><Link to="/hagelschaeden">Hagelschäden</Link></li>
                        <li><Link to="/fahrzeugaufbereitung">Fahrzeugaufbereitung</Link></li>
                    </ul>
                </div>

                <div className={styles.column}>
                    <p className={styles.title}>Kontakt &amp; Rechtliches</p>
                    <p>{BUSINESS_INFO.name}</p>
                    <p>{BUSINESS_INFO.street}</p>
                    <p>{BUSINESS_INFO.postalCode} {BUSINESS_INFO.city}</p>
                    <p className={styles.contactItem}>
                        <a href={BUSINESS_INFO.phoneHref}>{BUSINESS_INFO.phoneDisplay}</a>
                    </p>
                    <p className={styles.appointmentNote}>{BUSINESS_INFO.appointmentNote}</p>
                    <ul className={styles.legalLinks}>
                        <li><Link to="/impressum">Impressum</Link></li>
                        <li><Link to="/datenschutz">Datenschutz</Link></li>
                    </ul>
                </div>
            </div>

            <nav className={styles.regionsSection} aria-label="Einzugsgebiet im 30 km Umkreis um Frankfurt">
                <p className={styles.regionsHeading}>Einzugsgebiet (30 km Umkreis Frankfurt am Main)</p>
                <div className={styles.regionsGroups}>
                    {REGIONAL_GROUPS.map((group) => (
                        <div key={group.id} className={styles.regionsRow}>
                            <span className={styles.regionsLabel}>{group.label}:</span>
                            <div className={styles.regionsLinks}>
                                {group.pages.map((page, index) => (
                                    <span key={page.slug} style={{ display: 'contents' }}>
                                        {index > 0 && <span className={styles.regionSep} aria-hidden="true">·</span>}
                                        <Link to={`/${page.slug}`}>{page.shortCity || page.city}</Link>
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </nav>

            <div className={styles.bottom}>
                <p>&copy; {new Date().getFullYear()} {BUSINESS_INFO.name} · {BUSINESS_INFO.legalName}. Alle Rechte vorbehalten.</p>
            </div>
        </footer>
    );
};

export default Footer;
