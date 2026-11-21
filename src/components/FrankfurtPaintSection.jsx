import { Link } from 'react-router-dom';
import { BUSINESS_INFO } from '../data/businessSchema';
import styles from './FrankfurtPaintSection.module.css';

const paintPillars = [
    {
        title: 'Stoßstange & Kotflügel lackieren',
        badge: 'Teillackierung · ca. 400–600 €',
        text: 'Parkrempler, tiefe Schrammen oder Unfallspuren an Stoßfänger, Kotflügel, Tür oder Spiegelkappe lackieren wir präzise und ohne sichtbare Übergänge.',
    },
    {
        title: 'Spot Repair & Kratzer entfernen',
        badge: 'Kleinschaden · ab ca. 150–250 €',
        text: 'Lokal begrenzte Lackschäden und Steinschläge setzen wir punktuell instand – deutlich günstiger und schneller als eine komplette Bauteillackierung.',
    },
    {
        title: 'Metallic-, Perlmutt- & Sonderlacke',
        badge: 'Exakte Farbtonbestimmung',
        text: 'Durch präzise Farbanalyse, staubfreie Lackierkabine und professionelles Beilackieren erreichen wir eine makellose Werksoptik für alle Marken.',
    },
    {
        title: 'Unfall- & Kasko-Instandsetzung',
        badge: 'Inkl. Kfz-Gutachter DK',
        text: 'Nach einem Unfall übernehmen wir Korrosionsschutz, Vorarbeit und Lackaufbau fachgerecht – auf Wunsch mit direkter Gutachter-Unterstützung.',
    },
];

const frankfurtDistricts = [
    'Frankfurter Berg',
    'Preungesheim',
    'Eschersheim',
    'Bonames',
    'Kalbach-Riedberg',
    'Dornbusch',
    'Heddernheim',
    'Nordend',
    'Bornheim',
    'Westend',
    'Bockenheim',
    'Sachsenhausen',
    'Ostend',
    'Bergen-Enkheim',
    'Gallus',
    'Niederrad',
    'Höchst',
];

const FrankfurtPaintSection = () => {
    return (
        <section id="autolackierer-frankfurt" className={styles.section} aria-labelledby="frankfurt-paint-heading">
            <div className={styles.inner}>
                <div className={`${styles.header} reveal`}>
                    <span className={styles.kicker}>Autolackierer Frankfurt am Main · 60433</span>
                    <h2 id="frankfurt-paint-heading" className={styles.heading}>
                        Ihr Autolackierer in Frankfurt – Präzise Lackierung ohne unnötige Kosten
                    </h2>
                    <p className={styles.subtitle}>
                        Als spezialisierter <strong>Autolackierer in Frankfurt am Main</strong> (Hagebuttenweg 2, 60433)
                        verbinden wir moderne Kabinenlackierung mit Smart Repair und lackschadenfreier Dellentechnik.
                        Sie zahlen nur das, was technisch wirklich nötig ist – mit perfekter Farbanpassung ab dem ersten Blick.
                    </p>
                </div>

                <div className={`${styles.grid} reveal-stagger`}>
                    {paintPillars.map((item) => (
                        <article key={item.title} className={styles.card}>
                            <span className={styles.cardBadge}>{item.badge}</span>
                            <h3 className={styles.cardTitle}>{item.title}</h3>
                            <p className={styles.cardText}>{item.text}</p>
                        </article>
                    ))}
                </div>

                <div className={`${styles.localBox} reveal`}>
                    <div className={styles.localInfo}>
                        <span className={styles.localLabel}>Standort &amp; Einsatzgebiet Frankfurt</span>
                        <h3 className={styles.localHeading}>
                            Zentral in Frankfurt-Nord – mit Hol- &amp; Bringservice für alle Stadtteile
                        </h3>
                        <p className={styles.localText}>
                            Über die <strong>A661</strong> (Ausfahrt Frankfurt-Eckenheim / Preungesheim) und die{' '}
                            <strong>B3</strong> erreichen Sie uns aus ganz Frankfurt in wenigen Minuten. Keine Zeit für
                            die Anfahrt? Nach Terminabsprache unter{' '}
                            <a href={BUSINESS_INFO.phoneHref} className={styles.inlineLink}>
                                {BUSINESS_INFO.phoneDisplay}
                            </a>{' '}
                            holen wir Ihr Fahrzeug direkt bei Ihnen ab und liefern es makellos lackiert wieder an.
                        </p>

                        <div className={styles.districtList} aria-label="Bediente Frankfurter Stadtteile">
                            {frankfurtDistricts.map((district) => (
                                <span key={district} className={styles.districtTag}>
                                    {district}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className={styles.localActions}>
                        <Link to="/lackierungen" className={styles.primaryCta}>
                            <span>Autolackierung &amp; Preise im Detail</span>
                            <span aria-hidden="true">&rarr;</span>
                        </Link>
                        <Link to="/autolackiererei-frankfurt" className={styles.secondaryCta}>
                            <span>Autolackiererei Frankfurt ansehen</span>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FrankfurtPaintSection;
