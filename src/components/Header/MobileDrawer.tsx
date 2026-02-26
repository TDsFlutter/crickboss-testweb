import { useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { NAV_LINKS } from '../../utils/constants';
import { useAuth } from '../../context/AuthContext';
import styles from './MobileDrawer.module.css';

interface Props {
    open: boolean;
    onClose: () => void;
}

export default function MobileDrawer({ open, onClose }: Props) {
    const { isLoggedIn, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        onClose();
        navigate('/login', { replace: true });
    };
    // Lock body scroll when open
    useEffect(() => {
        document.body.style.overflow = open ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [open]);

    return (
        <>
            {/* Backdrop */}
            <div
                className={`${styles.backdrop} ${open ? styles.visible : ''}`}
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Drawer */}
            <nav
                className={`${styles.drawer} ${open ? styles.open : ''}`}
                aria-label="Mobile navigation"
                aria-hidden={!open}
            >
                {/* Header row */}
                <div className={styles.drawerHeader}>
                    <Link to="/" className={styles.logo} onClick={onClose}>
                        🏏 <span>Crick<strong>Boss</strong></span>
                    </Link>
                    <button className={styles.closeBtn} onClick={onClose} aria-label="Close menu">✕</button>
                </div>

                {/* Links */}
                <div className={styles.links}>
                    {NAV_LINKS.map(link => (
                        <NavLink
                            key={link.href}
                            to={link.href}
                            end={link.href === '/'}
                            onClick={onClose}
                            className={({ isActive }) =>
                                `${styles.link} ${isActive ? styles.active : ''}`
                            }
                        >
                            {link.label}
                        </NavLink>
                    ))}
                </div>

                {/* CTA */}
                <div className={styles.drawerFooter}>
                    {isLoggedIn ? (
                        <>
                            <Link to="/dashboard" className={styles.cta} onClick={onClose}>
                                Dashboard →
                            </Link>
                            <button className={styles.logoutDrawerBtn} onClick={handleLogout}>
                                Logout
                            </button>
                        </>
                    ) : (
                        <Link to="/login" className={styles.cta} onClick={onClose}>
                            Register / Login →
                        </Link>
                    )}
                </div>
            </nav>
        </>
    );
}
