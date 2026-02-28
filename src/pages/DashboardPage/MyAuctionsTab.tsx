import { useState, useRef } from 'react';
import type { DashTab } from './DashboardLayout';
import { useTheme } from '../../context/ThemeContext';
import ImageCropper from '../../components/ImageCropper/ImageCropper';
import styles from './MyAuctionsTab.module.css';

interface Props {
    onCreateClick: (t: DashTab) => void;
    onManageClick: (id: number) => void;
}

interface Auction {
    id: number;
    name: string;
    sport: string;
    date: string;
    venue: string;
    teams: number;
    players: number;
    status: 'live' | 'upcoming' | 'draft';
    emoji: string;
    bannerClass: string;
    bannerUrl?: string;
}

const INITIAL_AUCTIONS: Auction[] = [
    { id: 1, name: 'IPL Season 2026', sport: 'Cricket', date: '27 Feb 2026', venue: 'Wankhede Stadium', teams: 8, players: 120, status: 'live', emoji: '🏏', bannerClass: '' },
    { id: 2, name: 'Premier Football League', sport: 'Football', date: '5 Mar 2026', venue: 'DY Patil Stadium', teams: 6, players: 90, status: 'upcoming', emoji: '⚽', bannerClass: 'football' },
    { id: 3, name: 'Volleyball Open Cup', sport: 'Volleyball', date: '12 Mar 2026', venue: 'Indoor Arena', teams: 4, players: 48, status: 'draft', emoji: '🏐', bannerClass: 'volleyball' },
];

export default function MyAuctionsTab({ onCreateClick, onManageClick }: Props) {
    const [query, setQuery] = useState('');
    const [auctions, setAuctions] = useState<Auction[]>(INITIAL_AUCTIONS);
    const [cropState, setCropState] = useState<{ id: number; rawSrc: string } | null>(null);
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    // One hidden file input per card — keyed by auction id
    const fileRefs = useRef<Record<number, HTMLInputElement | null>>({});
    const rawSrcRef = useRef<string>('');

    const handleBannerPick = (id: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const raw = URL.createObjectURL(file);
        rawSrcRef.current = raw;
        setCropState({ id, rawSrc: raw });
        e.target.value = '';
    };

    const handleCropDone = (croppedUrl: string) => {
        if (!cropState) return;
        // Revoke old raw blob
        URL.revokeObjectURL(rawSrcRef.current);
        setAuctions(prev => prev.map(a => a.id === cropState.id ? { ...a, bannerUrl: croppedUrl } : a));
        setCropState(null);
    };

    const handleCropCancel = () => {
        URL.revokeObjectURL(rawSrcRef.current);
        setCropState(null);
    };

    const filtered = auctions.filter(a =>
        a.name.toLowerCase().includes(query.toLowerCase()) ||
        a.sport.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <div className={`${styles.wrap} ${isDark ? styles.dark : ''}`}>

            {/* ── Banner Cropper Modal ── */}
            {cropState && (
                <ImageCropper
                    src={cropState.rawSrc}
                    aspect={16 / 9}
                    title="Crop Banner Image"
                    onCropComplete={handleCropDone}
                    onCancel={handleCropCancel}
                />
            )}

            {/* Top row */}
            <div className={styles.topRow}>
                <label className={styles.searchBar}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <input className={styles.searchInput} type="text" placeholder="Search auctions..." value={query} onChange={e => setQuery(e.target.value)} aria-label="Search auctions" />
                </label>
                <button className={styles.createBtn} onClick={() => onCreateClick('create')}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    New Auction
                </button>
            </div>

            <div className={styles.sectionLabel}>All Auctions</div>

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
                            {/* Banner — 16:9 with upload+crop on hover */}
                            <div
                                className={`${styles.cardBanner} ${!a.bannerUrl && a.bannerClass ? styles[a.bannerClass as 'football' | 'volleyball'] : ''}`}
                                style={a.bannerUrl ? { background: 'none' } : undefined}
                            >
                                {a.bannerUrl
                                    ? <img src={a.bannerUrl} alt={`${a.name} banner`} className={styles.bannerImg} />
                                    : <span className={styles.bannerEmoji}>{a.emoji}</span>
                                }

                                {/* Hidden file input — triggers cropper */}
                                <input
                                    type="file"
                                    accept="image/*"
                                    ref={el => { fileRefs.current[a.id] = el; }}
                                    onChange={e => handleBannerPick(a.id, e)}
                                    className={styles.hiddenInput}
                                    aria-hidden="true"
                                />

                                {/* Upload button — visible on card hover */}
                                <button
                                    type="button"
                                    className={styles.bannerUploadBtn}
                                    onClick={() => fileRefs.current[a.id]?.click()}
                                    aria-label={`Upload banner for ${a.name}`}
                                    title="Upload & crop banner (16:9)"
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                                        <polyline points="17 8 12 3 7 8" />
                                        <line x1="12" y1="3" x2="12" y2="15" />
                                    </svg>
                                </button>

                                <span className={`${styles.statusBadge} ${styles[a.status]}`}>
                                    {a.status === 'live' ? '🔴 Live' : a.status === 'upcoming' ? '🟡 Upcoming' : '⚪ Draft'}
                                </span>
                            </div>

                            {/* Body */}
                            <div className={styles.cardBody}>
                                <div className={styles.cardTop}>
                                    <div className={styles.cardIcon}>{a.emoji}</div>
                                    <div className={styles.cardInfo}>
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
                                    <button
                                        className={`${styles.actBtn} ${styles.primary}`}
                                        onClick={() => onManageClick(a.id)}
                                    >
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
