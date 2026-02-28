import { useState } from 'react';
import type { ReactNode, ReactElement } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './DashboardLayout.module.css';

export type DashTab = 'auctions' | 'create' | 'join' | 'profile' | 'manage';

interface DashboardLayoutProps {
    children: (tab: DashTab, setTab: (t: DashTab) => void) => ReactNode;
}

interface NavItem {
    id: DashTab;
    label: string;
    icon: ReactElement<{ children?: ReactNode; className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
    {
        id: 'auctions',
        label: 'My Auctions',
        icon: (
            <svg className={styles.navIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
        ),
    },
    {
        id: 'create',
        label: 'Create Auction',
        icon: (
            <svg className={styles.navIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" />
                <line x1="12" y1="8" x2="12" y2="16" />
                <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
        ),
    },
    {
        id: 'join',
        label: 'Join as Player',
        icon: (
            <svg className={styles.navIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" y1="12" x2="3" y2="12" />
            </svg>
        ),
    },
    {
        id: 'profile',
        label: 'My Profile',
        icon: (
            <svg className={styles.navIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                <circle cx="12" cy="7" r="4" />
            </svg>
        ),
    },
];

const PAGE_META: Record<DashTab, { title: string; subtitle: string }> = {
    auctions: { title: 'My Auctions', subtitle: 'View and manage all your auction events' },
    create: { title: 'Create Auction', subtitle: 'Set up a new auction event' },
    join: { title: 'Join as Player', subtitle: 'Enter your code to join an auction' },
    profile: { title: 'My Profile', subtitle: 'Manage your account and security settings' },
    manage: { title: 'Manage Auction', subtitle: 'Dashboard for your specific auction event' },
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const [tab, setTab] = useState<DashTab>('auctions');
    const { mobile, displayName, logout } = useAuth();
    const navigate = useNavigate();

    // Show display name if set, otherwise last 4 digits of mobile, fallback to 'CB'
    const avatarInitials = displayName
        ? displayName.trim().split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
        : mobile ? mobile.slice(-4, -2) || 'CB' : 'CB';

    const userLabel = displayName || 'Organizer';

    const handleLogout = () => {
        logout();
        navigate('/login', { replace: true });
    };

    const meta = PAGE_META[tab];

    return (
        <div className={styles.shell}>
            {/* ── Sidebar ── */}
            <aside className={styles.sidebar}>
                {/* Breadcrumb / Back to site */}
                <div className={styles.backRow}>
                    <Link to="/" className={styles.backLink}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="15 18 9 12 15 6" />
                        </svg>
                        Back to site
                    </Link>
                </div>

                {/* Nav */}
                <nav className={styles.nav} aria-label="Dashboard navigation">
                    {NAV_ITEMS.map(item => (
                        <button
                            key={item.id}
                            className={`${styles.navItem} ${tab === item.id ? styles.active : ''}`}
                            onClick={() => setTab(item.id)}
                            aria-current={tab === item.id ? 'page' : undefined}
                        >
                            {item.icon}
                            {item.label}
                            {tab === item.id && <span className={styles.activeBar} />}
                        </button>
                    ))}
                </nav>

                {/* Bottom — user info + sign out */}
                <div className={styles.sidebarBottom}>
                    <div className={styles.userRow}>
                        <div className={styles.avatar}>{avatarInitials}</div>
                        <div className={styles.userInfo}>
                            <div className={styles.userName}>{userLabel}</div>
                            <div className={styles.userMobile}>{mobile || '—'}</div>
                        </div>
                    </div>
                    <button className={styles.logoutBtn} onClick={handleLogout} aria-label="Sign out">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                            <polyline points="16 17 21 12 16 7" />
                            <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* ── Main content ── */}
            <main className={styles.main}>
                <div className={styles.pageHeader}>
                    <h1 className={styles.pageTitle}>{meta.title}</h1>
                    <p className={styles.pageSubtitle}>{meta.subtitle}</p>
                </div>
                {children(tab, setTab)}
            </main>

            {/* ── Bottom Tab Bar (mobile) ── */}
            <div className={styles.bottomBar}>
                <nav className={styles.bottomNav}>
                    {NAV_ITEMS.map(item => (
                        <button
                            key={item.id}
                            className={`${styles.bottomNavItem} ${tab === item.id ? styles.active : ''}`}
                            onClick={() => setTab(item.id)}
                        >
                            <svg className={styles.bottomNavIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                {item.icon.props.children}
                            </svg>
                            {item.label.split(' ')[0]}
                        </button>
                    ))}
                </nav>
            </div>
        </div>
    );
}
