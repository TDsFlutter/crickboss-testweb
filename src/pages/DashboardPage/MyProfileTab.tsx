import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import styles from './MyProfileTab.module.css';
import { api } from '../../utils/api';

export default function MyProfileTab() {
    const { email, displayName, city, avatar, updateProfile, refreshUser } = useAuth();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    // Profile form — pre-populate from AuthContext
    const [formName, setFormName] = useState(displayName);
    const [formCity, setFormCity] = useState(city);
    const [saving, setSaving] = useState(false);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const [profileToast, setProfileToast] = useState<'idle' | 'success' | 'error'>('idle');
    const [profileToastMsg, setProfileToastMsg] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Sync if context values change (e.g. after login / page refresh)
    useEffect(() => {
        setFormName(displayName);
    }, [displayName]);

    useEffect(() => {
        setFormCity(city);
    }, [city]);

    // Avatar initials: from name or first 2 chars of email
    const avatarInitials = formName.trim()
        ? formName.trim().split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
        : email ? email.slice(0, 2).toUpperCase() : 'CB';

    const handleProfileSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formName.trim()) return;
        setSaving(true);
        setProfileToast('idle');

        const result = await updateProfile(formName.trim(), formCity.trim());

        if (result.success) {
            setProfileToast('success');
            setProfileToastMsg('✅ Profile updated successfully!');
        } else {
            setProfileToast('error');
            setProfileToastMsg(`❌ ${result.message || 'Failed to update profile.'}`);
        }
        setSaving(false);
        setTimeout(() => setProfileToast('idle'), 3500);
    };

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingAvatar(true);
        setProfileToast('idle');
        try {
            const res = await api.uploadAvatar(file);
            if (res.success && res.data) {
                const updateRes = await updateProfile(displayName, city, res.data);
                if (updateRes.success) {
                    setProfileToast('success');
                    setProfileToastMsg('✅ Profile photo updated!');
                } else {
                    setProfileToast('error');
                    setProfileToastMsg('❌ Failed to link photo to profile.');
                }
            } else {
                setProfileToast('error');
                setProfileToastMsg('❌ Failed to upload photo.');
            }
        } catch {
            setProfileToast('error');
            setProfileToastMsg('❌ Connection error during upload.');
        } finally {
            setUploadingAvatar(false);
            setTimeout(() => setProfileToast('idle'), 3500);
        }
    };

    const d = isDark ? styles.dark : '';

    return (
        <div className={`${styles.wrap} ${d}`}>
            <div className={styles.grid}>

                {/* ── Update Profile ── */}
                <div className={`${styles.card} ${d}`}>
                    <div className={styles.cardHeader}>
                        <div className={`${styles.cardIcon} ${styles.blue}`}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                            </svg>
                        </div>
                        <h2 className={`${styles.cardTitle} ${d}`}>Update Profile</h2>
                    </div>
                    <p className={styles.cardSub}>Edit your personal information</p>

                    {/* Avatar */}
                    <div className={`${styles.avatarRow} ${d}`}>
                        <div
                            className={`${styles.bigAvatar} ${uploadingAvatar ? styles.loading : ''}`}
                            onClick={handleAvatarClick}
                            style={{ cursor: 'pointer', position: 'relative', overflow: 'hidden' }}
                        >
                            {avatar ? (
                                <img
                                    src={avatar}
                                    alt="Avatar"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            ) : avatarInitials}
                            {uploadingAvatar && <div className={styles.avatarOverlay}><span className={styles.spinner} /></div>}
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            onChange={handleAvatarChange}
                        />
                        <div className={styles.avatarInfo}>
                            <p>{formName || 'Your Name'}</p>
                            <button
                                type="button"
                                className={styles.changeAvatarBtn}
                                onClick={handleAvatarClick}
                                disabled={uploadingAvatar}
                            >
                                {uploadingAvatar ? 'Uploading...' : 'Change Photo'}
                            </button>
                        </div>
                    </div>

                    <form onSubmit={handleProfileSave}>
                        {/* Display Name */}
                        <div className={styles.field}>
                            <label className={`${styles.label} ${d}`}>Display Name <span style={{ color: '#ef4444' }}>*</span></label>
                            <input
                                className={`${styles.input} ${d}`}
                                type="text"
                                placeholder="e.g. Trunal Dungarani"
                                value={formName}
                                onChange={e => setFormName(e.target.value)}
                                required
                            />
                        </div>

                        {/* City */}
                        <div className={styles.field}>
                            <label className={`${styles.label} ${d}`}>City</label>
                            <input
                                className={`${styles.input} ${d}`}
                                type="text"
                                placeholder="e.g. Mumbai"
                                value={formCity}
                                onChange={e => setFormCity(e.target.value)}
                            />
                        </div>

                        {/* Email (read-only) */}
                        <div className={styles.field}>
                            <label className={`${styles.label} ${d}`}>Email Address</label>
                            <input
                                className={`${styles.input} ${d}`}
                                type="email"
                                value={email || '—'}
                                readOnly
                                aria-label="Email address (read only — login identifier)"
                                style={{ opacity: 0.6, cursor: 'not-allowed' }}
                            />
                        </div>

                        <button
                            type="submit"
                            className={styles.saveBtn}
                            disabled={saving || !formName.trim()}
                        >
                            {saving ? (
                                <span className={styles.spinner} />
                            ) : (
                                <>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
                                        <polyline points="17 21 17 13 7 13 7 21" />
                                        <polyline points="7 3 7 8 15 8" />
                                    </svg>
                                    Save Profile
                                </>
                            )}
                        </button>

                        {profileToast !== 'idle' && (
                            <div className={`${styles.toast} ${profileToast === 'success' ? styles.success : styles.error}`}>
                                {profileToastMsg}
                            </div>
                        )}
                    </form>
                </div>

                {/* ── Account Info Card ── */}
                <div className={`${styles.card} ${d}`}>
                    <div className={styles.cardHeader}>
                        <div className={`${styles.cardIcon} ${styles.green}`}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="8" x2="12" y2="12" />
                                <line x1="12" y1="16" x2="12.01" y2="16" />
                            </svg>
                        </div>
                        <h2 className={`${styles.cardTitle} ${d}`}>Account Info</h2>
                    </div>
                    <p className={styles.cardSub}>Your account details managed by CrickBoss</p>

                    <div className={styles.infoList}>
                        <div className={`${styles.infoRow} ${d}`}>
                            <span className={styles.infoLabel}>Login Method</span>
                            <span className={styles.infoBadge}>📧 Email OTP</span>
                        </div>
                        <div className={`${styles.infoRow} ${d}`}>
                            <span className={styles.infoLabel}>Email</span>
                            <span className={styles.infoValue}>{email || '—'}</span>
                        </div>
                        <div className={`${styles.infoRow} ${d}`}>
                            <span className={styles.infoLabel}>City</span>
                            <span className={styles.infoValue}>{city || '—'}</span>
                        </div>
                        <div className={`${styles.infoRow} ${d}`}>
                            <span className={styles.infoLabel}>Name</span>
                            <span className={styles.infoValue}>{displayName || '—'}</span>
                        </div>
                    </div>

                    <p className={styles.infoNote}>
                        Your account uses secure <strong>Email OTP</strong> authentication — no password needed.
                    </p>
                </div>

            </div>
        </div>
    );
}
