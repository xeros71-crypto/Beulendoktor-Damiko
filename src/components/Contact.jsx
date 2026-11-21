import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { BUSINESS_INFO } from '../data/businessSchema';
import styles from './Contact.module.css';

const TOKEN_REFRESH_AFTER_MS = 90 * 60 * 1000;
const PHONE_PATTERN = /^[+\d][\d\s\-/()]{4,39}$/;

function isValidClientPhone(rawPhone) {
    const phone = rawPhone.trim();
    if (!phone) return true;
    if (!PHONE_PATTERN.test(phone) || phone.indexOf('+', 1) !== -1) return false;
    const digits = phone.replace(/\D/g, '');
    return digits.length >= 6 && digits.length <= 20;
}

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

    const tokenRef = useRef({ value: '', fetchedAt: 0 });
    const tokenRequestRef = useRef(null);

    const fetchFormToken = useCallback(async () => {
        if (tokenRequestRef.current) {
            return tokenRequestRef.current;
        }

        const request = (async () => {
            try {
                const response = await fetch('/api/contact', {
                    method: 'GET',
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                    credentials: 'same-origin',
                    cache: 'no-store',
                });
                if (!response.ok) return '';
                const data = await response.json().catch(() => null);
                if (data && typeof data.token === 'string' && data.token.length > 0) {
                    tokenRef.current = { value: data.token, fetchedAt: Date.now() };
                    return data.token;
                }
            } catch {
                // Silent fallback (e.g. offline or local Vite dev without serverless API)
            } finally {
                tokenRequestRef.current = null;
            }
            return '';
        })();

        tokenRequestRef.current = request;
        return request;
    }, []);

    useEffect(() => {
        fetchFormToken();
    }, [fetchFormToken]);

    const handleFormFocus = () => {
        const { value, fetchedAt } = tokenRef.current;
        if (!value || Date.now() - fetchedAt > TOKEN_REFRESH_AFTER_MS) {
            fetchFormToken();
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;

        const trimmedName = formData.name.trim();
        const trimmedEmail = formData.email.trim();
        const trimmedMessage = formData.message.trim();

        if (trimmedName.length < 2) {
            setStatus({
                type: 'error',
                message: 'Bitte geben Sie einen gültigen Namen ein (mindestens 2 Zeichen).',
            });
            return;
        }

        if (!isValidClientPhone(formData.phone)) {
            setStatus({
                type: 'error',
                message: 'Bitte geben Sie eine gültige Telefonnummer an (oder lassen Sie das Feld leer).',
            });
            return;
        }

        if (trimmedMessage.length < 10) {
            setStatus({
                type: 'error',
                message: 'Bitte beschreiben Sie Ihr Anliegen etwas genauer (mindestens 10 Zeichen).',
            });
            return;
        }

        setIsSubmitting(true);
        setStatus({ type: '', message: '' });

        try {
            let currentToken = tokenRef.current.value;
            if (!currentToken) {
                currentToken = await fetchFormToken();
            }

            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                credentials: 'same-origin',
                body: JSON.stringify({
                    ...formData,
                    name: trimmedName,
                    email: trimmedEmail,
                    message: trimmedMessage,
                    formToken: currentToken,
                }),
            });

            if (response.ok) {
                setStatus({
                    type: 'success',
                    message: 'Vielen Dank! Ihre Anfrage wurde erfolgreich übermittelt. Wir melden uns kurzfristig bei Ihnen.',
                });
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    service: 'lackierungen',
                    message: '',
                    website: '',
                });
                tokenRef.current = { value: '', fetchedAt: 0 };
                fetchFormToken();
            } else {
                const errData = await response.json().catch(() => ({}));
                if (
                    errData.code === 'TOKEN_EXPIRED' ||
                    errData.code === 'TOKEN_REPLAY' ||
                    errData.code === 'INVALID_TOKEN'
                ) {
                    tokenRef.current = { value: '', fetchedAt: 0 };
                    fetchFormToken();
                }
                throw new Error(errData.error || 'Fehler beim Senden');
            }
        } catch (error) {
            setStatus({
                type: 'error',
                message:
                    error.message ||
                    `Es gab ein Problem beim Senden. Bitte rufen Sie uns direkt unter ${BUSINESS_INFO.phoneDisplay} an oder schreiben Sie per WhatsApp.`,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section id="contact" className={styles.contactSection}>
            <div className={styles.inner}>
                <div className="reveal">
                    <span className={styles.kicker}>Direkt &amp; Unverbindlich</span>
                    <h2 className={styles.heading}>Holen Sie sich Ihr individuelles Angebot</h2>
                    <p className={styles.subtitle}>
                        Beschreiben Sie kurz Ihren Schaden oder senden Sie uns direkt Fotos per WhatsApp –
                        wir melden uns schnell mit einer realistischen Einschätzung.
                    </p>
                </div>

                <div className={styles.layout}>
                    <div className={`${styles.infoPanel} reveal-left`}>
                        <img
                            src="/images/damiko-lack-beulendoktor-logo.png"
                            alt="Lack- & Beulendoktor Damiko"
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

                    <form
                        className={`${styles.form} reveal-right`}
                        onSubmit={handleSubmit}
                        onFocus={handleFormFocus}
                    >
                        {/* Honeypot gegen automatisierte Bots */}
                        <div className={styles.hpField} aria-hidden="true">
                            <label htmlFor="website">Website</label>
                            <input
                                type="text"
                                id="website"
                                name="website"
                                tabIndex={-1}
                                autoComplete="new-password"
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
                                minLength={2}
                                maxLength={120}
                                autoComplete="name"
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
                                    autoComplete="email"
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
                                minLength={10}
                                maxLength={4000}
                                placeholder="Fahrzeugmodell, Art des Schadens (z. B. Kratzer Stoßstange, Parkdelle Tür, Leasingrückgabe) und Wunschzeitraum..."
                                value={formData.message}
                                onChange={handleChange}
                            ></textarea>
                        </div>

                        <p className={styles.privacyHint}>
                            Informationen zur Verarbeitung Ihrer Angaben zur Bearbeitung Ihrer Anfrage finden Sie in unserer{' '}
                            <Link to="/datenschutz" className={styles.privacyLink}>
                                Datenschutzerklärung
                            </Link>
                            .
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
