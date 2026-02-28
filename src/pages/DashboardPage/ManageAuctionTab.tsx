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
        name: auctionId === 2 ? 'Premier Football League' : 'IPL Season 2026',
        sport: auctionId === 2 ? 'Football' : 'Cricket',
        date: '27/2/2026',
        time: '02:00 PM',
        venue: 'Wankhede Stadium, Mumbai',
        status: 'Draft',
        playersCount: 2,
        teamsCount: 0,
        code: 'A84IGE'
    };

    const mockPlayers = [
        { id: 1, name: 'Bhargav', role: 'Bowler', status: 'Available', roleType: 'bowler' },
        { id: 2, name: 'Bhargav', role: 'All-Rounder', status: 'Available', roleType: 'allRounder' },
    ];

    const mockTeams = [
        { id: 1, name: 'India', tag: 'IN', players: 0, budgetUsed: 0, budgetTotal: 0, health: 'Healthy' },
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
            {/* ── Hero Banner ── */}
            <div className={styles.hero}>
                <button className={styles.heroBack} onClick={onBack} title="Back to auctions">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="15 18 9 12 15 6" />
                    </svg>
                </button>
                <div className={styles.heroBg}>
                    <img
                        src="https://i.pinimg.com/736x/0b/88/e4/0b88e4cafb2f6485fd74048b36b8abee.jpg"
                        alt="Auction Banner"
                        className={styles.heroImg}
                    />
                    <div className={styles.heroOverlay} />
                </div>
                <div className={styles.codeBadgeHero} onClick={copyCode} title="Click to copy join code">
                    {auctionData.code}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                    </svg>
                </div>
            </div>

            {/* ── Tabs Navigation ── */}
            <nav className={styles.tabsNav}>
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        className={`${styles.tabBtn} ${activeTab === tab.id ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </nav>

            {/* ── Tab Content ── */}
            {activeTab === 'details' && (
                <div className={styles.detailsTab} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {/* Auction Info Card */}
                    <div className={styles.infoCard}>
                        <div className={styles.infoTop}>
                            <div className={styles.logoBox}>
                                <div className={styles.logoTxt}>🖼️</div>
                                <div className={styles.logoLabel}>LOGO</div>
                            </div>
                            <div className={styles.infoMain}>
                                <div className={styles.fLabel}>Auction Title</div>
                                <div className={styles.infoAuctionTitle}>{auctionData.name}</div>
                                <div className={styles.fVal} style={{ fontSize: '0.85rem', opacity: 0.8 }}>🏏 {auctionData.sport}</div>
                            </div>
                        </div>
                        <div className={styles.infoGrid}>
                            <div className={styles.field}>
                                <div className={styles.fLabel}>Date</div>
                                <div className={styles.fVal}>{auctionData.date}</div>
                            </div>
                            <div className={styles.field}>
                                <div className={styles.fLabel}>Time</div>
                                <div className={styles.fVal}>{auctionData.time}</div>
                            </div>
                            <div className={styles.field}>
                                <div className={styles.fLabel}>Status</div>
                                <div className={`${styles.statusBadge} ${styles.draftBadge}`}>{auctionData.status}</div>
                            </div>
                        </div>
                        <div className={styles.field}>
                            <div className={styles.fLabel}>Venue</div>
                            <div className={styles.fVal}>{auctionData.venue}</div>
                        </div>
                    </div>

                    <div className={styles.statsGrid}>
                        <div className={`${styles.statCard} ${styles.statBlue}`}>
                            <div className={styles.statIcon}>👥</div>
                            <div className={styles.statValue}>{auctionData.playersCount}</div>
                            <div className={styles.statLabel}>Players</div>
                        </div>
                        <div className={`${styles.statCard} ${styles.statGreen}`}>
                            <div className={styles.statIcon}>🛡️</div>
                            <div className={styles.statValue}>{auctionData.teamsCount}</div>
                            <div className={styles.statLabel}>Teams</div>
                        </div>
                        <div className={`${styles.statCard} ${styles.statGray}`}>
                            <div className={styles.statIcon}>📋</div>
                            <div className={styles.statValue}>1</div>
                            <div className={styles.statLabel}>Categories</div>
                        </div>
                    </div>

                    <div className={styles.qrCard}>
                        <div className={styles.qrHeader}>
                            <div className={styles.qrTitleBox}>
                                <div className={styles.qrIconBox}>📲</div>
                                <div>
                                    <div className={styles.qrLabel}>Auction QR Code</div>
                                    <div className={styles.qrSub}>Scan or share to join</div>
                                </div>
                            </div>
                            <button className={styles.copyBtn} onClick={copyCode}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                                </svg>
                            </button>
                        </div>
                        <div className={styles.qrContainer}>
                            <img
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://crickboss.com/join/${auctionData.code}`}
                                alt="QR"
                                className={styles.qrImg}
                            />
                        </div>
                        <div className={styles.codeBox}>{auctionData.code}</div>
                    </div>

                    <button className={styles.startBtn}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                        Start Auction
                    </button>
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
                            <div className={styles.pStatLabel}>Sold</div>
                        </div>
                        <div className={`${styles.pStat} ${styles.pUnsold}`}>
                            <div className={styles.pStatVal}>0</div>
                            <div className={styles.pStatLabel}>Unsold</div>
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
                                        <div className={styles.budgetLabelBox}>💰 Budget</div>
                                        <div className={styles.healthBox}>
                                            <span className={styles.healthBadge}>{t.health}</span>
                                            <span className={styles.budgetValue}>₹{t.budgetUsed} / ₹{t.budgetTotal}</span>
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
                            <div className={styles.rStat}><div className={styles.rStatVal}>₹100</div><div className={styles.rStatLabel}>Min Bid</div></div>
                            <div className={styles.rStat}><div className={styles.rStatVal}>+₹50</div><div className={styles.rStatLabel}>Incr</div></div>
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
                            <tr><td>₹100 - ₹500</td><td>₹50</td><td><span className={`${styles.tierLabel} ${styles.tierBase}`}>BASE</span></td></tr>
                            <tr><td>₹500+</td><td>₹100</td><td><span className={`${styles.tierLabel} ${styles.tierPremium}`}>PREMIUM</span></td></tr>
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
                            <div className={styles.subCard}><div className={styles.subLabel}>Most Expensive</div><div className={styles.subVal}>Virat K.</div></div>
                            <div className={styles.subCard}><div className={styles.subLabel}>Best Value</div><div className={styles.subVal}>Ishan K.</div></div>
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
                    <button className={styles.startBtn} style={{ marginTop: '20px' }}>Start Auction</button>
                </div>
            )}
        </div>
    );
}
