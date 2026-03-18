import styles from '../../CreateAuctionTab.module.css';
import { useTheme } from '../../../../context/ThemeContext';
import { 
    FaCheckCircle, FaExclamationCircle, FaArrowLeft, FaHammer, 
    FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaCoins, FaInfoCircle,
    FaClipboardList, FaFileAlt, FaTrophy
} from 'react-icons/fa';

interface VerifyStepProps {
    data: any;
    teams: any[];
    players: any[];
    onBack: () => void;
    onSubmit: () => void;
    isSubmitting: boolean;
}

export default function VerifyStep({ data, teams, players, onBack, onSubmit, isSubmitting }: VerifyStepProps) {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const d = isDark ? styles.dark : '';

    return (
        <div className={styles.stepContent}>
            <div className={styles.sectionHeaderInner} style={{ marginBottom: '24px' }}>
                <h2 className={`${styles.sectionTitle} ${d}`}>Final Review</h2>
                <p className={styles.sectionDesc}>Double check all details before launching your tournament.</p>
            </div>

            <div className={styles.summaryGrid}>
                {/* Tournament Info */}
                <div className={`${styles.summaryCard} ${d}`}>
                    <div className={styles.summaryCardLabel}><FaInfoCircle /> Details</div>
                    <div className={styles.summaryCardMain}>
                        <div className={styles.summaryCardTitle}>{data.name || 'Tournament Name'}</div>
                        <div className={styles.summaryCardSub}><FaTrophy /> {data.sport || 'Cricket'}</div>
                        <div className={styles.summaryCardSub}><FaCalendarAlt /> {data.date || 'TBD'} at {data.time || '--:--'}</div>
                        <div className={styles.summaryCardSub}><FaMapMarkerAlt /> {data.venue || 'No Venue Set'}</div>
                    </div>
                </div>

                {/* Auction Rules */}
                <div className={`${styles.summaryCard} ${d}`}>
                    <div className={styles.summaryCardLabel}><FaHammer /> Rules</div>
                    <div className={styles.summaryCardMain}>
                        <div className={styles.summaryPriceGroup}>
                            <div className={styles.summaryPriceItem}>
                                <span className={styles.summaryPriceVal}>{data.pointsPerTeam || '0'}</span>
                                <span className={styles.summaryPriceLabel}>Pts / Team</span>
                            </div>
                            <div className={styles.summaryPriceItem}>
                                <span className={styles.summaryPriceVal}>{data.baseValue || '0'}</span>
                                <span className={styles.summaryPriceLabel}>Base Price</span>
                            </div>
                        </div>
                        <div className={styles.summaryCardSub} style={{ marginTop: '4px' }}>
                            <FaCoins /> Increment: {data.bidIncrement || '0'}
                        </div>
                        <div className={styles.summaryCardSub}>
                            <FaUsers /> {data.playersPerTeam || '11'} Players/Team
                        </div>
                    </div>
                </div>
            </div>

            {/* Teams Section */}
            <div className={`${styles.summarySection} ${d}`}>
                <h3 className={styles.summarySectionTitle}><FaUsers /> Teams ({teams.length})</h3>
                <div className={styles.summaryTagList}>
                    {teams.map(t => (
                        <div key={t.id} className={styles.summaryTag}>
                            {t.logo && <img src={t.logo} alt="" style={{ width: '20px', height: '20px', borderRadius: '4px', objectFit: 'cover' }} />}
                            {t.name} ({t.shortName})
                        </div>
                    ))}
                    {teams.length === 0 && <span className={styles.summarySub}>No teams added yet.</span>}
                </div>
            </div>

            {/* Players Section */}
            <div className={`${styles.summarySection} ${d}`} style={{ marginBottom: '28px' }}>
                <h3 className={styles.summarySectionTitle}><FaUsers /> Players Pool ({players.length})</h3>
                <div className={styles.summaryTagList}>
                    {players.slice(0, 20).map(p => (
                        <div key={p.id} className={styles.summaryTag}>
                            {p.photo && <img src={p.photo} alt="" style={{ width: '20px', height: '20px', borderRadius: '50%', objectFit: 'cover' }} />}
                            {p.name}
                        </div>
                    ))}
                    {players.length > 20 && <div className={styles.summaryTag} style={{ background: 'transparent' }}>+ {players.length - 20} more...</div>}
                    {players.length === 0 && <span className={styles.summarySub}>No players added yet.</span>}
                </div>
            </div>

            <div className={`${styles.verificationNote} ${d}`}>
                <FaExclamationCircle size={20} style={{ marginTop: '2px', flexShrink: 0 }} />
                <div>
                    <strong>Ready to go live?</strong>
                    <p style={{ margin: '4px 0 0 0', opacity: 0.9 }}>
                        Once created, your tournament "{data.name}" will be added to your auctions list.
                        You can manage bidding and auctions from the dashboard.
                    </p>
                </div>
            </div>

            <div className={styles.mobileFooter}>
                <button 
                    type="button" 
                    className={styles.btnPrimaryLarge} 
                    onClick={onSubmit}
                    disabled={isSubmitting || teams.length === 0}
                >
                    {isSubmitting ? (
                        <>Creating...</>
                    ) : (
                        <><FaHammer /> Create Auction</>
                    )}
                </button>

                <button 
                    type="button" 
                    className={styles.btnTextLight} 
                    onClick={onBack} 
                    disabled={isSubmitting}
                >
                    <FaArrowLeft /> Back to Players
                </button>
                
                <p className={styles.submitNote} style={{ textAlign: 'center', marginTop: '8px' }}>Step 4 of 4: Final Verification</p>
            </div>
        </div>
    );
}
