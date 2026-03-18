// src/pages/DashboardPage/TournamentsTab.tsx
import { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { api } from '../../utils/api';
import styles from './TournamentsTab.module.css';

interface Props {
  onManageClick: (id: number) => void;
}

interface Tournament {
  id: number;
  name: string;
  status?: string;
  description?: string;
  sport?: string;
}

export default function TournamentsTab({ onManageClick }: Props) {
  const [query, setQuery] = useState('');
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    setLoading(true);
    try {
      const res = await api.tournaments.list();
      // Handle the case where backend returns array directly or inside data
      if (res.success && Array.isArray(res.data)) {
        setTournaments(res.data);
      } else if (Array.isArray(res)) {
        setTournaments(res as any);
      } else {
        // Just in case
        setTournaments([]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    try {
      const res = await api.tournaments.create({ name: newName, description: newDesc, status: 'upcoming', sport: 'cricket' });
      setShowCreate(false);
      setNewName('');
      setNewDesc('');
      fetchTournaments();
    } catch (err) {
      console.error(err);
      alert('Error creating tournament');
    }
  };

  const filtered = tournaments.filter(t => t.name?.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className={`${styles.wrap} ${isDark ? styles.dark : ''}`}>
      {/* Create Modal */}
      {showCreate && (
        <div className={styles.modalOverlay}>
           <div className={styles.modalContent}>
             <h3>Create Tournament</h3>
             <form onSubmit={handleCreate}>
               <div className={styles.formGroup}>
                 <label>Tournament Name</label>
                 <input value={newName} onChange={e => setNewName(e.target.value)} required placeholder="e.g. Summer Cup 2026" />
               </div>
               <div className={styles.formGroup}>
                 <label>Description</label>
                 <textarea value={newDesc} onChange={e => setNewDesc(e.target.value)} placeholder="Short description..." />
               </div>
               <div className={styles.modalActions}>
                 <button type="button" onClick={() => setShowCreate(false)} className={styles.cancelBtn}>Cancel</button>
                 <button type="submit" className={styles.submitBtn}>Create</button>
               </div>
             </form>
           </div>
        </div>
      )}

      {/* Top row */}
      <div className={styles.topRow}>
        <label className={styles.searchBar}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input className={styles.searchInput} type="text" placeholder="Search tournaments..." value={query} onChange={e => setQuery(e.target.value)} />
        </label>
        <button className={styles.createBtn} onClick={() => setShowCreate(true)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Tournament
        </button>
      </div>

      <div className={styles.sectionLabel}>Your Tournaments</div>

      {loading ? (
        <div className={styles.empty}>Loading tournaments...</div>
      ) : filtered.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>🏆</div>
          <div className={styles.emptyText}>No tournaments found</div>
          <button className={`${styles.createFirstBtn}`} onClick={() => setShowCreate(true)}>Create Your First Tournament</button>
        </div>
      ) : (
        <div className={styles.grid}>
          {filtered.map(t => (
            <div className={styles.card} key={t.id} onClick={() => onManageClick(t.id)}>
              <div className={styles.cardBanner}>
                <span className={styles.bannerEmoji}>🏆</span>
                <span className={`${styles.statusBadge} ${t.status === 'live' ? styles.live : styles.upcoming}`}>
                   {t.status || 'upcoming'}
                </span>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.cardName}>{t.name}</div>
                <div className={styles.cardDesc}>{t.description || 'Cricket Tournament'}</div>
                <div className={styles.cardActions}>
                  <button className={`${styles.actBtn} ${styles.primary}`} onClick={(e) => { e.stopPropagation(); onManageClick(t.id); }}>Manage</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
