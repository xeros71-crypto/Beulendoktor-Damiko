import SEO from './SEO';
import BackButton from './BackButton';
import { BUSINESS_INFO } from '../data/businessSchema';
import styles from '../styles/PageLayout.module.css';

const Datenschutz = () => {
    return (
        <>
            <SEO
                title="Datenschutzerklärung"
                description={`Datenschutzerklärung gemäß DSGVO und TDDDG für ${BUSINESS_INFO.name} (damiko.de).`}
            />
            <div className={styles.legalContent}>
                <h1>Datenschutzerklärung</h1>

                <h2>1. Verantwortlicher</h2>
                <p>
                    <strong>{BUSINESS_INFO.name} / {BUSINESS_INFO.legalName}</strong><br />
                    {BUSINESS_INFO.street}<br />
                    {BUSINESS_INFO.postalCode} {BUSINESS_INFO.city}<br />
                    Telefon: <a href={BUSINESS_INFO.phoneHref}>{BUSINESS_INFO.phoneDisplay}</a><br />
                    E-Mail: [Bitte E-Mail-Adresse ergänzen, z. B. info@damiko.de]
                </p>

                <h2>2. Hosting &amp; Bereitstellung (Vercel)</h2>
                <p>
                    Diese Website wird über die Plattform <strong>Vercel Inc.</strong> (440 N Barranca Ave #4133, Covina, CA 91723, USA)
                    bereitgestellt. Beim Aufruf der Website verarbeitet der Hostinganbieter automatisch technische Zugriffsdaten
                    (Server-Logfiles wie IP-Adresse, Zeitpunkt des Zugriffs, Browsertyp und aufgerufene URL), um die Sicherheit,
                    Stabilität und Auslieferung der Website zu gewährleisten. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO.
                </p>

                <h2>3. Lokale Schriftarten (DSGVO-konform)</h2>
                <p>
                    Alle auf dieser Website verwendeten Schriftarten (<code>Inter</code>) sind lokal auf unserem Server gespeichert.
                    Beim Laden der Seite wird keine Verbindung zu externen Schriftarten-Servern (wie Google Fonts) aufgebaut.
                </p>

                <h2>4. Kontaktformular, Datenbank (Firebase Firestore) &amp; E-Mail-Versand (Resend)</h2>
                <p>
                    Wenn Sie uns über das Kontaktformular eine Anfrage senden, verarbeiten wir die von Ihnen eingegebenen Daten
                    (Name, E-Mail-Adresse, optional Telefonnummer, ausgewählte Leistung sowie Ihre Nachricht) zur Bearbeitung
                    Ihrer Anfrage und für mögliche Rückfragen (Art. 6 Abs. 1 lit. b bzw. lit. f DSGVO).
                </p>
                <ul>
                    <li>
                        <strong>Speicherung:</strong> Anfragen werden über eine Vercel Serverless Function sicher in{' '}
                        <strong>Google Cloud Firestore / Firebase</strong> gespeichert, um Ihre Anfrage zuverlässig nachverfolgen zu können.
                    </li>
                    <li>
                        <strong>E-Mail-Benachrichtigung:</strong> Zur Zustellung Ihrer Anfrage an unser Postfach nutzen wir den
                        transaktionalen E-Mail-Dienst <strong>Resend</strong> (Resend Inc.).
                    </li>
                </ul>
                <p>
                    Ihre Daten werden gelöscht, sobald sie für die Bearbeitung Ihrer Anfrage nicht mehr erforderlich sind und keine
                    gesetzlichen Aufbewahrungspflichten entgegenstehen.
                </p>

                <h2>5. Kontaktaufnahme per Telefon &amp; WhatsApp</h2>
                <p>
                    Bei einer telefonischen Kontaktaufnahme oder einer Nachricht über WhatsApp (WhatsApp Ireland Limited) werden
                    Ihre Rufnummer, Ihr Profilname sowie die übermittelten Schadensfotos ausschließlich zur Bearbeitung Ihres
                    Anliegens und zur Erstellung eines Kostenvoranschlags genutzt (Art. 6 Abs. 1 lit. b DSGVO). Externe Links zu
                    WhatsApp, Instagram und Facebook werden erst durch Ihren aktiven Klick aufgerufen.
                </p>

                <h2>6. Cookies &amp; Local Storage</h2>
                <p>
                    Wir nutzen technisch notwendigen Local Storage, um Ihre Entscheidung im Cookie-Banner zu speichern (§ 25 Abs. 2
                    TDDDG). Optionale Kategorien werden nur nach Ihrer ausdrücklichen Einwilligung aktiviert. Sie können Ihre Auswahl
                    jederzeit über das Cookie-Symbol unten links oder den Link „Cookie-Einstellungen“ im Footer ändern.
                </p>

                <h2>7. Ihre Rechte als betroffene Person</h2>
                <p>
                    Sie haben jederzeit das Recht auf Auskunft (Art. 15 DSGVO), Berichtigung (Art. 16 DSGVO), Löschung (Art. 17 DSGVO),
                    Einschränkung der Verarbeitung (Art. 18 DSGVO), Datenübertragbarkeit (Art. 20 DSGVO), Widerspruch (Art. 21 DSGVO)
                    sowie Widerruf erteilter Einwilligungen (Art. 7 Abs. 3 DSGVO). Zudem steht Ihnen ein Beschwerderecht bei einer
                    Datenschutz-Aufsichtsbehörde zu (in Hessen: Der Hessische Beauftragte für Datenschutz und Informationsfreiheit).
                </p>

                <BackButton to="/" label="Zurück zur Startseite" />
            </div>
        </>
    );
};

export default Datenschutz;
