import { NavLink, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { BUSINESS_INFO } from '../data/businessSchema';
import styles from './Navbar.module.css';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 40);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMenu = () => setIsOpen((prev) => !prev);
    const closeMenu = () => setIsOpen(false);

    return (
        <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`} aria-label="Hauptnavigation">
            <Link to="/" className={styles.brand} onClick={closeMenu}>
                <img
                    src="/images/damiko-logo.png"
                    alt="Beulendoktor Damiko Emblem"
                    className={styles.brandIcon}
                    width={37}
                    height={44}
                />
                <span className={styles.brandText}>
                    <span className={styles.brandName}>Beulendoktor</span>
                    <span className={styles.brandAccent}>Damiko</span>
                </span>
            </Link>

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

            <ul className={`${styles.navLinks} ${isOpen ? styles.open : ''}`}>
                <li>
                    <NavLink to="/" end className={({ isActive }) => (isActive ? styles.active : '')} onClick={closeMenu}>
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
                    <a href="/#contact" className={styles.ctaLink} onClick={closeMenu}>
                        Kontakt
                    </a>
                </li>
                <li className={styles.mobilePhoneItem}>
                    <a href={BUSINESS_INFO.phoneHref} className={styles.mobilePhoneLink} onClick={closeMenu}>
                        {BUSINESS_INFO.phoneDisplay}
                    </a>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
