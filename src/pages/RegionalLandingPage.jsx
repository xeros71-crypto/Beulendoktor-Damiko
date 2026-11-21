import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import BackButton from '../components/BackButton';
import { BUSINESS_INFO, SITE_URL, buildAutoRepairSchema, buildFaqSchema } from '../data/businessSchema';
import styles from '../styles/PageLayout.module.css';

const RegionalLandingPage = ({ page }) => {
    const schema = [
        buildAutoRepairSchema({
            url: `${SITE_URL}/${page.slug}`,
            image: `${SITE_URL}${page.image}`,
            description: page.description,
            areaServed: page.areaServed,
        }),
        ...(page.faqs && page.faqs.length > 0 ? [buildFaqSchema(page.faqs)] : []),
    ];

    return (
        <>
            <SEO
                title={page.title}
                description={page.description}
                keywords={page.keywords}
                schema={schema}
            />

            <div className={styles.pageContent}>
                <span className={styles.kicker}>Regionaler Service · {page.city}</span>
                <h1 className={styles.mainTitle}>{page.heroHeading}</h1>

                <div className={styles.heroGrid}>
                    <div className={styles.textContent}>
                        <p className={styles.introText}>{page.intro}</p>

                        <h2 className={styles.subHeading}>Unsere Schwerpunkte für {page.city}</h2>
                        <ul className={styles.serviceList}>
                            {page.highlights.map((item) => (
                                <li key={item} className={styles.serviceItem}>
                                    <span className={styles.checkmark}>✓</span>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>

                        <div className={styles.ctaActions} style={{ justifyContent: 'flex-start' }}>
                            <Link to="/#contact" className={styles.primaryButton}>
                                Jetzt anfragen
                            </Link>
                            <a href={BUSINESS_INFO.phoneHref} className={styles.secondaryButton}>
                                {BUSINESS_INFO.phoneDisplay}
                            </a>
                        </div>
                    </div>

                    <div className={styles.imageContainer}>
                        <img
                            src={page.image}
                            alt={`Beulendoktor Damiko – Autolackierung & Dellentechnik für ${page.city}`}
                            className={styles.image}
                            loading="eager"
                            decoding="async"
                        />
                    </div>
                </div>

                {page.faqs && page.faqs.length > 0 && (
                    <section className={styles.sectionSpacer}>
                        <h2 className={styles.sectionHeading}>Häufige Fragen aus {page.city}</h2>
                        <div className={styles.faqGrid}>
                            {page.faqs.map((faq) => (
                                <div key={faq.q} className={styles.infoCard}>
                                    <h3>{faq.q}</h3>
                                    <p>{faq.a}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                <section className={styles.ctaSection}>
                    <h2>Termin vereinbaren für {page.city}</h2>
                    <p className={styles.ctaDesc}>
                        Senden Sie uns Fotos Ihres Schadens per WhatsApp oder über das Kontaktformular – wir melden uns
                        kurzfristig mit einem fairen Kostenvoranschlag.
                    </p>
                    <div className={styles.ctaActions}>
                        <Link to="/#contact" className={styles.primaryButton}>
                            Kostenlose Anfrage senden
                        </Link>
                        <a
                            href={BUSINESS_INFO.whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.secondaryButton}
                        >
                            WhatsApp Foto-Check
                        </a>
                    </div>
                </section>

                <BackButton to="/" label="Zurück zur Startseite" />
            </div>
        </>
    );
};

RegionalLandingPage.propTypes = {
    page: PropTypes.shape({
        slug: PropTypes.string.isRequired,
        city: PropTypes.string.isRequired,
        areaServed: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        keywords: PropTypes.string,
        image: PropTypes.string.isRequired,
        heroHeading: PropTypes.string.isRequired,
        intro: PropTypes.string.isRequired,
        highlights: PropTypes.arrayOf(PropTypes.string).isRequired,
        faqs: PropTypes.arrayOf(
            PropTypes.shape({
                q: PropTypes.string.isRequired,
                a: PropTypes.string.isRequired,
            }),
        ),
    }).isRequired,
};

export default RegionalLandingPage;
