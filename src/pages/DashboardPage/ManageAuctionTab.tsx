import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import styles from './ManageAuctionTab.module.css';

interface Props {
    auctionId: number | null;
    onBack: () => void;
}

type SubTab = 'details' | 'players' | 'team' | 'category' | 'bid-slab' | 'mvp' | 'sponsors' | 'links';

export default function ManageAuctionTab({ auctionId, onBack }: Props) {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const d = isDark ? styles.dark : '';
    const [activeTab, setActiveTab] = useState<SubTab>('details');

    // Mock data based on ID - in a real app, this would be fetched
    const auctionData = {
        id: auctionId || 1,
        name: auctionId === 2 ? 'Premier Football League' : 'Yaiw',
        sport: auctionId === 2 ? 'Football' : 'Cricket',
        date: '27/2/2026',
        time: '02:00 PM',
        venue: 'Wankhede Stadium, Mumbai',
        status: 'Draft',
        playersCount: 0,
        teamsCount: 0,
        code: 'CV4DMU'
    };

    const mockPlayers = [
        { id: 1, name: 'Bhargav', role: 'Bowler', status: 'Available', roleType: 'bowler' },
        { id: 2, name: 'Bhargav', role: 'All-Rounder', status: 'Available', roleType: 'allRounder' },
    ];

    const mockTeams = [
        { id: 1, name: 'India', tag: 'IN', players: 0, pointsUsed: 0, pointsTotal: 0, health: 'Healthy' },
    ];

    const tabs: { id: SubTab; label: string }[] = [
        { id: 'details', label: 'Details' },
        { id: 'players', label: 'Players' },
        { id: 'team', label: 'Team' },
        { id: 'category', label: 'Category' },
        { id: 'bid-slab', label: 'Bid Slab' },
        { id: 'mvp', label: 'MVP' },
        { id: 'sponsors', label: 'Sponsors' },
        { id: 'links', label: 'Links' },
    ];

    const copyCode = () => {
        navigator.clipboard.writeText(auctionData.code);
    };

    return (
        <div className={`${styles.wrap} ${d}`}>
            {/* ── App Header ── */}
            <header className={styles.appHeader}>
                <button className={styles.iconBtn} onClick={onBack} aria-label="Back">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6" /></svg>
                </button>
                <h1 className={styles.appTitle}>{auctionData.name}</h1>
                <div className={styles.headerActions}>
                    <button className={styles.iconBtn} aria-label="Share">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                    </button>
                    <button className={styles.iconBtn} aria-label="More options">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                    </button>
                </div>
            </header>

            {/* ── Tabs Navigation ── */}
            <nav className={styles.tabsNavWrapper}>
                <div className={styles.tabsNavScroll}>
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            className={`${styles.tabBtn} ${activeTab === tab.id ? styles.activeTab : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </nav>

            {/* ── Tab Content ── */}
            <div className={styles.tabContentArea}>
                {activeTab === 'details' && (
                    <div className={styles.detailsTab}>
                        
                        {/* Status Cards Row */}
                        <div className={styles.statusCardsRow}>
                            <div className={`${styles.statusCard} ${styles.cardPlayers}`}>
                                <div className={styles.scIcon}>👤</div>
                                <div className={styles.scVal}>{auctionData.playersCount}</div>
                                <div className={styles.scLabel}>Players</div>
                            </div>
                            <div className={`${styles.statusCard} ${styles.cardTeams}`}>
                                <div className={styles.scIcon}>👥</div>
                                <div className={styles.scVal}>{auctionData.teamsCount}</div>
                                <div className={styles.scLabel}>Teams</div>
                            </div>
                            <div className={`${styles.statusCard} ${styles.cardDraft}`}>
                                <div className={styles.scIcon}>📋</div>
                                <div className={styles.scVal}>{auctionData.status}</div>
                                <div className={styles.scLabel}>Status</div>
                            </div>
                        </div>

                        {/* Large QR Card */}
                        <div className={styles.qrHeroCard}>
                            <div className={styles.qrHeroTop}>
                                <div className={styles.qrHeroIconBox}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M3 3h8v8H3zm2 2v4h4V5zm8-2h8v8h-8zm2 2v4h4V5zM3 13h8v8H3zm2 2v4h4v-4zm13-2h3v2h-3zm-2 3h2v2h-2zm3 2h2v3h-2zm-4 1h3v2h-3zm-2-4h2v2h-2zm2-2h2v2h-2zm-3 8h2v2h-2z" />
                                    </svg>
                                </div>
                                <div className={styles.qrHeroTexts}>
                                    <div className={styles.qrHeroTitle}>Auction QR Code</div>
                                    <div className={styles.qrHeroSub}>Scan or share to join this auction</div>
                                </div>
                                <button className={styles.qrCopyBtn} onClick={copyCode} aria-label="Copy Code">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                                    </svg>
                                </button>
                            </div>

                            <div className={styles.qrHeroCenter}>
                                <div className={styles.qrWhiteBlock}>
                                    <img src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://crickboss.com/join/${auctionData.code}`} alt="QR Code" className={styles.qrImgMain} />
                                    <div className={styles.qrCenterLogo}>🏏</div>
                                </div>
                            </div>

                            <div className={styles.qrHeroBottom}>
                                <div className={styles.qrCodePill}># {auctionData.code}</div>
                                <div className={styles.qrHeroEventName}>{auctionData.name}</div>
                            </div>
                        </div>

                    </div>
                )}

                {activeTab === 'players' && (
                    <div className={styles.playersTab}>
                        <div className={styles.playerStatsRow}>
                            <div className={`${styles.pStat} ${styles.pAll}`}>
                                <div className={styles.pStatVal}>{mockPlayers.length}</div>
                                <div className={styles.pStatLabel}>All</div>
                            </div>
                            <div className={`${styles.pStat} ${styles.pAvailable}`}>
                                <div className={styles.pStatVal}>2</div>
                                <div className={styles.pStatLabel}>Available</div>
                            </div>
                            <div className={`${styles.pStat} ${styles.pSold}`}>
                                <div className={styles.pStatVal}>0</div>
                                <div className={styles.pStatLabel}>Selected</div>
                            </div>
                            <div className={`${styles.pStat} ${styles.pUnsold}`}>
                                <div className={styles.pStatVal}>0</div>
                                <div className={styles.pStatLabel}>Unassigned</div>
                            </div>
                        </div>
                        <div className={styles.playerGrid}>
                            {mockPlayers.map(p => (
                                <div key={p.id} className={styles.playerCard}>
                                    <div className={styles.pLeft}>
                                        <div className={styles.pAvatar}>
                                            <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1976&auto=format&fit=crop" alt={p.name} className={styles.pImg} />
                                        </div>
                                        <div>
                                            <div className={styles.pName}>{p.name}</div>
                                            <div className={`${styles.roleBadge} ${styles[p.roleType as 'bowler' | 'allRounder']}`}>{p.role}</div>
                                        </div>
                                    </div>
                                    <div className={`${styles.pStatusChip} ${styles.chipAvailable}`}>AVAILABLE</div>
                                </div>
                            ))}
                        </div>
                        <button className={styles.fab}>+</button>
                    </div>
                )}

                {activeTab === 'team' && (
                    <div className={styles.teamTab}>
                        <div className={styles.teamGrid}>
                            {mockTeams.map(t => (
                                <div key={t.id} className={styles.teamCard}>
                                    <div className={styles.teamHeader}>
                                        <div className={styles.teamInfoLeft}>
                                            <img src="https://images.unsplash.com/photo-1532375810709-75b1da00537c?q=80&w=2076&auto=format&fit=crop" alt={t.name} className={styles.teamFlag} />
                                            <div>
                                                <div className={styles.teamName}>{t.name}</div>
                                                <div className={styles.teamTag}>{t.tag}</div>
                                            </div>
                                        </div>
                                        <div className={styles.teamPlayerCount}>
                                            <div className={styles.tpCountVal}>{t.players}</div>
                                            <div className={styles.tpCountLabel}>Players</div>
                                        </div>
                                    </div>
                                    <div className={styles.teamBody}>
                                        <div className={styles.budgetBarHeader}>
                                            <div className={styles.budgetLabelBox}>💰 Points</div>
                                            <div className={styles.healthBox}>
                                                <span className={styles.healthBadge}>{t.health}</span>
                                                <span className={styles.budgetValue}>{t.pointsUsed} / {t.pointsTotal}</span>
                                            </div>
                                        </div>
                                        <div className={styles.progressTrack}>
                                            <div className={styles.progressFill} style={{ width: '20%' }} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className={styles.fab}>+</button>
                    </div>
                )}

                {activeTab === 'category' && (
                    <div className={styles.categoryTab}>
                        <div className={styles.reorderHint}>Hold & drag to reorder</div>
                        <div className={styles.roundCard}>
                            <div className={styles.roundHeader}>
                                <div className={styles.roundLabelBox}>
                                    <div className={styles.roundBadge}>
                                        <div className={styles.rLabel}>ROUND</div>
                                        <div className={styles.rNum}>1</div>
                                    </div>
                                    <div>
                                        <div className={styles.roundTitle}>Category 1</div>
                                        <div className={styles.roundSub}>Description</div>
                                    </div>
                                </div>
                                <div className={styles.dragHandle}>:::</div>
                            </div>
                            <div className={styles.roundStatsRow}>
                                <div className={styles.rStat}><div className={styles.rStatVal}>100</div><div className={styles.rStatLabel}>Min Value</div></div>
                                <div className={styles.rStat}><div className={styles.rStatVal}>+50</div><div className={styles.rStatLabel}>Incr</div></div>
                                <div className={styles.rStat}><div className={styles.rStatVal}>11</div><div className={styles.rStatLabel}>Max</div></div>
                            </div>
                        </div>
                        <button className={styles.fab}>+</button>
                    </div>
                )}

                {activeTab === 'bid-slab' && (
                    <div className={styles.slabTab}>
                        <table className={styles.slabTable}>
                            <thead><tr><th>Range</th><th>Increment</th><th>Tier</th></tr></thead>
                            <tbody>
                                <tr><td>100 - 500</td><td>50</td><td><span className={`${styles.tierLabel} ${styles.tierBase}`}>BASE</span></td></tr>
                                <tr><td>500+</td><td>100</td><td><span className={`${styles.tierLabel} ${styles.tierPremium}`}>PREMIUM</span></td></tr>
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'mvp' && (
                    <div className={styles.mvpTab}>
                        <div className={styles.mvpCard}>
                            <div className={styles.crownBox}>👑</div>
                            <div className={styles.mvpTitle}>Tournament MVP</div>
                            <div className={styles.subStatsRow}>
                                <div className={styles.subCard}><div className={styles.subLabel}>Highest Value</div><div className={styles.subVal}>Virat K.</div></div>
                                <div className={styles.subCard}><div className={styles.subLabel}>Best Return</div><div className={styles.subVal}>Ishan K.</div></div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'sponsors' && (
                    <div className={styles.sponsorsTab}>
                        {['Title Sponsor', 'Co-Sponsor'].map(tier => (
                            <div key={tier} className={styles.sponsorTier}>
                                <div className={styles.tierTitle}>{tier}</div>
                                <div className={styles.sponsorGrid}>
                                    <div className={styles.sponsorBox}>+ Add</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'links' && (
                    <div className={styles.linksTab}>
                        <div className={styles.linkGrid}>
                            {['Share', 'QR', 'Join', 'Live', 'Result', 'Export'].map(l => (
                                <div key={l} className={styles.linkCard}>
                                    <div className={styles.lIcon}>🔗</div>
                                    <div className={styles.lTitle}>{l}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>

            {/* ── Sticky Start Button ── */}
            <div className={styles.stickyActionFooter}>
                <div className={styles.footerInnerMax}>
                    <button className={styles.mainActionBtn}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                        Start Auction
                    </button>
                </div>
            </div>

        </div>
    );
}
