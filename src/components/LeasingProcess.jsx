import { Link } from 'react-router-dom';
import { BUSINESS_INFO } from '../data/businessSchema';
import styles from './LeasingProcess.module.css';

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
            <div className={`${styles.container} reveal`}>
                <div className={styles.header}>
                    <span className={styles.kicker}>Leasing Fahrzeug Rückgabe</span>
                    <h2 className={styles.heading}>Unser 4-Schritte Sorglos-Service</h2>
                    <p className={styles.subtitle}>
                        Vermeiden Sie teure Nachzahlungen bei der Leasingrückgabe – wir kümmern uns um Dellen,
                        Kratzer, Lackierungen und Aufbereitung aus einer Hand.
                    </p>
                </div>

                <div className={styles.grid}>
                    <div className={styles.stepsGrid}>
                        {steps.map((step) => (
                            <div key={step.number} className={styles.stepCard}>
                                <span className={styles.stepNumber}>{step.number}</span>
                                <h3 className={styles.stepTitle}>{step.title}</h3>
                                <p className={styles.stepText}>{step.text}</p>
                            </div>
                        ))}
                    </div>

                    <div className={styles.visualCol}>
                        <div className={styles.imageCard}>
                            <img
                                src="/images/leasing.jpg"
                                alt="Leasingrückläufer Beratung und Vorbereitung bei Beulendoktor Damiko"
                                loading="lazy"
                                decoding="async"
                            />
                        </div>
                        <div className={styles.ctaBox}>
                            <p>
                                <strong>Tipp:</strong> Melden Sie sich idealerweise 2–4 Wochen vor Ihrem Rückgabetermin –
                                so bleibt genug Zeit für eine entspannte Umsetzung.
                            </p>
                            <Link to="/leasingruecklaeufer" className={styles.linkButton}>
                                Zur Leasing-Checkliste &rarr;
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LeasingProcess;
