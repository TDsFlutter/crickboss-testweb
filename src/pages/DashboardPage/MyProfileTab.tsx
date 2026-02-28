import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import styles from './MyProfileTab.module.css';

function EyeIcon({ open }: { open: boolean }) {
    return open ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
            <line x1="1" y1="1" x2="23" y2="23" />
        </svg>
    );
}

function getStrength(pw: string): { pct: number; label: string; color: string } {
    if (!pw) return { pct: 0, label: '', color: '#e8edf8' };
    if (pw.length < 6) return { pct: 25, label: 'Weak', color: '#ef4444' };
    if (pw.length < 10 || !/[A-Z]/.test(pw) || !/[0-9]/.test(pw)) return { pct: 60, label: 'Fair', color: '#f59e0b' };
    return { pct: 100, label: 'Strong', color: '#3DBE8B' };
}

export default function MyProfileTab() {
    const { mobile, displayName, email, updateProfile } = useAuth();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    // Profile form — pre-populate from AuthContext (which reads localStorage)
    const [formName, setFormName] = useState(displayName);
    const [formEmail, setFormEmail] = useState(email);
    const [profileToast, setProfileToast] = useState<'idle' | 'success'>('idle');
    const [emailError, setEmailError] = useState('');

    // Sync if context values change (e.g. after login)
    useEffect(() => {
        setFormName(displayName);
        setFormEmail(email);
        setEmailError('');
    }, [displayName, email]);

    // Password form
    const [newPw, setNewPw] = useState('');
    const [confirmPw, setConfirmPw] = useState('');
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [pwToast, setPwToast] = useState<'idle' | 'success' | 'error'>('idle');

    const strength = getStrength(newPw);

    // Avatar initials: from saved name (if available) or last-4 digits of mobile
    const avatarInitials = formName.trim()
        ? formName.trim().split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
        : mobile ? mobile.slice(-4, -2) || 'CB' : 'CB';

    const handleProfileSave = (e: React.FormEvent) => {
        e.preventDefault();
        // Validate email format
        if (formEmail.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formEmail.trim())) {
            setEmailError('Please enter a valid email address.');
            return;
        }
        setEmailError('');
        updateProfile(formName, formEmail);
        setProfileToast('success');
        setTimeout(() => setProfileToast('idle'), 3000);
    };

    const handlePwSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPw || !confirmPw) return;
        if (newPw !== confirmPw) {
            setPwToast('error');
            setTimeout(() => setPwToast('idle'), 3500);
            return;
        }
        setPwToast('success');
        setNewPw('');
        setConfirmPw('');
        setTimeout(() => setPwToast('idle'), 3000);
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
                        <div className={styles.bigAvatar}>{avatarInitials}</div>
                        <div className={styles.avatarInfo}>
                            <p>{formName || 'Your Name'}</p>
                            <button type="button" className={`${styles.changeAvatarBtn} ${d}`}>Change Photo</button>
                        </div>
                    </div>

                    <form onSubmit={handleProfileSave}>
                        <div className={styles.field}>
                            <label className={`${styles.label} ${d}`}>Display Name</label>
                            <input
                                className={`${styles.input} ${d}`}
                                type="text"
                                placeholder="e.g. Trunal Dungarani"
                                value={formName}
                                onChange={e => setFormName(e.target.value)}
                            />
                        </div>

                        <div className={styles.field}>
                            <label className={`${styles.label} ${d}`}>Mobile Number</label>
                            <input
                                className={`${styles.input} ${d}`}
                                type="text"
                                value={mobile || '—'}
                                readOnly
                                aria-label="Mobile number (read only)"
                            />
                        </div>

                        <div className={styles.field}>
                            <label className={`${styles.label} ${d}`}>Email Address</label>
                            <input
                                className={`${styles.input} ${d} ${emailError ? styles.inputError : ''}`}
                                type="email"
                                placeholder="e.g. trunal@example.com"
                                value={formEmail}
                                onChange={e => { setFormEmail(e.target.value); if (emailError) setEmailError(''); }}
                            />
                            {emailError && <div className={styles.fieldError}>{emailError}</div>}
                        </div>

                        <button type="submit" className={styles.saveBtn}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
                                <polyline points="17 21 17 13 7 13 7 21" />
                                <polyline points="7 3 7 8 15 8" />
                            </svg>
                            Save Profile
                        </button>

                        {profileToast === 'success' && (
                            <div className={`${styles.toast} ${styles.success}`}>✅ Profile updated successfully!</div>
                        )}
                    </form>
                </div>

                {/* ── Reset Password ── */}
                <div className={`${styles.card} ${d}`}>
                    <div className={styles.cardHeader}>
                        <div className={`${styles.cardIcon} ${styles.green}`}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                <path d="M7 11V7a5 5 0 0110 0v4" />
                            </svg>
                        </div>
                        <h2 className={`${styles.cardTitle} ${d}`}>Reset Password</h2>
                    </div>
                    <p className={styles.cardSub}>Update your account password</p>

                    <form onSubmit={handlePwSave}>
                        {/* New Password */}
                        <div className={styles.field}>
                            <label className={`${styles.label} ${d}`}>New Password</label>
                            <div className={styles.pwWrap}>
                                <input
                                    className={`${styles.input} ${d}`}
                                    type={showNew ? 'text' : 'password'}
                                    placeholder="Enter new password"
                                    value={newPw}
                                    onChange={e => setNewPw(e.target.value)}
                                    autoComplete="new-password"
                                />
                                <button
                                    type="button"
                                    className={styles.pwToggle}
                                    onClick={() => setShowNew(v => !v)}
                                    aria-label={showNew ? 'Hide password' : 'Show password'}
                                >
                                    <EyeIcon open={showNew} />
                                </button>
                            </div>
                            {newPw && (
                                <>
                                    <div className={styles.strengthBar}>
                                        <div
                                            className={styles.strengthFill}
                                            style={{ width: `${strength.pct}%`, background: strength.color }}
                                        />
                                    </div>
                                    <div className={styles.strengthText} style={{ color: strength.color }}>
                                        {strength.label}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div className={styles.field}>
                            <label className={`${styles.label} ${d}`}>Confirm Password</label>
                            <div className={styles.pwWrap}>
                                <input
                                    className={`${styles.input} ${d}`}
                                    type={showConfirm ? 'text' : 'password'}
                                    placeholder="Re-enter new password"
                                    value={confirmPw}
                                    onChange={e => setConfirmPw(e.target.value)}
                                    autoComplete="new-password"
                                />
                                <button
                                    type="button"
                                    className={styles.pwToggle}
                                    onClick={() => setShowConfirm(v => !v)}
                                    aria-label={showConfirm ? 'Hide confirm password' : 'Show confirm password'}
                                >
                                    <EyeIcon open={showConfirm} />
                                </button>
                            </div>
                            {confirmPw && newPw !== confirmPw && (
                                <div className={styles.fieldError}>Passwords do not match</div>
                            )}
                        </div>

                        <button type="submit" className={`${styles.saveBtn} ${styles.green}`}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                <path d="M7 11V7a5 5 0 0110 0v4" />
                            </svg>
                            Update Password
                        </button>

                        {pwToast === 'success' && (
                            <div className={`${styles.toast} ${styles.success}`}>✅ Password updated successfully!</div>
                        )}
                        {pwToast === 'error' && (
                            <div className={`${styles.toast} ${styles.error}`}>❌ Passwords don't match. Please try again.</div>
                        )}
                    </form>
                </div>

            </div>
        </div>
    );
}
