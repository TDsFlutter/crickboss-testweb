import { useState } from 'react';
import styles from '../../CreateAuctionTab.module.css';
import { useTheme } from '../../../../context/ThemeContext';
import { FaUser, FaPlus, FaTrash, FaImage, FaCheck, FaTimes, FaArrowRight, FaIdCard, FaCoins } from 'react-icons/fa';
import { useImageCropper } from '../../../../components/ImageCropper/ImageCropper';

interface PlayersStepProps {
    players: any[];
    onAddPlayer: (player: any) => void;
    onDeletePlayer: (id: string) => void;
    onNext: () => void;
    onBack: () => void;
}

const CATEGORIES = ['Batsman', 'Bowler', 'All-Rounder', 'Wicketkeeper'];

export default function PlayersStep({ players, onAddPlayer, onDeletePlayer, onNext, onBack }: PlayersStepProps) {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const d = isDark ? styles.dark : '';

    const [isAdding, setIsAdding] = useState(false);
    const [newPlayer, setNewPlayer] = useState({ name: '', category: 'Batsman', baseValue: '' });
    const playerPhoto = useImageCropper();

    const handleAdd = () => {
        if (!newPlayer.name) return;
        onAddPlayer({ 
            ...newPlayer, 
            id: Date.now().toString(),
            photo: playerPhoto.resultUrl
        });
        setNewPlayer({ name: '', category: 'Batsman', baseValue: '' });
        playerPhoto.reset();
        setIsAdding(false);
    };

    return (
        <div className={styles.stepContent}>
            <div className={styles.sectionHeaderInner} style={{ marginBottom: '24px' }}>
                <h2 className={`${styles.sectionTitle} ${d}`}>Add Players</h2>
                <p className={styles.sectionDesc}>Build your auction pool by adding players with categories and base prices</p>
            </div>

            {players.length === 0 && !isAdding ? (
                <div className={`${styles.emptyState} ${d}`}>
                    <div className={styles.emptyIcon}>
                        <FaUser />
                    </div>
                    <h3 className={isDark ? styles.wizardTitle : ''}>No Players Yet</h3>
                    <p>Start by adding players to your auction pool. You can add them one by one below.</p>
                </div>
            ) : (
                <div className={styles.playersList}>
                    {players.map(player => (
                        <div key={player.id} className={`${styles.playerCard} ${d}`}>
                            <div className={styles.playerBrand}>
                                <div className={styles.playerAvatar}>
                                    {player.photo ? (
                                        <img src={player.photo} alt={player.name} className={styles.playerAvatarImg} />
                                    ) : (
                                        <FaUser size={24} />
                                    )}
                                </div>
                                <div className={styles.playerInfo}>
                                    <div className={styles.playerNameText}>{player.name}</div>
                                    <div className={styles.playerSubText}>{player.category}</div>
                                </div>
                            </div>
                            <div className={styles.playerDetailsRow}>
                                <div className={styles.playerValue}>
                                    BASE PRICE
                                </div>
                                <div className={styles.playerPrice}>
                                    ₹{player.baseValue || 0}
                                </div>
                            </div>
                            <button 
                                className={styles.deletePlayerBtn} 
                                onClick={() => onDeletePlayer(player.id)}
                                title="Delete Player"
                            >
                                <FaTrash size={12} />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {isAdding ? (
                <div className={`${styles.addPlayerForm} ${d}`}>
                    <h3 className={styles.sectionTitle} style={{ marginBottom: '16px' }}>New Player</h3>
                    
                    <div className={styles.grid3logo}>
                        <div className={styles.fieldGroup}>
                            <label className={styles.label}><FaIdCard /> Player Name *</label>
                            <input 
                                className={`${styles.input} ${d}`} 
                                placeholder="e.g. Virat Kohli" 
                                value={newPlayer.name} 
                                onChange={e => setNewPlayer({ ...newPlayer, name: e.target.value })} 
                                autoFocus
                            />
                        </div>
                        <div className={styles.fieldGroup}>
                            <label className={styles.label}><FaCoins /> Base Price (₹) *</label>
                            <input 
                                className={`${styles.input} ${d}`} 
                                type="number"
                                placeholder="e.g. 200" 
                                value={newPlayer.baseValue} 
                                onChange={e => setNewPlayer({ ...newPlayer, baseValue: e.target.value })} 
                            />
                        </div>
                        <div className={styles.fieldGroup}>
                            <label className={styles.label}>Player Photo</label>
                            <button 
                                type="button" 
                                className={styles.logoReplaceBtn}
                                onClick={() => playerPhoto.openPicker()}
                                style={{ width: '100%', justifyContent: 'center', height: '40px' }}
                            >
                                {playerPhoto.resultUrl ? <><FaCheck /> Selected</> : <><FaImage /> Browse Photo</>}
                            </button>
                        </div>
                    </div>

                    <div className={styles.fieldGroup} style={{ marginTop: '8px' }}>
                        <label className={styles.label}>Category</label>
                        <div className={styles.catChips}>
                            {CATEGORIES.map(c => (
                                <button 
                                    key={c}
                                    type="button"
                                    className={`${styles.catChip} ${newPlayer.category === c ? styles.catChipActive : ''} ${d}`}
                                    onClick={() => setNewPlayer({ ...newPlayer, category: c })}
                                >
                                    {c}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className={styles.formActions}>
                        <button className={styles.secondaryBtn} onClick={() => { setIsAdding(false); playerPhoto.reset(); }} style={{ flex: 1 }}>
                            <FaTimes /> Cancel
                        </button>
                        <button className={styles.primaryBtn} onClick={handleAdd} style={{ flex: 2 }}>
                            <FaPlus /> Register Player
                        </button>
                    </div>
                </div>
            ) : (
                <button className={styles.addBtnLarge} onClick={() => setIsAdding(true)}>
                    <FaPlus /> Register Another Player
                </button>
            )}

            <div className={styles.stickyFooter}>
                <div className={styles.footerInner}>
                    <button type="button" className={styles.footerBackBtn} onClick={onBack}>Back</button>
                    <button type="button" className={styles.footerNextBtn} onClick={onNext} disabled={players.length === 0}>
                        Next: Verify & Launch <FaArrowRight style={{ marginLeft: '8px' }} />
                    </button>
                </div>
            </div>
        </div>
    );
}
