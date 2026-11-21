import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import BackButton from '../components/BackButton';
import { BUSINESS_INFO, buildRegionalPageSchema } from '../data/businessSchema';
import { services } from '../data/services';
import { getNearbyRegionalPages } from '../data/regionalPages';
import styles from '../styles/PageLayout.module.css';

const servicesBySlug = new Map(services.map((service) => [service.slug, service]));

const RegionalLandingPage = ({ page }) => {
    const schema = buildRegionalPageSchema(page);
    const nearbyRegions = getNearbyRegionalPages(page);

    const paragraphs = page.localParagraphs?.length
        ? page.localParagraphs
        : page.localContext || [];

    const recommendedEntries = (page.recommendedServices || [])
        .map((entry) => {
            const service = servicesBySlug.get(entry.slug);
            return service ? { service, localDesc: entry.localDesc } : null;
        })
        .filter(Boolean);

    const recommendedSlugSet = new Set(recommendedEntries.map((entry) => entry.service.slug));
    const additionalServices = recommendedEntries.length > 0
        ? services.filter((service) => !recommendedSlugSet.has(service.slug))
        : services;

    const quickFacts = [
        page.postalCode && { label: 'Postleitzahl', value: page.postalCode },
        page.distanceKm && { label: 'Entfernung (FFM-Nord)', value: page.distanceKm },
        page.driveTime && {
            label: 'Anfahrt',
            value: page.routeSummary ? `${page.driveTime} (${page.routeSummary})` : page.driveTime,
        },
        page.serviceMode && { label: 'Service-Optionen', value: page.serviceMode },
    ].filter(Boolean);

    const imageAlt = page.imageAlt || `Beulendoktor Damiko – Autolackierung & Dellentechnik für ${page.city}`;

    return (
        <>
            <SEO
                title={page.title}
                description={page.description}
                canonicalPath={`/${page.slug}`}
                image={page.image}
                imageAlt={imageAlt}
                schema={schema}
            />

            <div className={styles.pageContent}>
                <nav className={styles.breadcrumb} aria-label="Breadcrumb">
                    <Link to="/">Startseite</Link>
                    <span aria-hidden="true">/</span>
                    <span aria-current="page">{page.breadcrumbLabel || page.city}</span>
                </nav>

                <span className={styles.kicker}>
                    {page.kicker || `Regionaler Service · ${page.city}`}
                </span>
                <h1 className={styles.mainTitle}>{page.heroHeading}</h1>

                <div className={styles.heroGrid}>
                    <div className={styles.textContent}>
                        {page.highlightBox && (
                            <div className={styles.featureBox}>
                                <p>{page.highlightBox}</p>
                            </div>
                        )}

                        <p className={styles.introText}>{page.intro}</p>

                        <h2 className={styles.subHeading}>
                            {page.highlightsHeading || `Unsere Schwerpunkte für ${page.city}`}
                        </h2>
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
                            alt={imageAlt}
                            className={styles.image}
                            width={960}
                            height={600}
                            loading="eager"
                            fetchPriority="high"
                            decoding="async"
                        />
                    </div>
                </div>

                {quickFacts.length > 0 && (
                    <section className={styles.quickFactsBar} aria-label={`Standort-Fakten für ${page.city}`}>
                        {quickFacts.map((fact) => (
                            <div key={fact.label} className={styles.quickFactItem}>
                                <span className={styles.quickFactLabel}>{fact.label}</span>
                                <strong className={styles.quickFactValue}>{fact.value}</strong>
                            </div>
                        ))}
                    </section>
                )}

                {page.localCases && page.localCases.length > 0 && (
                    <section className={styles.sectionSpacer}>
                        <h2 className={styles.sectionHeading}>
                            {page.localCasesHeading || `Typische Reparaturen für ${page.city}`}
                        </h2>
                        <div className={styles.cardGrid}>
                            {page.localCases.map((item) => (
                                <article key={item.title} className={styles.infoCard}>
                                    {item.badge && <span className={styles.caseBadge}>{item.badge}</span>}
                                    <h3>{item.title}</h3>
                                    <p>{item.text}</p>
                                </article>
                            ))}
                        </div>
                    </section>
                )}

                {paragraphs.length > 0 && (
                    <section className={styles.seoBlock}>
                        <h2 className={styles.sectionHeading}>
                            {page.localSectionHeading || `Ihr Ansprechpartner für ${page.city} & Umgebung`}
                        </h2>
                        {paragraphs.map((paragraph) => (
                            <p key={paragraph}>{paragraph}</p>
                        ))}
                    </section>
                )}

                {(page.directionsNote || (page.districts && page.districts.length > 0)) && (
                    <section className={styles.sectionSpacer}>
                        <h2 className={styles.sectionHeading}>
                            {page.directionsHeading || `Anfahrt & Einsatzgebiet in ${page.city}`}
                        </h2>
                        <div className={styles.districtBox}>
                            {page.directionsNote && (
                                <p className={styles.districtIntro}>{page.directionsNote}</p>
                            )}
                            {page.districts && page.districts.length > 0 && (
                                <div className={styles.districtTags} aria-label={`Stadtteile und Ortsteile in ${page.city}`}>
                                    {page.districts.map((district) => (
                                        <span key={district} className={styles.districtTag}>
                                            {district}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </section>
                )}

                <section className={styles.sectionSpacer}>
                    <h2 className={styles.sectionHeading}>
                        {recommendedEntries.length > 0
                            ? `Empfohlene Leistungen für ${page.city}`
                            : `Unsere Leistungen für ${page.city}`}
                    </h2>

                    {recommendedEntries.length > 0 ? (
                        <>
                            <div className={styles.cardGrid}>
                                {recommendedEntries.map(({ service, localDesc }) => (
                                    <Link key={service.slug} to={`/${service.slug}`} className={styles.infoCard}>
                                        <h3>{service.shortTitle}</h3>
                                        <p>{localDesc || service.shortDesc}</p>
                                    </Link>
                                ))}
                            </div>
                            {additionalServices.length > 0 && (
                                <div className={styles.crossLinkList} style={{ marginTop: '1.5rem' }}>
                                    {additionalServices.map((service) => (
                                        <Link key={service.slug} to={`/${service.slug}`} className={styles.crossLinkPillMuted}>
                                            {service.shortTitle} &rarr;
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </>
                    ) : (
                        <div className={styles.cardGrid}>
                            {services.map((service) => (
                                <Link key={service.slug} to={`/${service.slug}`} className={styles.infoCard}>
                                    <h3>{service.shortTitle}</h3>
                                    <p>{service.shortDesc}</p>
                                </Link>
                            ))}
                        </div>
                    )}
                </section>

                {page.faqs && page.faqs.length > 0 && (
                    <section className={`${styles.sectionSpacer} ${styles.faqBlock}`}>
                        <h2 className={styles.sectionHeading}>
                            {page.faqsHeading || `Häufige Fragen aus ${page.city}`}
                        </h2>
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

                {nearbyRegions.length > 0 && (
                    <section className={styles.sectionSpacer}>
                        <h2 className={styles.sectionHeading}>Nachbarorte &amp; Einsatzgebiete rund um {page.city}</h2>
                        <div className={styles.crossLinkList}>
                            {nearbyRegions.map((region) => (
                                <Link key={region.slug} to={`/${region.slug}`} className={styles.crossLinkPill}>
                                    {region.footerLabel || `Beulendoktor ${region.city}`} &rarr;
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                <section className={styles.ctaSection}>
                    <h2>{page.ctaHeading || `Termin vereinbaren für ${page.city}`}</h2>
                    <p className={styles.ctaDesc}>
                        {page.ctaText ||
                            'Senden Sie uns Fotos Ihres Schadens per WhatsApp oder über das Kontaktformular – wir melden uns kurzfristig mit einem fairen Kostenvoranschlag.'}
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
        breadcrumbLabel: PropTypes.string,
        areaServed: PropTypes.string.isRequired,
        areaType: PropTypes.string,
        postalCode: PropTypes.string,
        distanceKm: PropTypes.string,
        driveTime: PropTypes.string,
        routeSummary: PropTypes.string,
        serviceMode: PropTypes.string,
        title: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        image: PropTypes.string.isRequired,
        imageAlt: PropTypes.string,
        kicker: PropTypes.string,
        heroHeading: PropTypes.string.isRequired,
        intro: PropTypes.string.isRequired,
        highlightBox: PropTypes.string,
        highlightsHeading: PropTypes.string,
        highlights: PropTypes.arrayOf(PropTypes.string).isRequired,
        localSectionHeading: PropTypes.string,
        localParagraphs: PropTypes.arrayOf(PropTypes.string),
        localContext: PropTypes.arrayOf(PropTypes.string),
        localCasesHeading: PropTypes.string,
        localCases: PropTypes.arrayOf(
            PropTypes.shape({
                title: PropTypes.string.isRequired,
                badge: PropTypes.string,
                text: PropTypes.string.isRequired,
            }),
        ),
        directionsHeading: PropTypes.string,
        directionsNote: PropTypes.string,
        districts: PropTypes.arrayOf(PropTypes.string),
        recommendedServices: PropTypes.arrayOf(
            PropTypes.shape({
                slug: PropTypes.string.isRequired,
                localDesc: PropTypes.string,
            }),
        ),
        faqsHeading: PropTypes.string,
        faqs: PropTypes.arrayOf(
            PropTypes.shape({
                q: PropTypes.string.isRequired,
                a: PropTypes.string.isRequired,
            }),
        ),
        nearbySlugs: PropTypes.arrayOf(PropTypes.string),
        ctaHeading: PropTypes.string,
        ctaText: PropTypes.string,
    }).isRequired,
};

export default RegionalLandingPage;
