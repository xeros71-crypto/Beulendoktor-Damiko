import { Link } from 'react-router-dom';
import { BUSINESS_INFO } from '../data/businessSchema';
import { getResponsiveWebpSrcSet } from '../utils/responsiveImage';
import styles from './LeasingProcess.module.css';

const LEASING_IMAGE = '/images/leasing.jpg';
const LEASING_WEBP_SRCSET = getResponsiveWebpSrcSet(LEASING_IMAGE);

const coveredTopics = [
    'Dellen',
    'Kratzer',
    'Lackschäden',
    'Smart Repair',
    'Fahrzeugaufbereitung',
    'Hol- und Bringservice',
];

const steps = [
    {
        number: '01',
        title: 'Kontaktaufnahme',
        text: `Schreiben Sie uns einfach per WhatsApp oder rufen Sie direkt unter ${BUSINESS_INFO.phoneDisplay} an.`,
    },
    {
        number: '02',
        title: 'Informationen & Fotos',
        text: 'Senden Sie Fotos der beschädigten Stellen sowie Ihr Rückgabedatum. Auf Wunsch besichtigen wir Ihr Fahrzeug vor Ort.',
    },
    {
        number: '03',
        title: 'Kostenvoranschlag',
        text: 'Sie erhalten kurzfristig ein faires, verbindliches Angebot. Es werden nur vorab abgesprochene Arbeiten ausgeführt.',
    },
    {
        number: '04',
        title: 'Hol- und Bringservice',
        text: 'Nach Absprache holen wir Ihr Fahrzeug ab und bringen es fertig lackiert, ausgebeult und aufbereitet wieder zurück.',
    },
];

const LeasingProcess = () => {
    return (
        <section id="leasing-service" className={styles.section}>
            <div className={styles.container}>
                <div className={`${styles.topSplit} reveal`}>
                    <div className={styles.introCol}>
                        <span className={styles.kicker}>Leasingrückläufer-Service · Frankfurt &amp; Rhein-Main</span>
                        <h2 className={styles.heading}>
                            Wir kümmern uns um Schäden vor der Leasingrückgabe
                        </h2>
                        <p className={styles.subtitle}>
                            Vermeiden Sie teure Nachzahlungen und hohe Gutachter-Abzüge bei der Fahrzeugrückgabe:
                            Mit unserem 4-Schritte Sorglos-Service beheben wir sämtliche Gebrauchsspuren wirtschaftlich
                            aus einer Hand.
                        </p>

                        <div className={styles.topicPills} role="list" aria-label="Abgedeckte Leistungen vor der Leasingrückgabe">
                            {coveredTopics.map((topic) => (
                                <span key={topic} className={styles.topicPill} role="listitem">
                                    <span className={styles.pillDot} aria-hidden="true" />
                                    {topic}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className={styles.visualCol}>
                        <div className={styles.imageCard}>
                            <picture>
                                {LEASING_WEBP_SRCSET && (
                                    <source
                                        type="image/webp"
                                        srcSet={LEASING_WEBP_SRCSET}
                                        sizes="(max-width: 768px) 92vw, 480px"
                                    />
                                )}
                                <img
                                    src={LEASING_IMAGE}
                                    alt="Leasingrückläufer Beratung und Vorbereitung bei Beulendoktor Damiko"
                                    width={640}
                                    height={426}
                                    loading="lazy"
                                    decoding="async"
                                />
                            </picture>
                        </div>
                    </div>
                </div>

                <div className={`${styles.stepsRow} reveal-stagger`}>
                    {steps.map((step) => (
                        <div key={step.number} className={styles.stepCard}>
                            <div className={styles.stepHeader}>
                                <span className={styles.stepNumber}>{step.number}</span>
                                <span className={styles.stepLine} aria-hidden="true" />
                            </div>
                            <h3 className={styles.stepTitle}>{step.title}</h3>
                            <p className={styles.stepText}>{step.text}</p>
                        </div>
                    ))}
                </div>

                <div className={`${styles.noticeBar} reveal`}>
                    <div className={styles.noticeContent}>
                        <span className={styles.noticeBadge}>Frühzeitiger Check empfohlen</span>
                        <p className={styles.noticeText}>
                            <strong>Wichtiger Hinweis:</strong> Melden Sie sich idealerweise <strong>2–4 Wochen vor Ihrem Rückgabetermin</strong> –
                            so bleibt genug Zeit für den kostenlosen Foto-Check und eine entspannte Umsetzung.
                        </p>
                    </div>
                    <div className={styles.noticeActions}>
                        <Link to="/leasingruecklaeufer" className={styles.linkButton}>
                            Zur Leasing-Checkliste &rarr;
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LeasingProcess;
