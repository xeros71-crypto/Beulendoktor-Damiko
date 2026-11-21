import { BUSINESS_INFO } from '../data/businessSchema';
import styles from './About.module.css';

const About = () => {
    return (
        <section id="about" className={styles.about}>
            <div className={styles.container}>
                <div className={`${styles.imageWrapper} reveal-left`}>
                    <div className={styles.imageFrame}>
                        <img
                            src="/images/smart-repair-1.jpg"
                            alt="Präzise Autolackierung und Smart Repair bei Beulendoktor Damiko"
                            className={styles.image}
                            width={640}
                            height={426}
                            loading="lazy"
                            decoding="async"
                        />
                        <div className={styles.imageSheen} aria-hidden="true" />
                    </div>
                    <div className={styles.imageDecor} aria-hidden="true"></div>
                </div>

                <div className={`${styles.content} reveal-right`}>
                    <span className={styles.kicker}>Über uns · Seit {BUSINESS_INFO.foundedYear}</span>
                    <h2 className={styles.subHeading}>
                        Ihr Spezialist für Autolackierung &amp; mobilen Kfz-Ausbeulservice
                    </h2>
                    <p className={styles.text}>
                        Seit <strong>{BUSINESS_INFO.foundedYear}</strong> steht <strong>{BUSINESS_INFO.name}</strong> in{' '}
                        <strong>Frankfurt am Main</strong> für präzises Handwerk rund um Autolackierungen,
                        Smart Repair und lackschadenfreie Dellentechnik – im gesamten Raum Frankfurt,
                        der Wetterau und im Rhein-Main-Gebiet.
                    </p>
                    <p className={styles.text}>
                        Jeder Schaden wird bei uns individuell bewertet: Bevor teuer getauscht oder komplett lackiert wird,
                        prüfen wir ehrlich die wirtschaftlichste Lösung – vom lackschadenfreien Ausbeulen über Spot Repair
                        bis zur exakten Teillackierung. Transparente Absprachen, erstklassige Materialien und eine hohe
                        Weiterempfehlungsrate zeichnen unsere Arbeit aus.
                    </p>

                    <div className={`${styles.stats} reveal-stagger`}>
                        <div className={styles.statItem}>
                            <span className={styles.statNumber}>Seit 2014</span>
                            <span className={styles.statLabel}>Erfahrung in Frankfurt &amp; Rhein-Main</span>
                        </div>
                        <div className={styles.statItem}>
                            <span className={styles.statNumber}>Bis 75 %</span>
                            <span className={styles.statLabel}>Ersparnis durch Dellentechnik</span>
                        </div>
                        <div className={styles.statItem}>
                            <span className={styles.statNumber}>Mobil</span>
                            <span className={styles.statLabel}>Vor-Ort- &amp; Hol-/Bringservice</span>
                        </div>
                        <div className={styles.statItem}>
                            <span className={styles.statNumber}>100 %</span>
                            <span className={styles.statLabel}>Transparente Kostenvoranschläge</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
