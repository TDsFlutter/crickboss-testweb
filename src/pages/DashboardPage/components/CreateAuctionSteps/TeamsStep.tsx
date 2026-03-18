import { useState, useRef } from 'react';
import styles from '../../CreateAuctionTab.module.css';
import { useTheme } from '../../../../context/ThemeContext';
import { FaUsers, FaPlus, FaTrash, FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import { useImageCropper } from '../../../../components/ImageCropper/ImageCropper';
import ImageCropper from '../../../../components/ImageCropper/ImageCropper';

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
    const [isDragging, setIsDragging] = useState(false);
    const teamLogo = useImageCropper();
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
        teamLogo.handleFile({ target: fakeInput } as unknown as React.ChangeEvent<HTMLInputElement>);
    };

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
            {/* Cropper modal */}
            {teamLogo.rawSrc && (
                <ImageCropper src={teamLogo.rawSrc} aspect={1} title="Crop Team Logo" onCropComplete={teamLogo.confirm} onCancel={teamLogo.cancel} />
            )}
            <input ref={fileRef} type="file" accept="image/*" onChange={teamLogo.handleFile} style={{ display: 'none' }} />

            <div className={styles.sectionHeaderInner} style={{ marginBottom: '24px' }}>
                <h2 className={`${styles.sectionTitle} ${d}`}>Add Teams</h2>
                <p className={styles.sectionDesc}>Create teams that will participate in this tournament</p>
            </div>

            {teams.length === 0 && !isAdding ? (
                <div className={`${styles.emptyState} ${d}`}>
                    <div className={styles.emptyIcon}><FaUsers /></div>
                    <h3 className={isDark ? styles.wizardTitle : ''}>No Teams Yet</h3>
                    <p>Start by adding teams. Each team needs a name and optionally a logo.</p>
                </div>
            ) : (
                <div className={styles.teamsList}>
                    {teams.map(team => (
                        <div key={team.id} className={`${styles.teamCard} ${d}`}>
                            <div className={styles.teamBrand}>
                                <div className={styles.teamAvatar}>
                                    {team.logo
                                        ? <img src={team.logo} alt={team.name} className={styles.teamAvatarImg} />
                                        : team.name[0].toUpperCase()
                                    }
                                </div>
                                <div className={styles.teamInfo}>
                                    <div className={styles.teamNameText}>{team.name}</div>
                                    <div className={styles.teamShortText}>{team.shortName || 'No short name'}</div>
                                </div>
                            </div>
                            <button className={styles.deleteTeamBtn} onClick={() => onDeleteTeam(team.id)} title="Delete Team">
                                <FaTrash size={12} />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {isAdding ? (
                <div className={`${styles.addTeamForm} ${d}`}>
                    <h3 className={styles.sectionTitle} style={{ marginBottom: '20px' }}>New Team</h3>

                    {/* Row: Fields + Logo drag zone */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 160px', gap: '20px', alignItems: 'start' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            <div className={styles.fieldGroup}>
                                <label className={styles.label}>Team Name <span className={styles.req}>*</span></label>
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
                        </div>

                        {/* Drag & Drop logo zone */}
                        <div className={styles.fieldGroup}>
                            <label className={styles.label}>Team Logo</label>
                            <div
                                className={`${styles.logoZone} ${isDragging ? styles.logoZoneDrag : ''}`}
                                onClick={() => fileRef.current?.click()}
                                onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                                onDragEnter={e => { e.preventDefault(); setIsDragging(true); }}
                                onDragLeave={() => setIsDragging(false)}
                                onDrop={handleDrop}
                                style={{ height: '100px', width: '100%', cursor: 'pointer' }}
                            >
                                {teamLogo.resultUrl ? (
                                    <>
                                        <img src={teamLogo.resultUrl} alt="Logo preview" className={styles.logoPreviewImg} />
                                        <div className={styles.bannerOverlay}>
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                                            Change
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                                        <span style={{ fontSize: '0.72rem', textAlign: 'center', color: isDark ? '#4a5c80' : '#9fafc4' }}>
                                            {isDragging ? 'Drop here' : 'Drag or click'}
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className={styles.formActions} style={{ marginTop: '20px' }}>
                        <button className={styles.secondaryBtn} onClick={() => { setIsAdding(false); teamLogo.reset(); }} style={{ flex: 1 }}>
                            Cancel
                        </button>
                        <button className={styles.primaryBtn} onClick={handleAdd} style={{ flex: 2 }}>
                            <FaPlus /> Save Team
                        </button>
                    </div>
                </div>
            ) : (
                <button className={styles.btnPrimaryLarge} onClick={() => setIsAdding(true)}>
                    <FaPlus /> {teams.length === 0 ? 'Add First Team' : 'Add Another Team'}
                </button>
            )}

            <div className={styles.mobileFooter}>
                <div className={styles.footerRow}>
                    <button type="button" className={styles.btnOutlineLarge} onClick={onBack}>
                        <FaArrowLeft /> Back
                    </button>
                    <button type="button" className={styles.btnPrimaryLarge} onClick={onNext} disabled={teams.length === 0}>
                        Next: Add Players <FaArrowRight />
                    </button>
                </div>
                <p className={styles.submitNote}>Step 2 of 4: Add teams</p>
            </div>
        </div>
    );
}
