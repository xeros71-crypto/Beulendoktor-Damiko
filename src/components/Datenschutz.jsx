import SEO from './SEO';
import BackButton from './BackButton';
import { BUSINESS_INFO, DATENSCHUTZ_SEO } from '../data/businessSchema';
import styles from '../styles/PageLayout.module.css';

const Datenschutz = () => {
    return (
        <>
            <SEO
                title={DATENSCHUTZ_SEO.title}
                description={DATENSCHUTZ_SEO.description}
                image={DATENSCHUTZ_SEO.image}
                imageAlt={DATENSCHUTZ_SEO.imageAlt}
                noindex={DATENSCHUTZ_SEO.noindex}
            />
            <div className={styles.legalContent}>
                <h1>Datenschutzerklärung</h1>

                <h2>1. Verantwortlicher</h2>
                <p>
                    <strong>{BUSINESS_INFO.name} / {BUSINESS_INFO.legalName}</strong><br />
                    {BUSINESS_INFO.street}<br />
                    {BUSINESS_INFO.postalCode} {BUSINESS_INFO.city}<br />
                    Telefon: <a href={BUSINESS_INFO.phoneHref}>{BUSINESS_INFO.phoneDisplay}</a>
                </p>

                <h2>2. Hosting &amp; Bereitstellung (Vercel)</h2>
                <p>
                    Diese Website wird über die Plattform <strong>Vercel Inc.</strong> (440 N Barranca Ave #4133, Covina, CA 91723, USA)
                    bereitgestellt. Beim Aufruf der Website verarbeitet der Hostinganbieter automatisch technische Zugriffsdaten
                    (Server-Logfiles wie IP-Adresse, Zeitpunkt des Zugriffs, Browsertyp und aufgerufene URL), um Sicherheit,
                    Stabilität und Auslieferung zu gewährleisten (Art. 6 Abs. 1 lit. f DSGVO).
                </p>
                <p>
                    Mit Vercel besteht ein Auftragsverarbeitungsvertrag (Art. 28 DSGVO). Soweit Daten in die USA übermittelt
                    werden, erfolgt dies auf Grundlage des EU-US Data Privacy Framework (DPF) bzw. der EU-Standardvertragsklauseln
                    (Art. 46 Abs. 2 lit. c DSGVO).
                </p>

                <h2>3. Lokale Schriftarten &amp; Medien (keine externen Tracker)</h2>
                <p>
                    Alle Schriftarten (<code>Inter</code>) und Bilder dieser Website sind vollständig lokal gehostet. Beim bloßen
                    Besuch der Website werden keine Verbindungen zu externen Schriftarten-, Analyse- oder Werbeservern aufgebaut
                    und keine nicht notwendigen Cookies gesetzt (§ 25 Abs. 2 TDDDG).
                </p>

                <h2>4. Kontaktformular, Datenbank (Firebase Firestore) &amp; E-Mail-Versand (Resend)</h2>
                <p>
                    Wenn Sie uns über das Kontaktformular eine Anfrage senden, verarbeiten wir Ihre Angaben (Name, E-Mail-Adresse,
                    optional Telefonnummer, ausgewählte Leistung sowie Nachricht) ausschließlich zur Bearbeitung Ihrer Anfrage
                    und für mögliche Rückfragen (Art. 6 Abs. 1 lit. b bzw. lit. f DSGVO).
                </p>
                <ul>
                    <li>
                        <strong>Speicherung (Google Cloud Firestore / Firebase):</strong> Anfragen werden serverseitig über eine
                        Vercel Serverless Function gespeichert, um Ihre Anfrage zuverlässig nachzuverfolgen (Auftragsverarbeitung
                        gemäß Art. 28 DSGVO; Drittlandübermittlung abgesichert über EU-US DPF / Standardvertragsklauseln).
                    </li>
                    <li>
                        <strong>E-Mail-Zustellung (Resend Inc.):</strong> Zur Benachrichtigung an unser Betriebspostfach nutzen wir
                        den transaktionalen E-Mail-Dienst Resend (Auftragsverarbeitung gemäß Art. 28 DSGVO; Drittlandübermittlung
                        abgesichert über EU-Standardvertragsklauseln nach Art. 46 Abs. 2 lit. c DSGVO).
                    </li>
                </ul>
                <p>
                    Ihre Daten werden gelöscht, sobald sie für die Bearbeitung Ihrer Anfrage nicht mehr erforderlich sind und keine
                    gesetzlichen Aufbewahrungspflichten entgegenstehen.
                </p>

                <h2>5. Kontaktaufnahme per Telefon &amp; WhatsApp sowie Social-Media-Links</h2>
                <p>
                    Bei einer telefonischen Kontaktaufnahme oder einer Nachricht über WhatsApp (WhatsApp Ireland Limited) werden
                    Ihre Rufnummer, Ihr Profilname sowie übermittelte Schadensfotos ausschließlich zur Bearbeitung Ihres Anliegens
                    und zur Erstellung eines Kostenvoranschlags genutzt (Art. 6 Abs. 1 lit. b DSGVO). Links zu WhatsApp, Instagram
                    und Facebook sind als reine externe Verlinkungen eingebunden – erst Ihr aktiver Klick stellt eine Verbindung
                    zu dem jeweiligen Anbieter her.
                </p>

                <h2>6. Ihre Rechte als betroffene Person</h2>
                <p>
                    Sie haben jederzeit das Recht auf Auskunft (Art. 15 DSGVO), Berichtigung (Art. 16 DSGVO), Löschung (Art. 17 DSGVO),
                    Einschränkung der Verarbeitung (Art. 18 DSGVO), Datenübertragbarkeit (Art. 20 DSGVO), Widerspruch (Art. 21 DSGVO)
                    sowie Widerruf erteilter Einwilligungen (Art. 7 Abs. 3 DSGVO). Zudem steht Ihnen ein Beschwerderecht bei der
                    zuständigen Aufsichtsbehörde zu (in Hessen: Der Hessische Beauftragte für Datenschutz und Informationsfreiheit).
                </p>

                <BackButton to="/" label="Zurück zur Startseite" />
            </div>
        </>
    );
};

export default Datenschutz;
