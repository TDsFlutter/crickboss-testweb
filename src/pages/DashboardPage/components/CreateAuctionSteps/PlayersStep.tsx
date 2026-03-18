import { useState, useRef } from 'react';
import styles from '../../CreateAuctionTab.module.css';
import { useTheme } from '../../../../context/ThemeContext';
import { FaUser, FaPlus, FaTrash, FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import { useImageCropper } from '../../../../components/ImageCropper/ImageCropper';
import ImageCropper from '../../../../components/ImageCropper/ImageCropper';

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
    const [isDragging, setIsDragging] = useState(false);
    const playerPhoto = useImageCropper();
    const fileRef = useRef<HTMLInputElement>(null);

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (!file || !file.type.startsWith('image/')) return;
        const dt = new DataTransfer();
        dt.items.add(file);
        const fakeInput = document.createElement('input');
        fakeInput.type = 'file';
        Object.defineProperty(fakeInput, 'files', { value: dt.files });
        playerPhoto.handleFile({ target: fakeInput } as unknown as React.ChangeEvent<HTMLInputElement>);
    };

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
            {/* Cropper modal */}
            {playerPhoto.rawSrc && (
                <ImageCropper src={playerPhoto.rawSrc} aspect={1} title="Crop Player Photo" onCropComplete={playerPhoto.confirm} onCancel={playerPhoto.cancel} />
            )}
            <input ref={fileRef} type="file" accept="image/*" onChange={playerPhoto.handleFile} style={{ display: 'none' }} />

            <div className={styles.sectionHeaderInner} style={{ marginBottom: '24px' }}>
                <h2 className={`${styles.sectionTitle} ${d}`}>Add Players</h2>
                <p className={styles.sectionDesc}>Build your player pool with roles, base prices, and photos</p>
            </div>

            {players.length === 0 && !isAdding ? (
                <div className={`${styles.emptyState} ${d}`}>
                    <div className={styles.emptyIcon}><FaUser /></div>
                    <h3 className={isDark ? styles.wizardTitle : ''}>No Players Yet</h3>
                    <p>Add players to your tournament — set their role, base price and photo.</p>
                </div>
            ) : (
                <div className={styles.playersList}>
                    {players.map(player => (
                        <div key={player.id} className={`${styles.playerCard} ${d}`}>
                            <div className={styles.playerBrand}>
                                <div className={styles.playerAvatar}>
                                    {player.photo
                                        ? <img src={player.photo} alt={player.name} className={styles.playerAvatarImg} />
                                        : <FaUser size={20} />
                                    }
                                </div>
                                <div className={styles.playerInfo}>
                                    <div className={styles.playerNameText}>{player.name}</div>
                                    <div className={styles.playerSubText}>{player.category}</div>
                                </div>
                            </div>
                            <div className={styles.playerDetailsRow}>
                                <div className={styles.playerValue}>BASE</div>
                                <div className={styles.playerPrice}>₹{player.baseValue || 0}</div>
                            </div>
                            <button className={styles.deletePlayerBtn} onClick={() => onDeletePlayer(player.id)} title="Delete Player">
                                <FaTrash size={12} />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {isAdding ? (
                <div className={`${styles.addPlayerForm} ${d}`}>
                    <h3 className={styles.sectionTitle} style={{ marginBottom: '20px' }}>New Player</h3>

                    {/* Row: Photo zone + Fields */}
                    <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '20px', alignItems: 'start' }}>
                        {/* Drag & Drop photo zone — left */}
                        <div className={styles.fieldGroup}>
                            <label className={styles.label}>Photo</label>
                            <div
                                className={`${styles.logoZone} ${isDragging ? styles.logoZoneDrag : ''}`}
                                onClick={() => fileRef.current?.click()}
                                onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                                onDragEnter={e => { e.preventDefault(); setIsDragging(true); }}
                                onDragLeave={() => setIsDragging(false)}
                                onDrop={handleDrop}
                                style={{ height: '120px', width: '100%', cursor: 'pointer', borderRadius: '50%' }}
                            >
                                {playerPhoto.resultUrl ? (
                                    <>
                                        <img src={playerPhoto.resultUrl} alt="Player photo" className={styles.logoPreviewImg} style={{ borderRadius: '50%' }} />
                                        <div className={styles.bannerOverlay} style={{ borderRadius: '50%' }}>
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <FaUser size={28} style={{ color: isDark ? '#4a5c80' : '#c0cce0', marginBottom: '4px' }} />
                                        <span style={{ fontSize: '0.65rem', textAlign: 'center', color: isDark ? '#4a5c80' : '#9fafc4' }}>
                                            {isDragging ? 'Drop!' : 'Tap / Drag'}
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Fields — right */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            <div className={styles.fieldGroup}>
                                <label className={styles.label}>Player Name <span className={styles.req}>*</span></label>
                                <input
                                    className={`${styles.input} ${d}`}
                                    placeholder="e.g. Virat Kohli"
                                    value={newPlayer.name}
                                    onChange={e => setNewPlayer({ ...newPlayer, name: e.target.value })}
                                    autoFocus
                                />
                            </div>
                            <div className={styles.fieldGroup}>
                                <label className={styles.label}>Base Price (₹)</label>
                                <input
                                    className={`${styles.input} ${d}`}
                                    type="number"
                                    placeholder="e.g. 200"
                                    value={newPlayer.baseValue}
                                    onChange={e => setNewPlayer({ ...newPlayer, baseValue: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Category chips */}
                    <div className={styles.fieldGroup} style={{ marginTop: '16px' }}>
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

                    <div className={styles.formActions} style={{ marginTop: '20px' }}>
                        <button className={styles.secondaryBtn} onClick={() => { setIsAdding(false); playerPhoto.reset(); }} style={{ flex: 1 }}>
                            Cancel
                        </button>
                        <button className={styles.primaryBtn} onClick={handleAdd} style={{ flex: 2 }}>
                            <FaPlus /> Register Player
                        </button>
                    </div>
                </div>
            ) : (
                <button className={styles.btnPrimaryLarge} onClick={() => setIsAdding(true)}>
                    <FaPlus /> {players.length === 0 ? 'Add First Player' : 'Add Another Player'}
                </button>
            )}

            <div className={styles.mobileFooter}>
                <div className={styles.footerRow}>
                    <button type="button" className={styles.btnOutlineLarge} onClick={onBack}>
                        <FaArrowLeft /> Back
                    </button>
                    <button type="button" className={styles.btnPrimaryLarge} onClick={onNext} disabled={players.length === 0}>
                        Next: Verify & Launch <FaArrowRight />
                    </button>
                </div>
                <p className={styles.submitNote}>Step 3 of 4: Add players</p>
            </div>
        </div>
    );
}
