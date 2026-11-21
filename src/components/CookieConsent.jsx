import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './CookieConsent.module.css';

const STORAGE_KEY = 'damiko_cookie_consent_v1';
const CONSENT_VERSION = 1;
const MAX_CONSENT_AGE_MS = 365 * 24 * 60 * 60 * 1000; // 12 Monate

const DEFAULT_PREFERENCES = {
    essential: true,
    analytics: false,
    media: false,
};

function readStoredConsent() {
    if (typeof window === 'undefined') return null;
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (!parsed || typeof parsed !== 'object') return null;
        if (parsed.version !== undefined && parsed.version !== CONSENT_VERSION) return null;

        if (typeof parsed.updatedAt === 'string') {
            const updatedTs = Date.parse(parsed.updatedAt);
            if (!Number.isFinite(updatedTs) || Date.now() - updatedTs > MAX_CONSENT_AGE_MS) {
                return null;
            }
        }

        return {
            essential: true,
            analytics: Boolean(parsed.analytics),
            media: Boolean(parsed.media),
        };
    } catch {
        return null;
    }
}

const CookieConsent = () => {
    const { pathname } = useLocation();
    const [mounted, setMounted] = useState(false);
    const [hasDecision, setHasDecision] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [preferences, setPreferences] = useState(DEFAULT_PREFERENCES);

    const isAdminRoute = pathname.startsWith('/admin');

    useEffect(() => {
        const stored = readStoredConsent();
        let showTimer;

        const initTimer = setTimeout(() => {
            setMounted(true);
            if (stored) {
                setPreferences(stored);
                setHasDecision(true);
            } else if (!isAdminRoute) {
                showTimer = setTimeout(() => setIsVisible(true), 400);
            }
        }, 0);

        return () => {
            clearTimeout(initTimer);
            if (showTimer) clearTimeout(showTimer);
        };
    }, [isAdminRoute]);

    useEffect(() => {
        const handleOpenCookieSettings = () => {
            const stored = readStoredConsent();
            if (stored) {
                setPreferences(stored);
                setHasDecision(true);
            }
            setIsVisible(true);
            setShowDetails(true);
        };
        window.addEventListener('openCookieSettings', handleOpenCookieSettings);
        return () => window.removeEventListener('openCookieSettings', handleOpenCookieSettings);
    }, []);

    useEffect(() => {
        if (!isVisible || !hasDecision) return;
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                setIsVisible(false);
                setShowDetails(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isVisible, hasDecision]);

    const saveConsent = useCallback((nextPrefs) => {
        const payload = {
            version: CONSENT_VERSION,
            essential: true,
            analytics: Boolean(nextPrefs.analytics),
            media: Boolean(nextPrefs.media),
            updatedAt: new Date().toISOString(),
        };
        try {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
        } catch {
            // Ignore storage quota / private-mode errors
        }
        setPreferences({
            essential: true,
            analytics: payload.analytics,
            media: payload.media,
        });
        setHasDecision(true);
        setIsVisible(false);
        setShowDetails(false);
        window.dispatchEvent(new CustomEvent('damikoConsentChanged', { detail: payload }));
    }, []);

    const handleAcceptAll = () => saveConsent({ essential: true, analytics: true, media: true });
    const handleDeclineOptional = () => saveConsent({ essential: true, analytics: false, media: false });
    const handleSaveSelection = () => saveConsent(preferences);

    if (!mounted || isAdminRoute) {
        return null;
    }

    return (
        <>
            <button
                type="button"
                className={`${styles.reopenButton} ${isVisible ? styles.reopenHidden : ''}`}
                onClick={() => setIsVisible(true)}
                aria-label="Datenschutz- und Cookie-Einstellungen öffnen"
                title="Cookie-Einstellungen"
                tabIndex={isVisible ? -1 : 0}
                aria-hidden={isVisible}
            >
                <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-3.87 3.5 3.5 0 0 1-3.13-3.13A4 4 0 0 1 12 2zm-3 7a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm-1 6a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm5-1a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z" />
                </svg>
            </button>

            {isVisible && (
                <div
                    className={styles.banner}
                    role="dialog"
                    aria-modal="false"
                    aria-labelledby="cookie-consent-title"
                    aria-describedby="cookie-consent-desc"
                >
                    <div className={styles.content}>
                        <div className={styles.headerRow}>
                            <p id="cookie-consent-title" className={styles.title}>
                                Datenschutz- &amp; Cookie-Einstellungen
                            </p>
                            <button
                                type="button"
                                className={styles.detailsToggle}
                                onClick={() => setShowDetails((prev) => !prev)}
                                aria-expanded={showDetails}
                            >
                                {showDetails ? 'Details ausblenden' : 'Einstellungen anpassen'}
                            </button>
                        </div>

                        <p id="cookie-consent-desc" className={styles.description}>
                            Wir verwenden technisch notwendige Speichermechanismen (Local Storage), um diese Website
                            zuverlässig bereitzustellen sowie – erst nach Ihrer freiwilligen Einwilligung (§ 25 TDDDG,
                            Art. 6 Abs. 1 lit. a DSGVO) – optionale Funktionen. Ihre Auswahl können Sie jederzeit
                            ändern oder widerrufen.
                        </p>

                        {showDetails && (
                            <div className={styles.categories}>
                                <div className={`${styles.categoryItem} ${styles.categoryDisabled}`}>
                                    <label htmlFor="consent-essential" className={styles.categoryHeader}>
                                        <input id="consent-essential" type="checkbox" checked disabled />
                                        <span className={styles.categoryTitle}>Technisch notwendig (immer aktiv)</span>
                                    </label>
                                    <span className={styles.categoryDesc}>
                                        Erforderlich für Grundfunktionen der Website, Sicherheitsschutz beim
                                        Kontaktformular und die Speicherung Ihrer Cookie-Auswahl.
                                    </span>
                                </div>

                                <div className={styles.categoryItem}>
                                    <label htmlFor="consent-analytics" className={styles.categoryHeader}>
                                        <input
                                            id="consent-analytics"
                                            type="checkbox"
                                            checked={preferences.analytics}
                                            onChange={(e) =>
                                                setPreferences((prev) => ({ ...prev, analytics: e.target.checked }))
                                            }
                                        />
                                        <span className={styles.categoryTitle}>Statistik &amp; Reichweite</span>
                                    </label>
                                    <span className={styles.categoryDesc}>
                                        Optionale, anonymisierte Nutzungsanalyse zur Verbesserung unseres
                                        Online-Angebots.
                                    </span>
                                </div>

                                <div className={styles.categoryItem}>
                                    <label htmlFor="consent-media" className={styles.categoryHeader}>
                                        <input
                                            id="consent-media"
                                            type="checkbox"
                                            checked={preferences.media}
                                            onChange={(e) =>
                                                setPreferences((prev) => ({ ...prev, media: e.target.checked }))
                                            }
                                        />
                                        <span className={styles.categoryTitle}>Externe Inhalte &amp; Medien</span>
                                    </label>
                                    <span className={styles.categoryDesc}>
                                        Ermöglicht die Anzeige optionaler externer Inhalte (z. B. interaktive Karten
                                        oder Social-Media-Einbettungen).
                                    </span>
                                </div>
                            </div>
                        )}

                        <div className={styles.legalLinks}>
                            <Link to="/datenschutz" onClick={() => setIsVisible(false)} className={styles.link}>
                                Datenschutzerklärung
                            </Link>
                            <span aria-hidden="true">·</span>
                            <Link to="/impressum" onClick={() => setIsVisible(false)} className={styles.link}>
                                Impressum
                            </Link>
                        </div>
                    </div>

                    <div className={styles.actions}>
                        <button
                            type="button"
                            onClick={handleDeclineOptional}
                            className={`${styles.button} ${styles.decline}`}
                        >
                            Nur notwendige
                        </button>
                        {showDetails && (
                            <button
                                type="button"
                                onClick={handleSaveSelection}
                                className={`${styles.button} ${styles.saveSelection}`}
                            >
                                Auswahl speichern
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={handleAcceptAll}
                            className={`${styles.button} ${styles.accept}`}
                        >
                            Alle akzeptieren
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default CookieConsent;
