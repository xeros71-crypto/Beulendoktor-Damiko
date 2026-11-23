import { Link } from 'react-router-dom';
import { BUSINESS_INFO } from '../data/businessSchema';
import { getResponsiveWebpSrcSet } from '../utils/responsiveImage';
import styles from './FrankfurtPaintSection.module.css';

const PAINT_IMAGE_1 = '/images/lackierung-kabine.jpg';
const PAINT_IMAGE_2 = '/images/lackierung-1.jpg';

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
                <div className={`${styles.topShowcase} reveal`}>
                    <div className={styles.headerCol}>
                        <span className={styles.kicker}>Autolackierer Frankfurt am Main · 60433</span>
                        <h2 id="frankfurt-paint-heading" className={styles.heading}>
                            Ihr Autolackierer in Frankfurt – Präzise Lackierung ohne unnötige Kosten
                        </h2>
                        <p className={styles.subtitle}>
                            Als spezialisierter <strong>Autolackierer in Frankfurt am Main</strong> (Hagebuttenweg 2, 60433)
                            verbinden wir moderne Kabinenlackierung mit Smart Repair und lackschadenfreier Dellentechnik.
                            Sie zahlen nur das, was technisch wirklich nötig ist – mit perfekter Farbanpassung ab dem ersten Blick.
                        </p>
                        <div className={styles.priceCallout}>
                            <div>
                                <span className={styles.priceLabel}>Spot Repair</span>
                                <strong className={styles.priceVal}>ab ca. 150–250 €</strong>
                            </div>
                            <div className={styles.priceDivider} aria-hidden="true" />
                            <div>
                                <span className={styles.priceLabel}>Teillackierung Bauteil</span>
                                <strong className={styles.priceVal}>ca. 400–600 €</strong>
                            </div>
                        </div>
                    </div>

                    <div className={styles.imagesCol}>
                        <div className={styles.mainPhoto}>
                            <picture>
                                {getResponsiveWebpSrcSet(PAINT_IMAGE_1) && (
                                    <source
                                        type="image/webp"
                                        srcSet={getResponsiveWebpSrcSet(PAINT_IMAGE_1)}
                                        sizes="(max-width: 768px) 92vw, 480px"
                                    />
                                )}
                                <img
                                    src={PAINT_IMAGE_1}
                                    alt="Fahrzeug in der modernen Lackierkabine bei Beulendoktor Damiko in Frankfurt"
                                    width={640}
                                    height={426}
                                    loading="lazy"
                                    decoding="async"
                                />
                            </picture>
                        </div>
                        <div className={styles.subPhoto}>
                            <picture>
                                {getResponsiveWebpSrcSet(PAINT_IMAGE_2) && (
                                    <source
                                        type="image/webp"
                                        srcSet={getResponsiveWebpSrcSet(PAINT_IMAGE_2)}
                                        sizes="(max-width: 768px) 45vw, 240px"
                                    />
                                )}
                                <img
                                    src={PAINT_IMAGE_2}
                                    alt="Lackierergebnis nach Teillackierung bei Damiko Frankfurt"
                                    width={640}
                                    height={426}
                                    loading="lazy"
                                    decoding="async"
                                />
                            </picture>
                        </div>
                    </div>
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

                        <div className={styles.districtList} role="list" aria-label="Bediente Frankfurter Stadtteile">
                            {frankfurtDistricts.map((district) => (
                                <span key={district} className={styles.districtTag} role="listitem">
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
