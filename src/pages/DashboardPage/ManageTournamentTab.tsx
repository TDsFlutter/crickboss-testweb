import { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { api } from '../../utils/api';
import styles from './ManageTournamentTab.module.css';

interface Props {
    tournamentId: number | null;
    onBack: () => void;
}

interface Team { id: number | string; name: string; }
interface Player { id: number | string; name: string; role?: string; team_id?: number | string; }

export default function ManageTournamentTab({ tournamentId, onBack }: Props) {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    
    const [activeSubTab, setActiveSubTab] = useState<'teams' | 'players'>('teams');
    const [teams, setTeams] = useState<Team[]>([]);
    const [players, setPlayers] = useState<Player[]>([]);
    const [loading, setLoading] = useState(true);

    const [showTeamModal, setShowTeamModal] = useState(false);
    const [newTeamName, setNewTeamName] = useState('');

    const [showPlayerModal, setShowPlayerModal] = useState(false);
    const [newPlayerName, setNewPlayerName] = useState('');
    const [newPlayerRole, setNewPlayerRole] = useState('Batsman');
    const [selectedTeam, setSelectedTeam] = useState(''); // for player assigning to team

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
            if (teamsRes.success && Array.isArray(teamsRes.data)) setTeams(teamsRes.data);
            else if (Array.isArray(teamsRes)) setTeams(teamsRes as any);

            if (playersRes.success && Array.isArray(playersRes.data)) setPlayers(playersRes.data);
            else if (Array.isArray(playersRes)) setPlayers(playersRes as any);

        } catch (err) {
            console.error('Error fetching tournament data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddTeam = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!tournamentId || !newTeamName.trim()) return;
        try {
            await api.tournaments.teams.add(tournamentId, { name: newTeamName });
            setShowTeamModal(false);
            setNewTeamName('');
            fetchData();
        } catch (err) {
            console.error(err);
            alert('Error adding team');
        }
    };

    const handleDeleteTeam = async (teamId: number | string) => {
        if (!tournamentId) return;
        if (!confirm('Are you sure you want to delete this team?')) return;
        try {
            await api.tournaments.teams.delete(tournamentId, teamId);
            fetchData();
        } catch (err) {
            console.error(err);
            alert('Error deleting team');
        }
    };

    const handleAddPlayer = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!tournamentId || !newPlayerName.trim()) return;
        try {
            await api.tournaments.players.add(tournamentId, { 
                name: newPlayerName, 
                role: newPlayerRole,
                team_id: selectedTeam || null 
            });
            setShowPlayerModal(false);
            setNewPlayerName('');
            setNewPlayerRole('Batsman');
            setSelectedTeam('');
            fetchData();
        } catch (err) {
            console.error(err);
            alert('Error adding player');
        }
    };

    if (!tournamentId) {
        return <div className={styles.wrap}><button onClick={onBack}>Back</button> No Tournament Selected</div>;
    }

    return (
        <div className={`${styles.wrap} ${isDark ? styles.dark : ''}`}>
            
            <div className={styles.header}>
                <button className={styles.backBtn} onClick={onBack}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 18 9 12 15 6" />
                    </svg>
                    Back to Tournaments
                </button>
                <h2 className={styles.title}>Manage Tournament #{tournamentId}</h2>
            </div>

            <div className={styles.tabsRow}>
                <button className={`${styles.subTab} ${activeSubTab === 'teams' ? styles.active : ''}`} onClick={() => setActiveSubTab('teams')}>
                    Teams ({teams.length})
                </button>
                <button className={`${styles.subTab} ${activeSubTab === 'players' ? styles.active : ''}`} onClick={() => setActiveSubTab('players')}>
                    Players ({players.length})
                </button>
            </div>

            <div className={styles.content}>
                {loading ? (
                    <div className={styles.empty}>Loading...</div>
                ) : activeSubTab === 'teams' ? (
                    <div className={styles.tabContent}>
                        <div className={styles.actionBar}>
                            <h3>Registered Teams</h3>
                            <button className={styles.actBtn} onClick={() => setShowTeamModal(true)}>+ Add Team</button>
                        </div>
                        {teams.length === 0 ? (
                            <div className={styles.empty}>No teams added yet.</div>
                        ) : (
                            <div className={styles.list}>
                                {teams.map(team => (
                                    <div key={team.id} className={styles.listItem}>
                                        <div className={styles.itemInfo}>
                                            <span className={styles.itemName}>{team.name}</span>
                                            <span className={styles.itemSub}>ID: {team.id}</span>
                                        </div>
                                        <button className={styles.deleteBtn} onClick={() => handleDeleteTeam(team.id)}>Remove</button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className={styles.tabContent}>
                        <div className={styles.actionBar}>
                            <h3>Registered Players</h3>
                            <button className={styles.actBtn} onClick={() => setShowPlayerModal(true)}>+ Add Player</button>
                        </div>
                        {players.length === 0 ? (
                            <div className={styles.empty}>No players added yet.</div>
                        ) : (
                            <div className={styles.list}>
                                {players.map(player => {
                                    const team = teams.find(t => String(t.id) === String(player.team_id));
                                    return (
                                        <div key={player.id} className={styles.listItem}>
                                            <div className={styles.itemInfo}>
                                                <span className={styles.itemName}>{player.name}</span>
                                                <span className={styles.itemSub}>{player.role} {team ? `• ${team.name}` : ''}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* TEAM MODAL */}
            {showTeamModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <h3>Add New Team</h3>
                        <form onSubmit={handleAddTeam}>
                            <div className={styles.formGroup}>
                                <label>Team Name</label>
                                <input required value={newTeamName} onChange={e => setNewTeamName(e.target.value)} placeholder="e.g. Mumbai Indians" />
                            </div>
                            <div className={styles.modalActions}>
                                <button type="button" onClick={() => setShowTeamModal(false)} className={styles.cancelBtn}>Cancel</button>
                                <button type="submit" className={styles.submitBtn}>Add Team</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* PLAYER MODAL */}
            {showPlayerModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <h3>Add New Player</h3>
                        <form onSubmit={handleAddPlayer}>
                            <div className={styles.formGroup}>
                                <label>Player Name</label>
                                <input required value={newPlayerName} onChange={e => setNewPlayerName(e.target.value)} placeholder="e.g. Virat Kohli" />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Role</label>
                                <select value={newPlayerRole} onChange={e => setNewPlayerRole(e.target.value)}>
                                    <option>Batsman</option>
                                    <option>Bowler</option>
                                    <option>All-Rounder</option>
                                    <option>Wicket Keeper</option>
                                </select>
                            </div>
                            <div className={styles.formGroup}>
                                <label>Assign Team (Optional)</label>
                                <select value={selectedTeam} onChange={e => setSelectedTeam(e.target.value)}>
                                    <option value="">-- None --</option>
                                    {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                </select>
                            </div>
                            <div className={styles.modalActions}>
                                <button type="button" onClick={() => setShowPlayerModal(false)} className={styles.cancelBtn}>Cancel</button>
                                <button type="submit" className={styles.submitBtn}>Add Player</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
}
