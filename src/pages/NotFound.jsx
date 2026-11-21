import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import styles from '../styles/PageLayout.module.css';

const NotFound = () => {
    return (
        <>
            <SEO
                title="Seite nicht gefunden | Beulendoktor Damiko"
                description="Die angeforderte Seite existiert leider nicht oder wurde verschoben."
                noindex
            />
            <div className={styles.pageContent} style={{ textAlign: 'center', paddingTop: '9rem', paddingBottom: '6rem' }}>
                <p style={{ color: 'var(--accent-primary)', fontWeight: 800, letterSpacing: '0.18em', marginBottom: '0.75rem' }}>
                    404
                </p>
                <h1 className={styles.mainTitle} style={{ marginBottom: '1rem' }}>
                    Seite nicht gefunden
                </h1>
                <p style={{ color: 'var(--text-secondary)', maxWidth: '520px', margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
                    Die angeforderte Seite existiert leider nicht oder wurde verschoben. Über die folgenden Links gelangen Sie
                    direkt zu unseren Leistungen.
                </p>
                <div className={styles.ctaActions}>
                    <Link to="/" className={styles.primaryButton}>
                        Zur Startseite
                    </Link>
                    <Link to="/lackierungen" className={styles.secondaryButton}>
                        Lackierungen
                    </Link>
                    <Link to="/#contact" className={styles.secondaryButton}>
                        Kontakt
                    </Link>
                </div>
            </div>
        </>
    );
};

export default NotFound;
