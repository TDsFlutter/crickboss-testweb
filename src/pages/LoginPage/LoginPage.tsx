import { useState, useRef, useEffect } from 'react';
import type { KeyboardEvent, ClipboardEvent, ChangeEvent } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { isValidPhoneNumber } from 'react-phone-number-input';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import PhoneField from '../../components/PhoneField/PhoneField';
import styles from './LoginPage.module.css';

const STATIC_OTP = '123456';

function maskMobile(phone: string): string {
    if (!phone || phone.length < 5) return phone;
    const first4 = phone.slice(0, 4);
    const last2 = phone.slice(-2);
    const stars = '*'.repeat(Math.max(0, phone.length - 6));
    return `${first4}${stars}${last2}`;
}

export default function LoginPage() {
    const { isLoggedIn, login } = useAuth();
    const navigate = useNavigate();
    const { theme } = useTheme();

    const [step, setStep] = useState<1 | 2>(1);
    const [mobile, setMobile] = useState('');
    const [mobileError, setMobileError] = useState('');
    const [sending, setSending] = useState(false);

    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [otpError, setOtpError] = useState('');
    const [verifying, setVerifying] = useState(false);
    const [countdown, setCountdown] = useState(60);
    const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    if (isLoggedIn) return <Navigate to="/dashboard" replace />;

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

    const handleSendOtp = () => {
        if (!mobile || !isValidPhoneNumber(mobile)) {
            setMobileError('Please enter a valid mobile number.');
            return;
        }
        setSending(true);
        setTimeout(() => {
            setSending(false);
            setStep(2);
            setOtp(['', '', '', '', '', '']);
            setOtpError('');
            setTimeout(() => otpRefs.current[0]?.focus(), 100);
        }, 600);
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

    const handleVerify = () => {
        const entered = otp.join('');
        if (entered.length < 6) { setOtpError('Please enter the 6-digit OTP.'); return; }
        setVerifying(true);
        setTimeout(() => {
            setVerifying(false);
            if (entered === STATIC_OTP) {
                login(mobile);
                navigate('/dashboard', { replace: true });
            } else {
                setOtpError('Invalid OTP. Please try again.');
                setOtp(['', '', '', '', '', '']);
                setTimeout(() => otpRefs.current[0]?.focus(), 50);
            }
        }, 600);
    };

    const isMobileValid = mobile ? isValidPhoneNumber(mobile) : false;
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
                    <svg width="34" height="34" viewBox="0 0 32 32" fill="none" aria-hidden="true">
                        <circle cx="16" cy="16" r="16" fill="#1F3C88" />
                        <path d="M10 23 L16 9 L22 23" stroke="#3DBE8B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        <line x1="12" y1="19" x2="20" y2="19" stroke="#3DBE8B" strokeWidth="2.2" strokeLinecap="round" />
                    </svg>
                    <span className={styles.logoText}>Crick<strong>Boss</strong></span>
                </div>

                {/* ── STEP 1 ── */}
                {step === 1 && (
                    <div className={styles.stepPanel}>
                        <h1 className={styles.title}>Welcome Back 👋</h1>
                        <p className={styles.sub}>Enter your mobile number to continue</p>

                        <PhoneField
                            value={mobile}
                            onChange={(value) => {
                                setMobileError('');
                                setMobile(value || '');
                            }}
                            onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                                if (e.key === 'Enter' && isMobileValid) handleSendOtp();
                            }}
                            error={mobileError}
                            defaultCountry="IN"
                            id="login-mobile"
                        />

                        <button
                            className={`${styles.primaryBtn} ${sending ? styles.loading : ''}`}
                            disabled={!isMobileValid || sending}
                            onClick={handleSendOtp}
                        >
                            {sending ? <span className={styles.spinner} /> : 'Send OTP →'}
                        </button>

                        <p className={styles.hint}>We'll send a one-time password to verify your number.</p>

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
                            Code sent to <strong>{maskMobile(mobile)}</strong>
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

                        {otpError
                            ? <p className={styles.errorMsg}>{otpError}</p>
                            : <p className={styles.demoHint}>🔑 Demo OTP: <strong>123456</strong></p>
                        }

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
                                : <button className={styles.resendBtn} onClick={() => { setStep(1); setOtp(['', '', '', '', '', '']); setOtpError(''); }}>Resend OTP</button>
                            }
                        </div>

                        <button className={styles.changeBtn} onClick={() => { setStep(1); setOtpError(''); }}>
                            ← Change number
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
