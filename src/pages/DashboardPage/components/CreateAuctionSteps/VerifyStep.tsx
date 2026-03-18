import styles from '../../CreateAuctionTab.module.css';
import { useTheme } from '../../../../context/ThemeContext';
import { FaCheckCircle, FaExclamationCircle, FaArrowLeft, FaRocket, FaHammer, FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaCoins, FaInfoCircle } from 'react-icons/fa';

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
                <p className={styles.sectionDesc}>Double check all details before launching your auction to the public</p>
            </div>

            <div className={styles.summaryGrid}>
                <div className={`${styles.summaryCard} ${d}`}>
                    <div className={styles.summaryLabel}><FaInfoCircle /> Basic Information</div>
                    <div className={styles.summaryMain}>
                        <div className={styles.summaryTitle}>{data.name || 'Unnamed Auction'}</div>
                        <div className={styles.summarySub}>
                            <FaCalendarAlt size={12} /> {data.date} at {data.time}
                        </div>
                        <div className={styles.summarySub}>
                            <FaMapMarkerAlt size={12} /> {data.venue}
                        </div>
                    </div>
                </div>

                <div className={`${styles.summaryCard} ${d}`}>
                    <div className={styles.summaryLabel}><FaHammer /> Auction Rules</div>
                    <div className={styles.grid2} style={{ marginTop: '4px' }}>
                        <div>
                            <div className={styles.summaryVal}>{data.pointsPerTeam}</div>
                            <div className={styles.summarySub}>Pts / Team</div>
                        </div>
                        <div>
                            <div className={styles.summaryVal}>{data.baseValue}</div>
                            <div className={styles.summarySub}>Min Bid</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={`${styles.section} ${d}`}>
                <div className={styles.summarySectionHead}>
                    <h3 className={`${styles.summaryH3} ${d}`}><FaUsers /> Teams Summary ({teams.length})</h3>
                </div>
                <div className={styles.summaryListSmall}>
                    {teams.map(t => (
                        <div key={t.id} className={styles.summaryTag}>
                            {t.logo && <img src={t.logo} alt="" style={{ width: '16px', height: '16px', borderRadius: '4px', marginRight: '6px', objectFit: 'cover' }} />}
                            {t.shortName || t.name}
                        </div>
                    ))}
                    {teams.length === 0 && <span className={styles.summarySubText}>No teams added yet</span>}
                </div>
            </div>

            <div className={`${styles.section} ${d}`} style={{ marginBottom: '32px' }}>
                <div className={styles.summarySectionHead}>
                    <h3 className={`${styles.summaryH3} ${d}`}><FaUsers /> Players Pool ({players.length})</h3>
                </div>
                <div className={styles.summaryListSmall}>
                    {players.slice(0, 15).map(p => (
                        <div key={p.id} className={styles.summaryTag}>
                            {p.photo && <img src={p.photo} alt="" style={{ width: '16px', height: '16px', borderRadius: '50%', marginRight: '6px', objectFit: 'cover' }} />}
                            {p.name}
                        </div>
                    ))}
                    {players.length > 15 && <div className={styles.summaryTag} style={{ background: 'transparent' }}>+ {players.length - 15} more...</div>}
                    {players.length === 0 && <span className={styles.summarySubText}>No players registered yet</span>}
                </div>
            </div>

            <div className={`${styles.verificationNote} ${d}`}>
                <FaExclamationCircle size={20} style={{ marginTop: '2px', flexShrink: 0 }} />
                <div>
                    <strong>Ready to go live?</strong>
                    <p style={{ margin: '4px 0 0 0', opacity: 0.9 }}>
                        Once launched, your auction will be visible according to your privacy settings ({data.visibility}). 
                        You can still edit some details from the dashboard later.
                    </p>
                </div>
            </div>

            <div className={styles.submitRow} style={{ marginTop: '10px' }}>
                <button 
                    type="button" 
                    className={styles.footerBackBtn} 
                    onClick={onBack} 
                    disabled={isSubmitting}
                >
                    <FaArrowLeft style={{ marginRight: '6px' }} /> Edit Details
                </button>
                <button 
                    type="button" 
                    className={styles.submitBtn} 
                    onClick={onSubmit}
                    disabled={isSubmitting || teams.length === 0}
                >
                    {isSubmitting ? (
                        <>Processing...</>
                    ) : (
                        <><FaRocket style={{ marginRight: '8px' }} /> Launch Auction</>
                    )}
                </button>
                <p className={styles.submitNote}>Step 4 of 4: All set</p>
            </div>
        </div>
    );
}
