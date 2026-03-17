import { useState } from 'react';
import styles from '../../CreateAuctionTab.module.css';
import { useTheme } from '../../../../context/ThemeContext';
import { FaUsers, FaPlus, FaTrash, FaImage, FaCheck, FaTimes, FaArrowRight } from 'react-icons/fa';
import { useImageCropper } from '../../../../components/ImageCropper/ImageCropper';

interface TeamsStepProps {
    teams: any[];
    onAddTeam: (team: any) => void;
    onDeleteTeam: (id: string) => void;
    onNext: () => void;
    onBack: () => void;
}

export default function TeamsStep({ teams, onAddTeam, onDeleteTeam, onNext, onBack }: TeamsStepProps) {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const d = isDark ? styles.dark : '';

    const [isAdding, setIsAdding] = useState(false);
    const [newTeam, setNewTeam] = useState({ name: '', shortName: '' });
    const teamLogo = useImageCropper();

    const handleAdd = () => {
        if (!newTeam.name) return;
        onAddTeam({ 
            ...newTeam, 
            id: Date.now().toString(), 
            players: 0, 
            points: 0,
            logo: teamLogo.resultUrl 
        });
        setNewTeam({ name: '', shortName: '' });
        teamLogo.reset();
        setIsAdding(false);
    };

    return (
        <div className={styles.stepContent}>
            <div className={styles.sectionHeaderInner} style={{ marginBottom: '24px' }}>
                <h2 className={`${styles.sectionTitle} ${d}`}>Add Teams</h2>
                <p className={styles.sectionDesc}>Create teams that will participate in this auction</p>
            </div>

            {teams.length === 0 && !isAdding ? (
                <div className={`${styles.emptyState} ${d}`}>
                    <div className={styles.emptyIcon}>
                        <FaUsers />
                    </div>
                    <h3 className={isDark ? styles.wizardTitle : ''}>No Teams Yet</h3>
                    <p>Start by adding teams to your auction. Click the button below to add your first team.</p>
                </div>
            ) : (
                <div className={styles.teamsList}>
                    {teams.map(team => (
                        <div key={team.id} className={`${styles.teamCard} ${d}`}>
                            <div className={styles.teamBrand}>
                                <div className={styles.teamAvatar}>
                                    {team.logo ? (
                                        <img src={team.logo} alt={team.name} className={styles.teamAvatarImg} />
                                    ) : (
                                        team.name[0].toUpperCase()
                                    )}
                                </div>
                                <div className={styles.teamInfo}>
                                    <div className={styles.teamNameText}>{team.name}</div>
                                    <div className={styles.teamShortText}>{team.shortName || 'N/A'}</div>
                                </div>
                            </div>
                            <div className={styles.teamStats}>
                                <span className={styles.statLine}>{team.players} players</span>
                                <span className={styles.pointsLabel}>₹{team.points} spent</span>
                            </div>
                            <button 
                                className={styles.deleteTeamBtn} 
                                onClick={() => onDeleteTeam(team.id)}
                                title="Delete Team"
                            >
                                <FaTrash size={12} />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {isAdding ? (
                <div className={`${styles.addTeamForm} ${d}`}>
                    <h3 className={styles.sectionTitle} style={{ marginBottom: '16px' }}>New Team</h3>
                    
                    <div className={styles.grid3logo}>
                        <div className={styles.fieldGroup}>
                            <label className={styles.label}>Team Name *</label>
                            <input 
                                className={`${styles.input} ${d}`} 
                                placeholder="e.g. Mumbai Indians" 
                                value={newTeam.name} 
                                onChange={e => setNewTeam({ ...newTeam, name: e.target.value })} 
                                autoFocus
                            />
                        </div>
                        <div className={styles.fieldGroup}>
                            <label className={styles.label}>Short Name</label>
                            <input 
                                className={`${styles.input} ${d}`} 
                                placeholder="e.g. MI" 
                                value={newTeam.shortName} 
                                onChange={e => setNewTeam({ ...newTeam, shortName: e.target.value })} 
                            />
                        </div>
                        <div className={styles.fieldGroup}>
                            <label className={styles.label}>Team Logo</label>
                            <button 
                                type="button" 
                                className={styles.logoReplaceBtn}
                                onClick={() => teamLogo.openPicker()}
                                style={{ width: '100%', justifyContent: 'center', height: '40px' }}
                            >
                                {teamLogo.resultUrl ? <><FaCheck /> Selected</> : <><FaImage /> Browse Image</>}
                            </button>
                        </div>
                    </div>

                    <div className={styles.formActions}>
                        <button className={styles.secondaryBtn} onClick={() => { setIsAdding(false); teamLogo.reset(); }} style={{ flex: 1 }}>
                            <FaTimes /> Cancel
                        </button>
                        <button className={styles.primaryBtn} onClick={handleAdd} style={{ flex: 2 }}>
                            <FaPlus /> Save Team
                        </button>
                    </div>
                </div>
            ) : (
                <button className={styles.addBtnLarge} onClick={() => setIsAdding(true)}>
                    <FaPlus /> Add Another Team
                </button>
            )}

            <div className={styles.stickyFooter}>
                <div className={styles.footerInner}>
                    <button type="button" className={styles.footerBackBtn} onClick={onBack}>Back</button>
                    <button type="button" className={styles.footerNextBtn} onClick={onNext} disabled={teams.length === 0}>
                        Next: Add Players <FaArrowRight style={{ marginLeft: '8px' }} />
                    </button>
                </div>
            </div>
        </div>
    );
}
