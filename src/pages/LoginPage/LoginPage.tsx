import { useState, useRef, useEffect } from 'react';
import type { KeyboardEvent, ClipboardEvent, ChangeEvent } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import logoImg from '../../assets/crickboss_trans.png';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import styles from './LoginPage.module.css';
import { api } from '../../utils/api';

function isValidEmail(val: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
}

function maskEmail(email: string): string {
    const [user, domain] = email.split('@');
    if (!user || !domain) return email;
    const visible = user[0] ?? '';
    const masked = visible + '*'.repeat(Math.max(0, user.length - 1));
    return `${masked}@${domain}`;
}

export default function LoginPage() {
    const { isLoggedIn, login } = useAuth();
    const navigate = useNavigate();
    const { theme } = useTheme();

    const [step, setStep] = useState<1 | 2>(1);
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [sending, setSending] = useState(false);

    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [otpError, setOtpError] = useState('');
    const [verifying, setVerifying] = useState(false);
    const [resending, setResending] = useState(false);
    const [resendMsg, setResendMsg] = useState('');
    const [countdown, setCountdown] = useState(60);
    const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        if (isLoggedIn) navigate('/dashboard', { replace: true });
    }, [isLoggedIn, navigate]);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        if (step === 2) {
            setCountdown(60);
            timerRef.current = setInterval(() => {
                setCountdown(prev => {
                    if (prev <= 1) { clearInterval(timerRef.current!); return 0; }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, [step]);

    const startOtpTimer = () => {
        setCountdown(60);
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) { clearInterval(timerRef.current!); return 0; }
                return prev - 1;
            });
        }, 1000);
    };

    const handleSendOtp = async () => {
        if (!isValidEmail(email)) {
            setEmailError('Please enter a valid email address.');
            return;
        }
        setSending(true);
        try {
            const res = await api.login(email.trim().toLowerCase());
            if (res.success) {
                setStep(2);
                setOtp(['', '', '', '', '', '']);
                setOtpError('');
                setResendMsg('');
                setTimeout(() => otpRefs.current[0]?.focus(), 100);
            } else {
                // Show helpful message if user not found
                const msg = res.message || 'Failed to send OTP. Please try again.';
                setEmailError(msg);
            }
        } catch {
            setEmailError('Connection error. Please check your internet.');
        } finally {
            setSending(false);
        }
    };

    const handleOtpChange = (i: number, e: ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.replace(/\D/g, '').slice(-1);
        const next = [...otp];
        next[i] = val;
        setOtp(next);
        setOtpError('');
        if (val && i < 5) otpRefs.current[i + 1]?.focus();
    };

    const handleOtpKeyDown = (i: number, e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otp[i] && i > 0) {
            otpRefs.current[i - 1]?.focus();
        }
    };

    const handleOtpPaste = (e: ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        if (!pasted) return;
        const next = [...otp];
        pasted.split('').forEach((ch, idx) => { if (idx < 6) next[idx] = ch; });
        setOtp(next);
        const focusIdx = Math.min(pasted.length, 5);
        otpRefs.current[focusIdx]?.focus();
    };

    const handleVerify = async () => {
        const entered = otp.join('');
        if (entered.length < 6) { setOtpError('Please enter the 6-digit OTP.'); return; }
        setVerifying(true);
        try {
            const res = await api.verifyLoginOtp(email.trim().toLowerCase(), entered);
            // Accept success if we have a token (refresh_token is optional)
            const userPayload = res.data || res.user;
            if (res.success && res.token) {
                login(
                    {
                        email: userPayload?.email || email,
                        name: userPayload?.name,
                        id: userPayload?.id || userPayload?._id,
                        city: userPayload?.city,
                    },
                    {
                        access: res.token,
                        refresh: res.refresh_token || '',
                    }
                );
                navigate('/dashboard', { replace: true });
            } else {
                setOtpError(res.message || 'Invalid OTP. Please try again.');
                setOtp(['', '', '', '', '', '']);
                setTimeout(() => otpRefs.current[0]?.focus(), 50);
            }
        } catch {
            setOtpError('Connection error. Please try again.');
        } finally {
            setVerifying(false);
        }
    };

    const handleResend = async () => {
        setResending(true);
        setResendMsg('');
        setOtpError('');
        try {
            const res = await api.resendOtp(email.trim().toLowerCase());
            if (res.success) {
                setOtp(['', '', '', '', '', '']);
                startOtpTimer();
                setResendMsg('✅ A new OTP has been sent to your email.');
                setTimeout(() => otpRefs.current[0]?.focus(), 100);
            } else {
                setResendMsg(res.message || 'Failed to resend OTP. Please try again.');
            }
        } catch {
            setResendMsg('Connection error. Please try again.');
        } finally {
            setResending(false);
        }
    };

    const isEmailValid = isValidEmail(email);
    const isOtpFilled = otp.every(d => d !== '');
    const isDark = theme === 'dark';

    return (
        <div className={`${styles.page} ${isDark ? styles.dark : ''}`}>
            <div className={styles.bg}>
                <div className={styles.blob1} />
                <div className={styles.blob2} />
            </div>

            <div className={styles.card}>
                {/* Logo */}
                <div className={styles.logoRow}>
                    <img src={logoImg} alt="CrickBoss Logo" style={{ height: '48px', width: 'auto' }} />
                </div>

                {/* ── STEP 1 ── */}
                {step === 1 && (
                    <div className={styles.stepPanel}>
                        <h1 className={styles.title}>Welcome Back 👋</h1>
                        <p className={styles.sub}>Enter your email address to continue</p>

                        <div className={styles.emailField}>
                            <div className={`${styles.emailInputWrap} ${emailError ? styles.inputError : ''}`}>
                                <svg className={styles.emailIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                    <polyline points="22,6 12,13 2,6" />
                                </svg>
                                <input
                                    className={styles.emailInput}
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    id="login-email"
                                    autoComplete="email"
                                    onChange={e => { setEmailError(''); setEmail(e.target.value); }}
                                    onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                                        if (e.key === 'Enter' && isEmailValid) handleSendOtp();
                                    }}
                                />
                            </div>
                            {emailError && (
                                <p className={styles.errorMsg}>
                                    {emailError}
                                    {emailError.toLowerCase().includes('not found') || emailError.toLowerCase().includes('no account') ? (
                                        <> &mdash; <Link to="/register">Create one here</Link></>
                                    ) : null}
                                </p>
                            )}
                        </div>

                        <button
                            className={`${styles.primaryBtn} ${sending ? styles.loading : ''}`}
                            disabled={!isEmailValid || sending}
                            onClick={handleSendOtp}
                        >
                            {sending ? <span className={styles.spinner} /> : 'Send OTP →'}
                        </button>

                        <p className={styles.hint}>We'll send a one-time password to verify your email.</p>

                        <div className={styles.registerLink}>
                            Don't have an account? <Link to="/register">Register here</Link>
                        </div>
                    </div>
                )}

                {/* ── STEP 2 ── */}
                {step === 2 && (
                    <div className={styles.stepPanel}>
                        <h1 className={styles.title}>Verify OTP</h1>
                        <p className={styles.sub}>
                            Code sent to <strong>{maskEmail(email)}</strong>
                        </p>

                        <div className={styles.otpRow}>
                            {otp.map((digit, i) => (
                                <input
                                    key={i}
                                    ref={el => { otpRefs.current[i] = el; }}
                                    className={`${styles.otpBox} ${otpError ? styles.otpBoxError : digit ? styles.otpBoxFilled : ''}`}
                                    type="tel"
                                    maxLength={1}
                                    value={digit}
                                    onChange={e => handleOtpChange(i, e)}
                                    onKeyDown={e => handleOtpKeyDown(i, e)}
                                    onPaste={handleOtpPaste}
                                    aria-label={`OTP digit ${i + 1}`}
                                    inputMode="numeric"
                                    autoComplete="one-time-code"
                                />
                            ))}
                        </div>

                        {otpError && <p className={styles.errorMsg}>{otpError}</p>}
                        {resendMsg && <p className={styles.resendMsg}>{resendMsg}</p>}

                        <button
                            className={`${styles.primaryBtn} ${verifying ? styles.loading : ''}`}
                            disabled={!isOtpFilled || verifying}
                            onClick={handleVerify}
                        >
                            {verifying ? <span className={styles.spinner} /> : 'Verify & Continue →'}
                        </button>

                        <div className={styles.timerRow}>
                            {countdown > 0
                                ? <span className={styles.timer}>Resend OTP in <strong>{countdown}s</strong></span>
                                : (
                                    <button
                                        className={styles.resendBtn}
                                        onClick={handleResend}
                                        disabled={resending}
                                    >
                                        {resending ? 'Sending…' : 'Resend OTP'}
                                    </button>
                                )
                            }
                        </div>

                        <button className={styles.changeBtn} onClick={() => { setStep(1); setOtpError(''); setResendMsg(''); }}>
                            ← Change email
                        </button>
                    </div>
                )}

                {/* Progress dots */}
                <div className={styles.dots}>
                    <span className={`${styles.dot} ${step === 1 ? styles.dotActive : styles.dotDone}`} />
                    <span className={`${styles.dot} ${step === 2 ? styles.dotActive : ''}`} />
                </div>
            </div>

            <p className={styles.footer}>
                © {new Date().getFullYear()} CrickBoss. All rights reserved.
            </p>
        </div>
    );
}
