import { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { api } from '../../utils/api';
import styles from './ManageTournamentTab.module.css';
import { useImageCropper } from '../../components/ImageCropper/ImageCropper';
import ImageCropper from '../../components/ImageCropper/ImageCropper';

interface Props {
    tournamentId: number | null;
    onBack: () => void;
}

interface Team { id: number | string; name: string; short_name?: string; logo?: string; }
interface Player { id: number | string; name: string; role?: string; team_id?: number | string; photo?: string; base_price?: number; }

const ROLES = ['Batsman', 'Bowler', 'All-Rounder', 'Wicketkeeper'];

export default function ManageTournamentTab({ tournamentId, onBack }: Props) {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const cls = (c: string) => `${styles[c] || ''} ${isDark ? styles.dark : ''}`.trim();

    const [activeSubTab, setActiveSubTab] = useState<'teams' | 'players'>('teams');
    const [teams, setTeams] = useState<Team[]>([]);
    const [players, setPlayers] = useState<Player[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Team panel state
    const [showTeamPanel, setShowTeamPanel] = useState(false);
    const [teamName, setTeamName] = useState('');
    const [teamShort, setTeamShort] = useState('');
    const [teamDragging, setTeamDragging] = useState(false);
    const teamLogo = useImageCropper();
    const teamFileRef = useRef<HTMLInputElement>(null);

    // Player panel state
    const [showPlayerPanel, setShowPlayerPanel] = useState(false);
    const [playerName, setPlayerName] = useState('');
    const [playerRole, setPlayerRole] = useState('Batsman');
    const [playerBasePrice, setPlayerBasePrice] = useState('');
    const [playerTeam, setPlayerTeam] = useState('');
    const [playerDragging, setPlayerDragging] = useState(false);
    const playerPhoto = useImageCropper();
    const playerFileRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (tournamentId) fetchData();
    }, [tournamentId]);

    const fetchData = async () => {
        if (!tournamentId) return;
        setLoading(true);
        try {
            const [teamsRes, playersRes] = await Promise.all([
                api.tournaments.teams.list(tournamentId),
                api.tournaments.players.list(tournamentId)
            ]);
            setTeams(Array.isArray(teamsRes?.data) ? teamsRes.data : Array.isArray(teamsRes) ? teamsRes : []);
            setPlayers(Array.isArray(playersRes?.data) ? playersRes.data : Array.isArray(playersRes) ? playersRes : []);
        } catch (err) {
            console.error('Error fetching tournament data:', err);
        } finally {
            setLoading(false);
        }
    };

    // Drop handler factory
    const makeDrop = (cropper: ReturnType<typeof useImageCropper>, setDrag: (v: boolean) => void) => (e: React.DragEvent) => {
        e.preventDefault();
        setDrag(false);
        const file = e.dataTransfer.files?.[0];
        if (!file?.type.startsWith('image/')) return;
        const dt = new DataTransfer();
        dt.items.add(file);
        const fake = document.createElement('input');
        fake.type = 'file';
        Object.defineProperty(fake, 'files', { value: dt.files });
        cropper.handleFile({ target: fake } as unknown as React.ChangeEvent<HTMLInputElement>);
    };

    const handleAddTeam = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!tournamentId || !teamName.trim()) return;
        setSaving(true);
        try {
            await api.tournaments.teams.add(tournamentId, {
                name: teamName,
                short_name: teamShort,
                logo: teamLogo.resultUrl || undefined,
            });
            setShowTeamPanel(false);
            setTeamName(''); setTeamShort(''); teamLogo.reset();
            fetchData();
        } catch (err) {
            console.error(err);
            alert('Error adding team');
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteTeam = async (teamId: number | string) => {
        if (!tournamentId) return;
        if (!confirm('Delete this team?')) return;
        try {
            await api.tournaments.teams.delete(tournamentId, teamId);
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddPlayer = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!tournamentId || !playerName.trim()) return;
        setSaving(true);
        try {
            await api.tournaments.players.add(tournamentId, {
                name: playerName,
                role: playerRole,
                team_id: playerTeam || null,
                base_price: playerBasePrice ? Number(playerBasePrice) : undefined,
                photo: playerPhoto.resultUrl || undefined,
            });
            setShowPlayerPanel(false);
            setPlayerName(''); setPlayerRole('Batsman'); setPlayerBasePrice(''); setPlayerTeam(''); playerPhoto.reset();
            fetchData();
        } catch (err) {
            console.error(err);
            alert('Error adding player');
        } finally {
            setSaving(false);
        }
    };

    if (!tournamentId) {
        return (
            <div className={styles.wrap}>
                <button className={styles.backBtn} onClick={onBack}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6" /></svg>
                    Back
                </button>
                <div className={styles.empty}>No Tournament Selected</div>
            </div>
        );
    }

    return (
        <div className={`${styles.wrap} ${isDark ? styles.dark : ''}`}>
            {/* Croppers */}
            {teamLogo.rawSrc && <ImageCropper src={teamLogo.rawSrc} aspect={1} title="Crop Team Logo" onCropComplete={teamLogo.confirm} onCancel={teamLogo.cancel} />}
            {playerPhoto.rawSrc && <ImageCropper src={playerPhoto.rawSrc} aspect={1} title="Crop Player Photo" onCropComplete={playerPhoto.confirm} onCancel={playerPhoto.cancel} />}
            <input ref={teamFileRef} type="file" accept="image/*" onChange={teamLogo.handleFile} style={{ display: 'none' }} />
            <input ref={playerFileRef} type="file" accept="image/*" onChange={playerPhoto.handleFile} style={{ display: 'none' }} />

            {/* Header */}
            <div className={styles.header}>
                <button className={styles.backBtn} onClick={onBack}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6" /></svg>
                    Back to Tournaments
                </button>
                <h2 className={styles.title}>Manage Tournament <span className={styles.idBadge}>#{tournamentId}</span></h2>
            </div>

            {/* Sub tabs */}
            <div className={styles.tabsRow}>
                <button className={`${styles.subTab} ${activeSubTab === 'teams' ? styles.active : ''}`} onClick={() => setActiveSubTab('teams')}>
                    🛡️ Teams <span className={styles.cnt}>{teams.length}</span>
                </button>
                <button className={`${styles.subTab} ${activeSubTab === 'players' ? styles.active : ''}`} onClick={() => setActiveSubTab('players')}>
                    🏏 Players <span className={styles.cnt}>{players.length}</span>
                </button>
            </div>

            {/* Content */}
            <div className={styles.content}>
                {loading ? (
                    <div className={styles.loadingWrap}>
                        <div className={styles.spinner} />
                        <span>Loading tournament data...</span>
                    </div>
                ) : activeSubTab === 'teams' ? (
                    <div className={styles.tabContent}>
                        <div className={styles.actionBar}>
                            <div>
                                <h3 className={styles.contentTitle}>Registered Teams</h3>
                                <p className={styles.contentSub}>{teams.length} team{teams.length !== 1 ? 's' : ''} registered</p>
                            </div>
                            <button className={styles.addBtn} onClick={() => setShowTeamPanel(true)}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                                Add Team
                            </button>
                        </div>
                        {teams.length === 0 ? (
                            <div className={styles.emptyCard}>
                                <div className={styles.emptyEmoji}>🛡️</div>
                                <h4>No Teams Yet</h4>
                                <p>Click "Add Team" to register your first team in this tournament.</p>
                            </div>
                        ) : (
                            <div className={styles.cardGrid}>
                                {teams.map(team => (
                                    <div key={team.id} className={styles.entityCard}>
                                        <div className={styles.cardAvatar} style={{ backgroundImage: team.logo ? `url(${team.logo})` : undefined }}>
                                            {!team.logo && <span>{team.name[0].toUpperCase()}</span>}
                                        </div>
                                        <div className={styles.cardInfo}>
                                            <div className={styles.cardName}>{team.name}</div>
                                            <div className={styles.cardSub}>{team.short_name || 'No short name'}</div>
                                        </div>
                                        <button className={styles.removeBtn} onClick={() => handleDeleteTeam(team.id)} title="Remove team">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className={styles.tabContent}>
                        <div className={styles.actionBar}>
                            <div>
                                <h3 className={styles.contentTitle}>Registered Players</h3>
                                <p className={styles.contentSub}>{players.length} player{players.length !== 1 ? 's' : ''} registered</p>
                            </div>
                            <button className={styles.addBtn} onClick={() => setShowPlayerPanel(true)}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                                Add Player
                            </button>
                        </div>
                        {players.length === 0 ? (
                            <div className={styles.emptyCard}>
                                <div className={styles.emptyEmoji}>🏏</div>
                                <h4>No Players Yet</h4>
                                <p>Click "Add Player" to register players in this tournament.</p>
                            </div>
                        ) : (
                            <div className={styles.cardGrid}>
                                {players.map(player => {
                                    const team = teams.find(t => String(t.id) === String(player.team_id));
                                    return (
                                        <div key={player.id} className={styles.entityCard}>
                                            <div className={styles.cardAvatar} style={{ backgroundImage: player.photo ? `url(${player.photo})` : undefined, borderRadius: '50%' }}>
                                                {!player.photo && (
                                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
                                                )}
                                            </div>
                                            <div className={styles.cardInfo}>
                                                <div className={styles.cardName}>{player.name}</div>
                                                <div className={styles.cardSub}>
                                                    <span className={styles.rolePill}>{player.role || 'N/A'}</span>
                                                    {team && <span className={styles.teamPill}>{team.name}</span>}
                                                </div>
                                            </div>
                                            {player.base_price && (
                                                <div className={styles.priceTag}>₹{player.base_price}</div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* ── TEAM Slide Panel ── */}
            {showTeamPanel && (
                <div className={styles.panelBackdrop} onClick={() => setShowTeamPanel(false)}>
                    <div className={`${styles.slidePanel} ${isDark ? styles.dark : ''}`} onClick={e => e.stopPropagation()}>
                        <div className={styles.panelHeader}>
                            <h3>🛡️ Add New Team</h3>
                            <button className={styles.panelClose} onClick={() => setShowTeamPanel(false)}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                            </button>
                        </div>
                        <form onSubmit={handleAddTeam} className={styles.panelForm}>
                            {/* Logo drag zone */}
                            <div className={styles.panelAvatarWrap}>
                                <div
                                    className={`${styles.panelAvatarZone} ${teamDragging ? styles.dragging : ''}`}
                                    onClick={() => teamFileRef.current?.click()}
                                    onDragOver={e => { e.preventDefault(); setTeamDragging(true); }}
                                    onDragEnter={e => { e.preventDefault(); setTeamDragging(true); }}
                                    onDragLeave={() => setTeamDragging(false)}
                                    onDrop={makeDrop(teamLogo, setTeamDragging)}
                                >
                                    {teamLogo.resultUrl ? (
                                        <>
                                            <img src={teamLogo.resultUrl} alt="Logo" className={styles.avatarPreview} />
                                            <div className={styles.avatarOverlay}>
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                                                Change
                                            </div>
                                        </>
                                    ) : (
                                        <div className={styles.avatarPlaceholder}>
                                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                                            <span>{teamDragging ? 'Drop here!' : 'Team Logo'}</span>
                                            <small>Drag & drop or tap</small>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className={styles.panelField}>
                                <label>Team Name <span className={styles.req}>*</span></label>
                                <input required value={teamName} onChange={e => setTeamName(e.target.value)} placeholder="e.g. Mumbai Indians" className={styles.panelInput} />
                            </div>
                            <div className={styles.panelField}>
                                <label>Short Name</label>
                                <input value={teamShort} onChange={e => setTeamShort(e.target.value)} placeholder="e.g. MI" className={styles.panelInput} />
                            </div>

                            <div className={styles.panelActions}>
                                <button type="button" className={styles.panelCancelBtn} onClick={() => { setShowTeamPanel(false); teamLogo.reset(); }}>Cancel</button>
                                <button type="submit" className={styles.panelSubmitBtn} disabled={saving}>
                                    {saving ? 'Saving...' : '+ Add Team'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ── PLAYER Slide Panel ── */}
            {showPlayerPanel && (
                <div className={styles.panelBackdrop} onClick={() => setShowPlayerPanel(false)}>
                    <div className={`${styles.slidePanel} ${isDark ? styles.dark : ''}`} onClick={e => e.stopPropagation()}>
                        <div className={styles.panelHeader}>
                            <h3>🏏 Add New Player</h3>
                            <button className={styles.panelClose} onClick={() => setShowPlayerPanel(false)}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                            </button>
                        </div>
                        <form onSubmit={handleAddPlayer} className={styles.panelForm}>
                            {/* Photo drag zone */}
                            <div className={styles.panelAvatarWrap}>
                                <div
                                    className={`${styles.panelAvatarZone} ${styles.round} ${playerDragging ? styles.dragging : ''}`}
                                    onClick={() => playerFileRef.current?.click()}
                                    onDragOver={e => { e.preventDefault(); setPlayerDragging(true); }}
                                    onDragEnter={e => { e.preventDefault(); setPlayerDragging(true); }}
                                    onDragLeave={() => setPlayerDragging(false)}
                                    onDrop={makeDrop(playerPhoto, setPlayerDragging)}
                                >
                                    {playerPhoto.resultUrl ? (
                                        <>
                                            <img src={playerPhoto.resultUrl} alt="Photo" className={styles.avatarPreview} />
                                            <div className={styles.avatarOverlay}>
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                                                Change
                                            </div>
                                        </>
                                    ) : (
                                        <div className={styles.avatarPlaceholder}>
                                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
                                            <span>{playerDragging ? 'Drop here!' : 'Player Photo'}</span>
                                            <small>Drag & drop or tap</small>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className={styles.panelField}>
                                <label>Player Name <span className={styles.req}>*</span></label>
                                <input required value={playerName} onChange={e => setPlayerName(e.target.value)} placeholder="e.g. Virat Kohli" className={styles.panelInput} />
                            </div>
                            <div className={styles.panelField}>
                                <label>Base Price (₹)</label>
                                <input type="number" value={playerBasePrice} onChange={e => setPlayerBasePrice(e.target.value)} placeholder="e.g. 500" className={styles.panelInput} />
                            </div>

                            {/* Role chips */}
                            <div className={styles.panelField}>
                                <label>Role</label>
                                <div className={styles.roleChips}>
                                    {ROLES.map(r => (
                                        <button
                                            key={r}
                                            type="button"
                                            className={`${styles.roleChip} ${playerRole === r ? styles.roleChipActive : ''}`}
                                            onClick={() => setPlayerRole(r)}
                                        >{r}</button>
                                    ))}
                                </div>
                            </div>

                            <div className={styles.panelField}>
                                <label>Assign Team <span style={{ fontWeight: 400, color: '#9fafc4' }}>(optional)</span></label>
                                <select value={playerTeam} onChange={e => setPlayerTeam(e.target.value)} className={styles.panelInput}>
                                    <option value="">— Unassigned —</option>
                                    {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                </select>
                            </div>

                            <div className={styles.panelActions}>
                                <button type="button" className={styles.panelCancelBtn} onClick={() => { setShowPlayerPanel(false); playerPhoto.reset(); }}>Cancel</button>
                                <button type="submit" className={styles.panelSubmitBtn} disabled={saving}>
                                    {saving ? 'Saving...' : '+ Add Player'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
