import { useState, useRef, useEffect } from 'react';
import type { FormEvent, KeyboardEvent, ClipboardEvent, ChangeEvent } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import logoImg from '../../assets/crickboss_trans.png';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import FormField from '../../components/FormField/FormField';
import styles from './RegisterPage.module.css';
import { api } from '../../utils/api';

function maskEmail(email: string): string {
    const [user, domain] = email.split('@');
    if (!user || !domain) return email;
    const visible = user[0] ?? '';
    const masked = visible + '*'.repeat(Math.max(0, user.length - 1));
    return `${masked}@${domain}`;
}

export default function RegisterPage() {
    const { isLoggedIn, login, refreshUser } = useAuth();
    const navigate = useNavigate();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    // Load persisted state on mount
    const [step, setStep] = useState<1 | 2 | 3 | 4>(() => {
        const saved = sessionStorage.getItem('register_step');
        return (saved ? parseInt(saved, 10) : 1) as 1 | 2 | 3 | 4;
    });

    // ── Step 1: registration form fields ──
    const [name, setName] = useState(() => sessionStorage.getItem('register_name') || '');
    const [email, setEmail] = useState(() => sessionStorage.getItem('register_email') || '');
    const [mobile, setMobile] = useState(() => sessionStorage.getItem('register_mobile') || '');
    const [countryCode, setCountryCode] = useState(() => sessionStorage.getItem('register_countryCode') || '+91');
    const [city, setCity] = useState(() => sessionStorage.getItem('register_city') || '');
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [registering, setRegistering] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // ── Step 2: OTP verification ──
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [otpError, setOtpError] = useState('');
    const [verifying, setVerifying] = useState(false);
    const [resending, setResending] = useState(false);
    const [resendMsg, setResendMsg] = useState('');
    const [countdown, setCountdown] = useState(60);
    const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // ── Step 3: Profile Image ──
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);

    // Persist state changes
    useEffect(() => { sessionStorage.setItem('register_step', step.toString()); }, [step]);
    useEffect(() => { sessionStorage.setItem('register_name', name); }, [name]);
    useEffect(() => { sessionStorage.setItem('register_email', email); }, [email]);
    useEffect(() => { sessionStorage.setItem('register_mobile', mobile); }, [mobile]);
    useEffect(() => { sessionStorage.setItem('register_countryCode', countryCode); }, [countryCode]);
    useEffect(() => { sessionStorage.setItem('register_city', city); }, [city]);

    // Check if user is already logged in ONLY if they land here fresh (Step 1 with no data)
    useEffect(() => {
        if (isLoggedIn && step === 1 && !name && !email) {
            navigate('/dashboard', { replace: true });
        }
    }, [isLoggedIn, navigate, step, name, email]);

    // Clear registration data on success (Step 4 -> Dashboard) or manual link
    const clearRegistrationState = () => {
        sessionStorage.removeItem('register_step');
        sessionStorage.removeItem('register_name');
        sessionStorage.removeItem('register_email');
        sessionStorage.removeItem('register_mobile');
        sessionStorage.removeItem('register_countryCode');
        sessionStorage.removeItem('register_city');
    };

    const getCountryISO = (code: string): string => {
        const mapping: { [key: string]: string } = {
            '+91': 'IN',
            '+1': 'US',
            '+44': 'GB',
            '+61': 'AU',
            '+92': 'PK',
            '+880': 'BD',
            '+971': 'AE',
            '+94': 'LK',
            '+27': 'ZA',
            '+64': 'NZ'
        };
        return mapping[code] || 'IN';
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const tempUrl = URL.createObjectURL(file);
            setImagePreview(tempUrl);
        }
    };

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};
        if (!name.trim()) newErrors.name = 'Full name is required.';
        if (!email.trim()) {
            newErrors.email = 'Email address is required.';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
            newErrors.email = 'Please enter a valid email address.';
        }
        if (!city.trim()) newErrors.city = 'City is required.';
        if (!mobile.trim()) {
            newErrors.mobile = 'Mobile number is required.';
        } else if (!/^\d/.test(mobile.trim())) {
            newErrors.mobile = 'Please enter a valid mobile number.';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const clearError = (field: string) => {
        if (errors[field]) setErrors(prev => { const e = { ...prev }; delete e[field]; return e; });
    };

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

    const handleRegister = async (e: FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;
        setRegistering(true);
        try {
            const res = await api.register({
                name: name.trim(),
                email: email.trim().toLowerCase(),
                mobile: mobile.trim(),
                country_code: getCountryISO(countryCode),
                city: city.trim(),
            });
            if (res.success) {
                setStep(2);
                setOtp(['', '', '', '', '', '']);
                setOtpError('');
                setResendMsg('');
                startOtpTimer();
                setTimeout(() => otpRefs.current[0]?.focus(), 100);
            } else {
                setErrors({ email: res.message || 'Registration failed. Please try again.' });
            }
        } catch {
            setErrors({ email: 'Connection error. Please check your internet.' });
        } finally {
            setRegistering(false);
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
            const res = await api.verifyOtp(email.trim().toLowerCase(), entered);
            const userPayload = res.data || res.user;
            if (res.success && res.token) {
                // Log in first so Step 3 can use the token for image upload
                login(
                    {
                        email: userPayload?.email || email,
                        name: userPayload?.name || name,
                        id: userPayload?.id || userPayload?._id,
                        city: userPayload?.city || city,
                    },
                    {
                        access: res.token,
                        refresh: res.refresh_token || '',
                    }
                );
                setStep(3);
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

    const handleUploadAvatar = async () => {
        if (!selectedFile) {
            setStep(4);
            return;
        }
        setUploading(true);
        try {
            const res = await api.uploadAvatar(selectedFile);
            if (res.success && res.data) {
                // Link the uploaded image URL to the user profile
                await api.updateMe({ avatar: res.data });
                await refreshUser(); // Sync the context state
                setStep(4);
            } else {
                // On failure, we can still move to success but show a message or just move on
                setStep(4);
            }
        } catch {
            setStep(4);
        } finally {
            setUploading(false);
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

    const isOtpFilled = otp.every(d => d !== '');

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

                {/* ── STEP 1: Registration Form ── */}
                {step === 1 && (
                    <div className={styles.formPanel}>
                        <h1 className={styles.title}>Create Account ✨</h1>
                        <p className={styles.sub}>Join CrickBoss to manage your tournaments</p>

                        <form onSubmit={handleRegister} className={styles.form} noValidate>
                            {/* Full Name */}
                            <FormField
                                label="Full Name"
                                id="reg-name"
                                type="text"
                                placeholder="e.g. MS Dhoni"
                                value={name}
                                onChange={e => { setName(e.target.value); clearError('name'); }}
                                error={errors.name}
                                required
                            />

                            {/* Email */}
                            <FormField
                                label="Email Address"
                                id="reg-email"
                                type="email"
                                placeholder="dhoni@example.com"
                                value={email}
                                onChange={e => { setEmail(e.target.value); clearError('email'); }}
                                error={errors.email}
                                required
                            />

                            {/* Mobile Number & Country Code */}
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <div style={{ width: '90px' }}>
                                    <FormField
                                        label="Code"
                                        id="reg-code"
                                        type="text"
                                        value={countryCode}
                                        onChange={e => setCountryCode(e.target.value)}
                                        placeholder="+91"
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <FormField
                                        label="Mobile Number"
                                        id="reg-mobile"
                                        type="tel"
                                        placeholder="9876543210"
                                        value={mobile}
                                        onChange={e => { setMobile(e.target.value); clearError('mobile'); }}
                                        error={errors.mobile}
                                        required
                                    />
                                </div>
                            </div>

                            {/* City */}
                            <FormField
                                label="City"
                                id="reg-city"
                                type="text"
                                placeholder="e.g. Ranchi"
                                value={city}
                                onChange={e => { setCity(e.target.value); clearError('city'); }}
                                error={errors.city}
                                required
                            />

                            <button
                                type="submit"
                                className={`${styles.primaryBtn} ${registering ? styles.loading : ''}`}
                                disabled={registering}
                            >
                                {registering ? <span className={styles.spinner} /> : 'Continue →'}
                            </button>
                        </form>

                        <div className={styles.loginLink}>
                            Already have an account? <Link to="/login">Login here</Link>
                        </div>
                    </div>
                )}

                {/* ── STEP 2: Email OTP Verification ── */}
                {step === 2 && (
                    <div className={styles.formPanel}>
                        <h1 className={styles.title}>Verify Email ✉️</h1>
                        <p className={styles.sub}>
                            OTP sent to <strong>{maskEmail(email)}</strong>
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

                        <button className={styles.changeBtn} onClick={() => { setStep(1); setOtpError(''); setResendMsg(''); if (timerRef.current) clearInterval(timerRef.current); }}>
                            ← Change email
                        </button>
                    </div>
                )}

                {/* ── STEP 3: Profile Image Upload ── */}
                {step === 3 && (
                    <div className={styles.formPanel}>
                        <h1 className={styles.title}>Add Photo 📸</h1>
                        <p className={styles.sub}>Show the world your CrickBoss avatar!</p>

                        <div className={styles.form}>
                            <div className={styles.imageUploadGroup}>
                                <div
                                    className={styles.imagePreviewCircle}
                                    style={{ width: '120px', height: '120px' }}
                                    onClick={() => fileInputRef.current?.click()}
                                    role="button"
                                    tabIndex={0}
                                    aria-label="Upload profile image"
                                    onKeyDown={e => e.key === 'Enter' && fileInputRef.current?.click()}
                                >
                                    {imagePreview ? (
                                        <img src={imagePreview} alt="Profile preview" className={styles.previewImg} />
                                    ) : (
                                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                                            <circle cx="12" cy="13" r="4"></circle>
                                        </svg>
                                    )}
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    ref={fileInputRef}
                                    onChange={handleImageChange}
                                    className={styles.hiddenInput}
                                />
                                <span className={styles.imageLabel}>{selectedFile ? selectedFile.name : 'Tap to select image'}</span>
                            </div>

                            <button
                                className={`${styles.primaryBtn} ${uploading ? styles.loading : ''}`}
                                onClick={handleUploadAvatar}
                                disabled={uploading || !selectedFile}
                            >
                                {uploading ? <span className={styles.spinner} /> : 'Upload & Continue'}
                            </button>

                            <button className={styles.skipBtn} onClick={() => setStep(4)} disabled={uploading}>
                                Skip for now
                            </button>
                        </div>
                    </div>
                )}

                {/* ── STEP 4: Success Screen ── */}
                {step === 4 && (
                    <div className={styles.formPanel} style={{ textAlign: 'center' }}>
                        <div className={styles.successIcon}>
                            {imagePreview ? (
                                <img src={imagePreview} alt="Profile" className={styles.previewImg} style={{ borderRadius: '50%', width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                            )}
                        </div>
                        <h1 className={styles.title}>All Set! 🎉</h1>
                        <p className={styles.sub}>
                            Registration complete. Welcome to <strong>CrickBoss</strong>.
                        </p>

                        <button
                            className={styles.primaryBtn}
                            onClick={() => {
                                clearRegistrationState();
                                navigate('/dashboard', { replace: true });
                            }}
                        >
                            Go to Dashboard →
                        </button>
                    </div>
                )}

                {/* Progress dots */}
                <div className={styles.dots}>
                    <span className={`${styles.dot} ${step === 1 ? styles.dotActive : styles.dotDone}`} />
                    <span className={`${styles.dot} ${step === 2 ? (step === 2 ? styles.dotActive : styles.dotDone) : (step > 2 ? styles.dotDone : '')}`} />
                    <span className={`${styles.dot} ${step === 3 ? (step === 3 ? styles.dotActive : styles.dotDone) : (step > 3 ? styles.dotDone : '')}`} />
                    <span className={`${styles.dot} ${step === 4 ? styles.dotActive : ''}`} />
                </div>
            </div>

            <p className={styles.footer}>
                © {new Date().getFullYear()} CrickBoss. All rights reserved.
            </p>
        </div>
    );
}
