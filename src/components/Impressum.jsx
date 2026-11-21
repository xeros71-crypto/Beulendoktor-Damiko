import SEO from './SEO';
import BackButton from './BackButton';
import { BUSINESS_INFO } from '../data/businessSchema';
import styles from '../styles/PageLayout.module.css';

const Impressum = () => {
    return (
        <>
            <SEO
                title="Impressum"
                description={`Impressum und gesetzliche Anbieterkennzeichnung von ${BUSINESS_INFO.name} (${BUSINESS_INFO.legalName}), ${BUSINESS_INFO.street}, ${BUSINESS_INFO.postalCode} ${BUSINESS_INFO.city}.`}
            />
            <div className={styles.legalContent}>
                <h1>Impressum</h1>

                <div className={styles.legalNotice}>
                    <strong>Hinweis für den Livegang:</strong> Auf der bisherigen Website (<code>damiko.de/impressum</code>)
                    wurde lediglich ein nicht gerenderter Shortcode angezeigt. Bitte ergänzen Sie vor dem finalen
                    Veröffentlichen den vollständigen Inhabernamen, die E-Mail-Adresse sowie ggf. die USt-IdNr.
                </div>

                <h2>Angaben gemäß § 5 DDG</h2>
                <p>
                    <strong>{BUSINESS_INFO.name} / {BUSINESS_INFO.legalName}</strong><br />
                    Inhaber: [Bitte vollständigen Namen ergänzen]<br />
                    {BUSINESS_INFO.street}<br />
                    {BUSINESS_INFO.postalCode} {BUSINESS_INFO.city}
                </p>

                <h2>Kontakt</h2>
                <p>
                    Telefon: <a href={BUSINESS_INFO.phoneHref}>{BUSINESS_INFO.phoneDisplay}</a><br />
                    E-Mail: [Bitte E-Mail-Adresse ergänzen, z. B. info@damiko.de]<br />
                    Hinweis: {BUSINESS_INFO.appointmentNote}.
                </p>

                <h2>Umsatzsteuer-ID</h2>
                <p>
                    Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:<br />
                    [Bitte USt-IdNr. oder Hinweis auf Kleinunternehmerregelung nach § 19 UStG ergänzen]
                </p>

                <h2>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
                <p>
                    [Bitte vollständigen Namen ergänzen]<br />
                    {BUSINESS_INFO.street}<br />
                    {BUSINESS_INFO.postalCode} {BUSINESS_INFO.city}
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
