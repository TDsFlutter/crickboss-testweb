import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import styles from './JoinAsPlayerTab.module.css';

export default function JoinAsPlayerTab() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [code, setCode] = useState('');
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const handleJoin = (e: React.FormEvent) => {
        e.preventDefault();
        if (!code.trim()) return;
        // Demo: accept any 6-char code
        if (code.trim().length === 6) {
            setStatus('success');
        } else {
            setStatus('error');
        }
    };

    const d = isDark ? styles.dark : '';

    return (
        <div className={`${styles.wrap} ${d}`}>


            {/* Card */}
            <div className={`${styles.card} ${d}`}>
                <h2 className={`${styles.cardTitle} ${d}`}>Enter Join Code</h2>
                <p className={styles.cardSub}>Get the code from your auction organizer</p>

                <form onSubmit={handleJoin} noValidate>
                    <div className={styles.codeWrap}>
                        <input
                            id="join-code"
                            className={`${styles.codeInput} ${d}`}
                            type="text"
                            placeholder="A84IGE"
                            maxLength={6}
                            value={code}
                            onChange={e => {
                                setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''));
                                setStatus('idle');
                            }}
                            autoComplete="off"
                            spellCheck={false}
                            aria-label="Auction join code"
                        />
                    </div>

                    <button
                        type="submit"
                        className={styles.joinBtn}
                        disabled={code.trim().length === 0}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4" />
                            <polyline points="10 17 15 12 10 7" />
                            <line x1="15" y1="12" x2="3" y2="12" />
                        </svg>
                        Join as Player
                    </button>

                    {status === 'success' && (
                        <div className={styles.successBanner}>
                            ✅ Joined successfully! Redirecting to auction…
                        </div>
                    )}
                    {status === 'error' && (
                        <div className={styles.errorBanner}>
                            ❌ Invalid code. Please enter a valid 6-character code.
                        </div>
                    )}
                </form>

                <div className={styles.divider}>
                    <div className={styles.dividerLine} />
                    <span className={styles.dividerText}>HOW IT WORKS</span>
                    <div className={styles.dividerLine} />
                </div>

                <ul className={styles.howList}>
                    {[
                        'Get the unique join code from your organizer.',
                        'Enter the 6-character code in the field above.',
                        'Click "Join as Player" to enter the auction room.',
                    ].map((step, i) => (
                        <li key={i} className={styles.howItem}>
                            <span className={styles.howNum}>{i + 1}</span>
                            {step}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
