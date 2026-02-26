import { useState } from 'react';
import type { DashTab } from './DashboardLayout';
import { useTheme } from '../../context/ThemeContext';
import styles from './MyAuctionsTab.module.css';

interface Props {
    onCreateClick: (t: DashTab) => void;
}

const MOCK_AUCTIONS = [
    {
        id: 1,
        name: 'IPL Season 2026',
        sport: 'Cricket',
        date: '27 Feb 2026',
        venue: 'Wankhede Stadium',
        teams: 8,
        players: 120,
        status: 'live' as const,
        emoji: '🏏',
        bannerClass: '',
    },
    {
        id: 2,
        name: 'Premier Football League',
        sport: 'Football',
        date: '5 Mar 2026',
        venue: 'DY Patil Stadium',
        teams: 6,
        players: 90,
        status: 'upcoming' as const,
        emoji: '⚽',
        bannerClass: 'football',
    },
    {
        id: 3,
        name: 'Volleyball Open Cup',
        sport: 'Volleyball',
        date: '12 Mar 2026',
        venue: 'Indoor Arena',
        teams: 4,
        players: 48,
        status: 'draft' as const,
        emoji: '🏐',
        bannerClass: 'volleyball',
    },
];

export default function MyAuctionsTab({ onCreateClick }: Props) {
    const [query, setQuery] = useState('');
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const filtered = MOCK_AUCTIONS.filter(a =>
        a.name.toLowerCase().includes(query.toLowerCase()) ||
        a.sport.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <div className={`${styles.wrap} ${isDark ? styles.dark : ''}`}>
            {/* Top row */}
            <div className={styles.topRow}>
                <label className={styles.searchBar}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <input
                        className={styles.searchInput}
                        type="text"
                        placeholder="Search auctions..."
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        aria-label="Search auctions"
                    />
                </label>
                <button className={styles.createBtn} onClick={() => onCreateClick('create')}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    New Auction
                </button>
            </div>

            {/* Stats */}
            <div className={styles.statsStrip}>
                {[
                    { icon: '🏆', num: 3, label: 'Total Auctions', cls: 'blue' },
                    { icon: '🟢', num: 1, label: 'Live Now', cls: 'green' },
                    { icon: '📅', num: 1, label: 'Upcoming', cls: 'amber' },
                ].map(s => (
                    <div className={styles.statCard} key={s.label}>
                        <div className={`${styles.statIcon} ${styles[s.cls as 'blue' | 'green' | 'amber']}`}>{s.icon}</div>
                        <div>
                            <div className={styles.statNum}>{s.num}</div>
                            <div className={styles.statLabel}>{s.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Label */}
            <div className={styles.sectionLabel}>All Auctions</div>

            {/* Grid */}
            {filtered.length === 0 ? (
                <div className={styles.empty}>
                    <div className={styles.emptyIcon}>🏏</div>
                    <div className={styles.emptyText}>No auctions found</div>
                    <div className={styles.emptySub}>Try a different search or create a new auction.</div>
                    <button className={`${styles.actBtn} ${styles.primary}`} onClick={() => onCreateClick('create')}>Create Your First Auction</button>
                </div>
            ) : (
                <div className={styles.grid}>
                    {filtered.map(a => (
                        <div className={styles.card} key={a.id}>
                            <div className={`${styles.cardBanner} ${a.bannerClass ? styles[a.bannerClass as 'football' | 'volleyball'] : ''}`}>
                                <span style={{ fontSize: '3rem' }}>{a.emoji}</span>
                                <span className={`${styles.statusBadge} ${styles[a.status]}`}>
                                    {a.status === 'live' ? '🔴 Live' : a.status === 'upcoming' ? '🟡 Upcoming' : '⚪ Draft'}
                                </span>
                            </div>
                            <div className={styles.cardBody}>
                                <div className={styles.cardTop}>
                                    <div className={styles.cardIcon}>{a.emoji}</div>
                                    <div>
                                        <div className={styles.cardName}>{a.name}</div>
                                        <div className={styles.cardSport}>{a.sport}</div>
                                    </div>
                                </div>
                                <div className={styles.cardMeta}>
                                    <div className={styles.metaItem}>
                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                                        {a.date}
                                    </div>
                                    <div className={styles.metaItem}>
                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
                                        {a.venue}
                                    </div>
                                    <div className={styles.metaItem}>
                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" /></svg>
                                        {a.teams} Teams
                                    </div>
                                    <div className={styles.metaItem}>
                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4" /><path d="M6 20v-2a4 4 0 018 0v2" /></svg>
                                        {a.players} Players
                                    </div>
                                </div>
                                <div className={styles.cardActions}>
                                    <button className={styles.actBtn}>View</button>
                                    <button className={styles.actBtn}>Edit</button>
                                    <button className={`${styles.actBtn} ${styles.primary}`}>
                                        {a.status === 'live' ? 'Open' : 'Manage'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
