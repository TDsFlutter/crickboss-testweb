import { useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useScrollHeader } from '../../hooks/useScrollHeader';
import { useTheme } from '../../context/ThemeContext';
import { SunIcon, MoonIcon } from '../Icons/Icons';
import MobileDrawer from './MobileDrawer';
import { NAV_LINKS } from '../../utils/constants';
import styles from './Header.module.css';

export default function Header() {
    const scrolled = useScrollHeader(60);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const { theme, toggleTheme } = useTheme();
    const { pathname } = useLocation();

    // On non-home pages there's no hero, so always force solid header
    const isHome = pathname === '/';
    const isSolid = !isHome || scrolled;

    return (
        <>
            <header
                className={`${styles.header} ${isSolid ? styles.scrolled : ''}`}
                role="banner"
            >
                <div className={`container ${styles.inner}`}>

                    {/* Logo */}
                    <Link to="/" className={styles.logo} aria-label="CrickBoss home">
                        <span className={styles.logoMark}>
                            <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden="true">
                                <circle cx="16" cy="16" r="16" fill="#1F3C88" />
                                <path d="M10 23 L16 9 L22 23" stroke="#3DBE8B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                <line x1="12" y1="19" x2="20" y2="19" stroke="#3DBE8B" strokeWidth="2.2" strokeLinecap="round" />
                            </svg>
                        </span>
                        <span className={styles.logoText}>
                            Crick<span className={styles.logoBoss}>Boss</span>
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className={styles.nav} aria-label="Main navigation">
                        {NAV_LINKS.map(link => (
                            <NavLink
                                key={link.href}
                                to={link.href}
                                end={link.href === '/'}
                                className={({ isActive }) =>
                                    `${styles.navLink} ${isActive ? styles.active : ''}`
                                }
                            >
                                {link.label}
                            </NavLink>
                        ))}
                    </nav>

                    {/* Actions */}
                    <div className={styles.actions}>
                        {/* Dark / Light Toggle */}
                        <button
                            className={styles.themeToggle}
                            onClick={toggleTheme}
                            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                        >
                            {theme === 'dark' ? <MoonIcon size={17} /> : <SunIcon size={17} />}
                        </button>

                        <Link to="/auctions/today" className={styles.ctaBtn}>
                            Register / Login
                        </Link>

                        <button
                            className={styles.hamburger}
                            onClick={() => setDrawerOpen(true)}
                            aria-label="Open navigation menu"
                            aria-expanded={drawerOpen}
                        >
                            <span /><span /><span />
                        </button>
                    </div>
                </div>
            </header>

            <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
        </>
    );
}
