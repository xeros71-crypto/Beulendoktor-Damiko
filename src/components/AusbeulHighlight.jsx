import { Link } from 'react-router-dom';
import { BUSINESS_INFO } from '../data/businessSchema';
import { getResponsiveWebpSrcSet } from '../utils/responsiveImage';
import styles from './AusbeulHighlight.module.css';

const PDR_IMAGE = '/gallery/arbeit-6-audi-blau.jpg';
const PDR_WEBP_SRCSET = getResponsiveWebpSrcSet(PDR_IMAGE);

const pdrAdvantages = [
    {
        title: 'Lackschadenfreie Dellenentfernung',
        desc: 'Präzises Ausdrücken und Ziehen von Park-, Tür- und Kastaniendellen ganz ohne Spachteln oder Schleifen.',
    },
    {
        title: 'Erhalt des Original-Werkslacks',
        desc: 'Kein Farbunterschied, keine Wertminderung und originale Lackschichtdicke für Leasing & Wiederverkauf.',
    },
    {
        title: 'Mobiler Service & Werkstatt',
        desc: 'Flexibler Einsatz direkt bei Ihnen vor Ort in Frankfurt, der Wetterau & im gesamten Rhein-Main-Gebiet.',
    },
    {
        title: 'Wirtschaftliche Reparatur',
        desc: 'Kurze Reparaturdauer und drastisch geringere Kosten gegenüber klassischem Teiletausch mit Neulackierung.',
    },
];

const AusbeulHighlight = () => {
    return (
        <section id="ausbeulservice-highlight" className={styles.section} aria-labelledby="pdr-highlight-heading">
            <div className={styles.inner}>
                <div className={styles.layout}>
                    <div className={`${styles.visualCol} reveal-left`}>
                        <div className={styles.imageFrame}>
                            <picture>
                                {PDR_WEBP_SRCSET && (
                                    <source
                                        type="image/webp"
                                        srcSet={PDR_WEBP_SRCSET}
                                        sizes="(max-width: 768px) 92vw, 520px"
                                    />
                                )}
                                <img
                                    src={PDR_IMAGE}
                                    alt="Lackschadenfreie Dellenentfernung und Karosserie-Instandsetzung bei Beulendoktor Damiko"
                                    width={640}
                                    height={640}
                                    loading="lazy"
                                    decoding="async"
                                />
                            </picture>
                            <div className={styles.savingsCard}>
                                <span className={styles.savingsNumber}>Bis zu 75 %</span>
                                <span className={styles.savingsLabel}>
                                    mögliche Kostenersparnis gegenüber Teiletausch &amp; Neulackierung
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className={`${styles.contentCol} reveal-right`}>
                        <span className={styles.kicker}>Spezialgebiet · PDR Dellentechnik</span>
                        <h2 id="pdr-highlight-heading" className={styles.heading}>
                            Mobiler Ausbeulservice – Dellen entfernen ohne Lackieren
                        </h2>
                        <p className={styles.intro}>
                            Solange die Lackoberfläche unbeschädigt ist, ist die lackschadenfreie Dellenentfernung (PDR)
                            die technisch hochwertigste und wirtschaftlichste Methode: Ihr originaler Werkslack bleibt
                            vollständig erhalten.
                        </p>

                        <div className={styles.featureGrid}>
                            {pdrAdvantages.map((item) => (
                                <div key={item.title} className={styles.featureCard}>
                                    <span className={styles.checkIcon} aria-hidden="true">✓</span>
                                    <div>
                                        <h3 className={styles.featureTitle}>{item.title}</h3>
                                        <p className={styles.featureDesc}>{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className={styles.actions}>
                            <Link to="/ausbeulservice" className={styles.primaryBtn}>
                                <span>Ausbeulservice im Detail</span>
                                <span aria-hidden="true">&rarr;</span>
                            </Link>
                            <a
                                href={BUSINESS_INFO.whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.secondaryBtn}
                            >
                                WhatsApp Foto-Check
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AusbeulHighlight;
