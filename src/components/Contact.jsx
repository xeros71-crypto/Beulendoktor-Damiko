import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BUSINESS_INFO } from '../data/businessSchema';
import styles from './Contact.module.css';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        service: 'lackierungen',
        message: '',
        website: '', // Honeypot
    });
    const [status, setStatus] = useState({ type: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;
        setIsSubmitting(true);
        setStatus({ type: '', message: '' });

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setStatus({
                    type: 'success',
                    message: 'Vielen Dank! Deine Anfrage wurde erfolgreich übermittelt. Wir melden uns kurzfristig bei dir.',
                });
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    service: 'lackierungen',
                    message: '',
                    website: '',
                });
            } else {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.error || 'Fehler beim Senden');
            }
        } catch (error) {
            setStatus({
                type: 'error',
                message:
                    error.message ||
                    `Es gab ein Problem beim Senden. Bitte ruf uns direkt unter ${BUSINESS_INFO.phoneDisplay} an oder schreib per WhatsApp.`,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section id="contact" className={styles.contactSection}>
            <div className={styles.inner}>
                <span className={styles.kicker}>Direkt &amp; Unverbindlich</span>
                <h2 className={styles.heading}>Holen Sie sich Ihr individuelles Angebot</h2>
                <p className={styles.subtitle}>
                    Beschreiben Sie kurz Ihren Schaden oder senden Sie uns direkt Fotos per WhatsApp –
                    wir melden uns schnell mit einer realistischen Einschätzung.
                </p>

                <div className={styles.layout}>
                    <div className={styles.infoPanel}>
                        <img
                            src="/images/damiko-logo-shield.png"
                            alt="Beulendoktor Damiko"
                            className={styles.panelLogo}
                            width={130}
                            height={155}
                            loading="lazy"
                            decoding="async"
                        />

                        <h3>Direkter Kontakt</h3>
                        <p className={styles.panelText}>
                            Am schnellsten erhalten Sie eine Einschätzung per Foto-Nachricht über WhatsApp
                            oder im kurzen Telefonat.
                        </p>

                        <div className={styles.detailList}>
                            <div className={styles.detailItem}>
                                <span className={styles.detailLabel}>Telefon &amp; WhatsApp</span>
                                <a href={BUSINESS_INFO.phoneHref} className={styles.detailValueHighlight}>
                                    {BUSINESS_INFO.phoneDisplay}
                                </a>
                            </div>
                            <div className={styles.detailItem}>
                                <span className={styles.detailLabel}>Adresse Büro</span>
                                <span className={styles.detailValue}>
                                    {BUSINESS_INFO.name}<br />
                                    {BUSINESS_INFO.street}<br />
                                    {BUSINESS_INFO.postalCode} {BUSINESS_INFO.city}
                                </span>
                            </div>
                            <div className={styles.detailItem}>
                                <span className={styles.detailLabel}>Terminvereinbarung</span>
                                <span className={styles.detailValue}>{BUSINESS_INFO.appointmentNote}</span>
                            </div>
                            <div className={styles.detailItem}>
                                <span className={styles.detailLabel}>Einsatzgebiet</span>
                                <span className={styles.detailValue}>Frankfurt am Main · Wetterau · Rhein-Main-Gebiet</span>
                            </div>
                        </div>

                        <a
                            href={BUSINESS_INFO.whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.whatsappCta}
                        >
                            Fotos direkt per WhatsApp senden &rarr;
                        </a>
                    </div>

                    <form className={styles.form} onSubmit={handleSubmit}>
                        {/* Honeypot gegen automatisierte Bots */}
                        <div
                            style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0, overflow: 'hidden' }}
                            aria-hidden="true"
                        >
                            <label htmlFor="website">Website</label>
                            <input
                                type="text"
                                id="website"
                                name="website"
                                tabIndex="-1"
                                autoComplete="off"
                                value={formData.website}
                                onChange={handleChange}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="name" className={styles.label}>Name *</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                className={styles.input}
                                required
                                maxLength={120}
                                placeholder="Ihr Name"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>

                        <div className={styles.rowTwo}>
                            <div className={styles.formGroup}>
                                <label htmlFor="email" className={styles.label}>E-Mail *</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    className={styles.input}
                                    required
                                    maxLength={180}
                                    placeholder="ihre@email.de"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="phone" className={styles.label}>Telefon (für Rückruf)</label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    className={styles.input}
                                    maxLength={40}
                                    autoComplete="tel"
                                    placeholder="z. B. 0151 12345678"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="service" className={styles.label}>Gewünschte Leistung</label>
                            <select
                                id="service"
                                name="service"
                                className={styles.select}
                                value={formData.service}
                                onChange={handleChange}
                            >
                                <option value="lackierungen">Autolackierung / Teillackierung</option>
                                <option value="ausbeulservice">Mobiler Ausbeulservice (Dellentechnik)</option>
                                <option value="smart-repair">Smart Repair / Spot Repair</option>
                                <option value="leasingruecklaeufer">Leasingrückläufer-Service</option>
                                <option value="hagelschaeden">Hagelschaden-Instandsetzung</option>
                                <option value="fahrzeugaufbereitung">Fahrzeugaufbereitung &amp; Politur</option>
                                <option value="allgemein">Allgemeine Anfrage</option>
                            </select>
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="message" className={styles.label}>Schadenbeschreibung / Nachricht *</label>
                            <textarea
                                id="message"
                                name="message"
                                className={styles.textarea}
                                rows="5"
                                required
                                maxLength={4000}
                                placeholder="Fahrzeugmodell, Art des Schadens (z. B. Kratzer Stoßstange, Parkdelle Tür, Leasingrückgabe) und Wunschzeitraum..."
                                value={formData.message}
                                onChange={handleChange}
                            ></textarea>
                        </div>

                        <p className={styles.privacyHint}>
                            Mit dem Absenden erklären Sie sich mit der Verarbeitung Ihrer Angaben zur Bearbeitung Ihrer Anfrage
                            gemäß unserer{' '}
                            <Link to="/datenschutz" className={styles.privacyLink}>
                                Datenschutzerklärung
                            </Link>{' '}
                            einverstanden.
                        </p>

                        <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
                            {isSubmitting ? 'Wird gesendet...' : 'Kostenlose Anfrage senden'}
                        </button>

                        {status.message && (
                            <div
                                className={`${styles.status} ${styles[status.type]}`}
                                role={status.type === 'error' ? 'alert' : 'status'}
                                aria-live="polite"
                            >
                                {status.message}
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </section>
    );
};

export default Contact;
