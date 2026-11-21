import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import BackButton from '../components/BackButton';
import { BUSINESS_INFO, buildServicePageSchema } from '../data/businessSchema';
import { services } from '../data/services';
import { regionalPages } from '../data/regionalPages';
import styles from '../styles/PageLayout.module.css';

const ServiceDetailPage = ({ service }) => {
    const schema = buildServicePageSchema(service);
    const relatedServices = services.filter((item) => item.slug !== service.slug);

    return (
        <>
            <SEO
                title={service.seoTitle}
                description={service.seoDescription}
                canonicalPath={`/${service.slug}`}
                image={service.heroImage}
                imageAlt={service.heroImageAlt}
                schema={schema}
            />

            <div className={styles.pageContent}>
                <nav className={styles.breadcrumb} aria-label="Breadcrumb">
                    <Link to="/">Startseite</Link>
                    <span aria-hidden="true">/</span>
                    <span aria-current="page">{service.navLabel}</span>
                </nav>

                <span className={styles.kicker}>{service.kicker}</span>
                <h1 className={styles.mainTitle}>{service.heroTitle}</h1>

                <div className={styles.heroGrid}>
                    <div className={styles.textContent}>
                        {service.highlightBox && (
                            <div className={styles.featureBox}>
                                <p>{service.highlightBox}</p>
                            </div>
                        )}

                        <p className={styles.introText}>{service.intro}</p>

                        <h2 className={styles.subHeading}>Ihre Vorteile bei Beulendoktor Damiko</h2>
                        <ul className={styles.serviceList}>
                            {service.bullets.map((bullet) => (
                                <li key={bullet} className={styles.serviceItem}>
                                    <span className={styles.checkmark}>✓</span>
                                    <span>{bullet}</span>
                                </li>
                            ))}
                        </ul>

                        <div className={styles.ctaActions} style={{ justifyContent: 'flex-start' }}>
                            <Link to="/#contact" className={styles.primaryButton}>
                                Angebot anfragen
                            </Link>
                            <a href={BUSINESS_INFO.phoneHref} className={styles.secondaryButton}>
                                {BUSINESS_INFO.phoneDisplay}
                            </a>
                        </div>
                    </div>

                    <div className={styles.imageContainer}>
                        <img
                            src={service.heroImage}
                            alt={service.heroImageAlt}
                            className={styles.image}
                            width={960}
                            height={600}
                            loading="eager"
                            fetchPriority="high"
                            decoding="async"
                        />
                    </div>
                </div>

                {service.cards && service.cards.length > 0 && (
                    <section className={styles.sectionSpacer}>
                        <h2 className={styles.sectionHeading}>Details &amp; Ablauf</h2>
                        <div className={styles.cardGrid}>
                            {service.cards.map((card) => (
                                <div key={card.title} className={styles.infoCard}>
                                    <h3>{card.title}</h3>
                                    <p>{card.text}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {service.checklist && service.checklist.length > 0 && (
                    <section className={styles.sectionSpacer}>
                        <h2 className={styles.sectionHeading}>Checkliste für Ihre Leasingrückgabe</h2>
                        <div className={styles.infoCard}>
                            <ul className={styles.serviceList} style={{ marginBottom: 0 }}>
                                {service.checklist.map((item) => (
                                    <li key={item} className={styles.serviceItem}>
                                        <span className={styles.checkmark}>✓</span>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </section>
                )}

                {service.secondaryImage && (
                    <section className={styles.twoImageGrid} aria-label="WhatsApp Foto-Check">
                        <div className={`${styles.imageContainer} ${styles.imageContainerPortrait}`}>
                            <img
                                src={service.secondaryImage}
                                alt={service.secondaryImageAlt}
                                className={`${styles.image} ${service.secondaryContain ? styles.imageContain : ''}`}
                                width={800}
                                height={600}
                                loading="lazy"
                                decoding="async"
                            />
                        </div>
                        <div className={styles.infoCard} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <h2 className={styles.subHeading}>Schneller Foto-Check per WhatsApp</h2>
                            <p style={{ marginBottom: '1.25rem' }}>
                                Senden Sie uns 2–3 Fotos des Schadens aus verschiedenen Blickwinkeln – wir teilen Ihnen
                                kurzfristig mit, welches Verfahren am sinnvollsten und wirtschaftlichsten ist.
                            </p>
                            <div className={styles.ctaActions} style={{ justifyContent: 'flex-start' }}>
                                <a
                                    href={BUSINESS_INFO.whatsappUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.primaryButton}
                                >
                                    Per WhatsApp anfragen
                                </a>
                            </div>
                        </div>
                    </section>
                )}

                {service.seoParagraphs && service.seoParagraphs.length > 0 && (
                    <section className={styles.seoBlock}>
                        <h2 className={styles.sectionHeading}>Gut zu wissen</h2>
                        {service.seoParagraphs.map((paragraph) => (
                            <p key={paragraph}>{paragraph}</p>
                        ))}
                    </section>
                )}

                {service.faqs && service.faqs.length > 0 && (
                    <section className={styles.sectionSpacer}>
                        <h2 className={styles.sectionHeading}>Häufige Fragen</h2>
                        <div className={styles.faqGrid}>
                            {service.faqs.map((faq) => (
                                <div key={faq.q} className={styles.infoCard}>
                                    <h3>{faq.q}</h3>
                                    <p>{faq.a}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                <section className={styles.sectionSpacer}>
                    <h2 className={styles.sectionHeading}>Weitere Leistungen &amp; Einsatzgebiete</h2>
                    <div className={styles.crossLinkList}>
                        {relatedServices.map((item) => (
                            <Link key={item.slug} to={`/${item.slug}`} className={styles.crossLinkPill}>
                                {item.shortTitle} &rarr;
                            </Link>
                        ))}
                        {regionalPages.map((region) => (
                            <Link key={region.slug} to={`/${region.slug}`} className={styles.crossLinkPillMuted}>
                                {region.city}
                            </Link>
                        ))}
                    </div>
                </section>

                <section className={styles.ctaSection}>
                    <h2>Jetzt unverbindlich beraten lassen</h2>
                    <p className={styles.ctaDesc}>
                        Ob telefonisch unter <strong>{BUSINESS_INFO.phoneDisplay}</strong>, direkt per WhatsApp oder über unser
                        Kontaktformular – {BUSINESS_INFO.appointmentNote.toLowerCase()}.
                    </p>
                    <div className={styles.ctaActions}>
                        <Link to="/#contact" className={styles.primaryButton}>
                            Zum Kontaktformular
                        </Link>
                        <a
                            href={BUSINESS_INFO.whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.secondaryButton}
                        >
                            WhatsApp schreiben
                        </a>
                    </div>
                </section>

                <BackButton to="/" label="Zurück zur Startseite" />
            </div>
        </>
    );
};

ServiceDetailPage.propTypes = {
    service: PropTypes.shape({
        slug: PropTypes.string.isRequired,
        navLabel: PropTypes.string.isRequired,
        shortTitle: PropTypes.string.isRequired,
        kicker: PropTypes.string.isRequired,
        heroTitle: PropTypes.string.isRequired,
        seoTitle: PropTypes.string.isRequired,
        seoDescription: PropTypes.string.isRequired,
        heroImage: PropTypes.string.isRequired,
        heroImageAlt: PropTypes.string.isRequired,
        secondaryImage: PropTypes.string,
        secondaryImageAlt: PropTypes.string,
        secondaryContain: PropTypes.bool,
        highlightBox: PropTypes.string,
        intro: PropTypes.string.isRequired,
        bullets: PropTypes.arrayOf(PropTypes.string).isRequired,
        cards: PropTypes.arrayOf(
            PropTypes.shape({
                title: PropTypes.string.isRequired,
                text: PropTypes.string.isRequired,
            }),
        ),
        checklist: PropTypes.arrayOf(PropTypes.string),
        seoParagraphs: PropTypes.arrayOf(PropTypes.string),
        faqs: PropTypes.arrayOf(
            PropTypes.shape({
                q: PropTypes.string.isRequired,
                a: PropTypes.string.isRequired,
            }),
        ),
    }).isRequired,
};

export default ServiceDetailPage;
