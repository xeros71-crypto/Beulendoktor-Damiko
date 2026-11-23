import { NavLink, Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { BUSINESS_INFO } from '../data/businessSchema';
import styles from './Navbar.module.css';
import { LOGO_FALLBACK_SRC, LOGO_WEBP_96 } from '../utils/responsiveImage';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const scrolledRef = useRef(false);

    useEffect(() => {
        const handleScroll = () => {
            const next = window.scrollY > 32;
            if (next !== scrolledRef.current) {
                scrolledRef.current = next;
                setScrolled(next);
            }
        };

        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMenu = () => setIsOpen((prev) => !prev);
    const closeMenu = () => setIsOpen(false);
    const handleHomeClick = () => {
        setIsOpen(false);
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    };

    return (
        <header>
            <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`} aria-label="Hauptnavigation">
                <div className={styles.navInner}>
                    <Link to="/" className={styles.brand} onClick={handleHomeClick}>
                        <picture>
                            <source type="image/webp" srcSet={LOGO_WEBP_96} />
                            <img
                                src={LOGO_FALLBACK_SRC}
                                alt="Lack- & Beulendoktor Damiko Emblem"
                                className={styles.brandIcon}
                                width={36}
                                height={44}
                                decoding="async"
                            />
                        </picture>
                        <span className={styles.brandText}>
                            <span className={styles.brandName}>Lack- &amp; Beulendoktor</span>
                            <span className={styles.brandAccent} translate="no">Damiko</span>
                        </span>
                    </Link>

                    <ul className={`${styles.navLinks} ${isOpen ? styles.open : ''}`}>
                        <li>
                            <NavLink to="/" end className={({ isActive }) => (isActive ? styles.active : '')} onClick={handleHomeClick}>
                                Home
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/lackierungen" className={({ isActive }) => (isActive ? styles.active : '')} onClick={closeMenu}>
                                Lackierungen
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/ausbeulservice" className={({ isActive }) => (isActive ? styles.active : '')} onClick={closeMenu}>
                                Ausbeulservice
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/smart-repair" className={({ isActive }) => (isActive ? styles.active : '')} onClick={closeMenu}>
                                Smart Repair
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/leasingruecklaeufer" className={({ isActive }) => (isActive ? styles.active : '')} onClick={closeMenu}>
                                Leasingrückläufer
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/hagelschaeden" className={({ isActive }) => (isActive ? styles.active : '')} onClick={closeMenu}>
                                Hagelschäden
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/galerie" className={({ isActive }) => (isActive ? styles.active : '')} onClick={closeMenu}>
                                Galerie
                            </NavLink>
                        </li>
                        <li>
                            <Link to="/#contact" onClick={closeMenu}>
                                Kontakt
                            </Link>
                        </li>
                        <li className={styles.mobileConversionBlock}>
                            <a href={BUSINESS_INFO.phoneHref} className={styles.mobilePhoneBtn} onClick={closeMenu}>
                                {BUSINESS_INFO.phoneDisplay}
                            </a>
                            <a
                                href={BUSINESS_INFO.whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.mobileWhatsappBtn}
                                onClick={closeMenu}
                            >
                                WhatsApp Foto-Check
                            </a>
                        </li>
                    </ul>

                    <div className={styles.headerActions}>
                        <a href={BUSINESS_INFO.phoneHref} className={styles.headerPhone} aria-label={`Anrufen unter ${BUSINESS_INFO.phoneDisplay}`}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                            </svg>
                            <span>{BUSINESS_INFO.phoneDisplay}</span>
                        </a>
                        <Link to="/#contact" className={styles.headerCta}>
                            Anfragen
                        </Link>
                    </div>

                    <button
                        type="button"
                        className={`${styles.hamburger} ${isOpen ? styles.open : ''}`}
                        onClick={toggleMenu}
                        aria-label={isOpen ? 'Menü schließen' : 'Menü öffnen'}
                        aria-expanded={isOpen}
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>
            </nav>
        </header>
    );
};

export default Navbar;
