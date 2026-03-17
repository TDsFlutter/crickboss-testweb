import { useState } from 'react';
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import logoImg from '../../assets/crickboss_trans.png';
import { useScrollHeader } from '../../hooks/useScrollHeader';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { SunIcon, MoonIcon } from '../Icons/Icons';
import MobileDrawer from './MobileDrawer';
import { NAV_LINKS } from '../../utils/constants';
import styles from './Header.module.css';

export default function Header() {
    const scrolled = useScrollHeader(60);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const { theme, toggleTheme } = useTheme();
    const { isLoggedIn, logout } = useAuth();
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const handleLogout = async () => {
        await logout();
        navigate('/login', { replace: true });
    };

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
                        <img src={logoImg} alt="CrickBoss Logo" className={styles.logoImg} />
                        <span className={styles.logoText}>
                            <span className={styles.logoCrick}>Crick</span><span className={styles.logoBoss}>Boss</span>
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

                        {isLoggedIn ? (
                            <>
                                <Link to="/dashboard" className={styles.ctaBtn}>
                                    Dashboard
                                </Link>
                                <button
                                    className={styles.logoutHeaderBtn}
                                    onClick={handleLogout}
                                    aria-label="Logout"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <Link to="/login" className={styles.ctaBtn}>
                                Register / Login
                            </Link>
                        )}

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
