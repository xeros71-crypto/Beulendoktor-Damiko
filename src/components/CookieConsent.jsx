import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './CookieConsent.module.css';

const STORAGE_KEY = 'damiko_cookie_consent_v1';

function loadInitialPreferences() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed && typeof parsed === 'object') {
                return {
                    essential: true,
                    analytics: !!parsed.analytics,
                    media: !!parsed.media,
                };
            }
        }
    } catch {
        // Fallback to default preferences
    }
    return {
        essential: true,
        analytics: false,
        media: false,
    };
}

const CookieConsent = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [preferences, setPreferences] = useState(loadInitialPreferences);

    useEffect(() => {
        let shouldShow;
        try {
            shouldShow = !localStorage.getItem(STORAGE_KEY);
        } catch {
            shouldShow = true;
        }
        if (shouldShow) {
            const timer = setTimeout(() => setIsVisible(true), 500);
            return () => clearTimeout(timer);
        }
    }, []);

    useEffect(() => {
        const handleOpenCookieSettings = () => {
            setIsVisible(true);
            setShowDetails(true);
        };
        window.addEventListener('openCookieSettings', handleOpenCookieSettings);
        return () => window.removeEventListener('openCookieSettings', handleOpenCookieSettings);
    }, []);

    const saveConsent = (newPrefs) => {
        const payload = {
            essential: true,
            analytics: !!newPrefs.analytics,
            media: !!newPrefs.media,
            updatedAt: new Date().toISOString(),
        };
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
        } catch {
            // Ignore storage quota errors
        }
        setPreferences({
            essential: true,
            analytics: payload.analytics,
            media: payload.media,
        });
        setIsVisible(false);
        setShowDetails(false);
    };

    const handleAcceptAll = () => saveConsent({ essential: true, analytics: true, media: true });
    const handleDeclineOptional = () => saveConsent({ essential: true, analytics: false, media: false });
    const handleSaveSelection = () => saveConsent(preferences);

    return (
        <>
            <button
                type="button"
                className={styles.reopenButton}
                onClick={() => setIsVisible(true)}
                style={{
                    opacity: isVisible ? 0 : 1,
                    pointerEvents: isVisible ? 'none' : 'auto',
                    transform: isVisible ? 'scale(0.8)' : 'scale(1)',
                }}
                aria-label="Datenschutz- und Cookie-Einstellungen öffnen"
                title="Cookie-Einstellungen"
            >
                <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-3.87 3.5 3.5 0 0 1-3.13-3.13A4 4 0 0 1 12 2zm-3 7a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm-1 6a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm5-1a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z" />
                </svg>
            </button>

            <div className={`${styles.banner} ${isVisible ? styles.visible : ''}`} role="dialog" aria-label="Cookie-Einstellungen">
                <div className={styles.content}>
                    <div className={styles.headerRow}>
                        <h3>Datenschutz- &amp; Cookie-Einstellungen</h3>
                        <button
                            type="button"
                            className={styles.detailsToggle}
                            onClick={() => setShowDetails(!showDetails)}
                        >
                            {showDetails ? 'Details ausblenden' : 'Einstellungen anpassen'}
                        </button>
                    </div>

                    <p>
                        Wir verwenden technisch notwendige Speichermechanismen (Local Storage), um unsere Website zuverlässig bereitzustellen
                        sowie – nach Ihrer freiwilligen Einwilligung (§ 25 TDDDG, Art. 6 Abs. 1 lit. a DSGVO) – optionale Inhalte.
                        Ihre Auswahl können Sie jederzeit widerrufen.
                    </p>

                    {showDetails && (
                        <div className={styles.categories}>
                            <label className={`${styles.categoryItem} ${styles.categoryDisabled}`}>
                                <div className={styles.categoryHeader}>
                                    <input type="checkbox" checked disabled />
                                    <span className={styles.categoryTitle}>Technisch notwendig (immer aktiv)</span>
                                </div>
                                <span className={styles.categoryDesc}>
                                    Erforderlich für Grundfunktionen der Website und die Speicherung Ihrer Cookie-Auswahl.
                                </span>
                            </label>

                            <label className={styles.categoryItem}>
                                <div className={styles.categoryHeader}>
                                    <input
                                        type="checkbox"
                                        checked={preferences.analytics}
                                        onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                                    />
                                    <span className={styles.categoryTitle}>Statistik &amp; Reichweite</span>
                                </div>
                                <span className={styles.categoryDesc}>
                                    Optionale Nutzungsanalyse zur Verbesserung unseres Online-Angebots.
                                </span>
                            </label>

                            <label className={styles.categoryItem}>
                                <div className={styles.categoryHeader}>
                                    <input
                                        type="checkbox"
                                        checked={preferences.media}
                                        onChange={(e) => setPreferences({ ...preferences, media: e.target.checked })}
                                    />
                                    <span className={styles.categoryTitle}>Externe Inhalte &amp; Medien</span>
                                </div>
                                <span className={styles.categoryDesc}>
                                    Ermöglicht die Anzeige optionaler externer Inhalte (z. B. Karten oder Social Media).
                                </span>
                            </label>
                        </div>
                    )}

                    <div className={styles.legalLinks}>
                        <Link to="/datenschutz" onClick={() => setIsVisible(false)} className={styles.link}>Datenschutzerklärung</Link>
                        <span>·</span>
                        <Link to="/impressum" onClick={() => setIsVisible(false)} className={styles.link}>Impressum</Link>
                    </div>
                </div>

                <div className={styles.actions}>
                    <button type="button" onClick={handleDeclineOptional} className={`${styles.button} ${styles.decline}`}>
                        Nur notwendige
                    </button>
                    {showDetails && (
                        <button type="button" onClick={handleSaveSelection} className={`${styles.button} ${styles.saveSelection}`}>
                            Auswahl speichern
                        </button>
                    )}
                    <button type="button" onClick={handleAcceptAll} className={`${styles.button} ${styles.accept}`}>
                        Alle akzeptieren
                    </button>
                </div>
            </div>
        </>
    );
};

export default CookieConsent;
