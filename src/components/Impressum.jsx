import SEO from './SEO';
import BackButton from './BackButton';
import { BUSINESS_INFO, IMPRESSUM_SEO } from '../data/businessSchema';
import styles from '../styles/PageLayout.module.css';

const Impressum = () => {
    return (
        <>
            <SEO
                title={IMPRESSUM_SEO.title}
                description={IMPRESSUM_SEO.description}
                image={IMPRESSUM_SEO.image}
                imageAlt={IMPRESSUM_SEO.imageAlt}
                noindex={IMPRESSUM_SEO.noindex}
            />
            <div className={styles.legalContent}>
                <h1>Impressum</h1>

                <h2>Angaben gemäß § 5 DDG</h2>
                <p>
                    <strong>{BUSINESS_INFO.name} / {BUSINESS_INFO.legalName}</strong><br />
                    {BUSINESS_INFO.street}<br />
                    {BUSINESS_INFO.postalCode} {BUSINESS_INFO.city}
                </p>

                <h2>Kontakt</h2>
                <p>
                    Telefon: <a href={BUSINESS_INFO.phoneHref}>{BUSINESS_INFO.phoneDisplay}</a><br />
                    Hinweis: {BUSINESS_INFO.appointmentNote}.
                </p>

                <h2>Vertretung &amp; Steuerangaben</h2>
                <p>
                    Inhaber sowie E-Mail-Adresse und Umsatzsteuer-Identifikationsnummer gemäß § 27 a UStG werden vor
                    finaler Freigabe dieser Domain verbindlich ergänzt.
                </p>

                <h2>Haftung für Inhalte &amp; Links</h2>
                <p>
                    Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit
                    und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen. Unser Angebot enthält Links zu
                    externen Websites Dritter (z. B. WhatsApp, Instagram, Facebook), auf deren Inhalte wir keinen Einfluss haben.
                    Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber verantwortlich.
                </p>

                <h2>Urheberrecht</h2>
                <p>
                    Die durch die Seitenbetreiber erstellten Inhalte, Logos und Werke auf diesen Seiten unterliegen dem deutschen
                    Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen
                    des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Rechteinhabers.
                </p>

                <BackButton to="/" label="Zurück zur Startseite" />
            </div>
        </>
    );
};

export default Impressum;
