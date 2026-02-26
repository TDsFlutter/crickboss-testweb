import { useState, useRef } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import styles from './RegisterPage.module.css';

export default function RegisterPage() {
    const { isLoggedIn, login } = useAuth();
    const navigate = useNavigate();
    const { theme } = useTheme();

    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');
    const [city, setCity] = useState('');

    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [registering, setRegistering] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    // Redirect if already logged in
    if (isLoggedIn) return <Navigate to="/dashboard" replace />;

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const tempUrl = URL.createObjectURL(file);
            setImagePreview(tempUrl);
        }
    };

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (!name.trim()) newErrors.name = 'Full name is required.';
        if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = 'Please enter a valid email address.';
        }
        if (!mobile || !isValidPhoneNumber(mobile)) {
            newErrors.mobile = 'Please enter a valid mobile number.';
        }
        if (!city.trim()) newErrors.city = 'City is required.';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleRegister = (e: FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setRegistering(true);
        // Simulate registration delay
        setTimeout(() => {
            setRegistering(false);
            // Simulate auto-login on successful registration
            login(mobile);
            navigate('/dashboard', { replace: true });
        }, 800);
    };

    return (
        <div className={`${styles.page} ${theme === 'dark' ? styles.dark : ''}`}>
            {/* BG decoration */}
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

                <div className={styles.formPanel}>
                    <h1 className={styles.title}>Create Account ✨</h1>
                    <p className={styles.sub}>Join CrickBoss to manage your tournaments</p>

                    <form onSubmit={handleRegister} className={styles.form}>
                        {/* Image Upload */}
                        <div className={styles.imageUploadGroup}>
                            <div
                                className={styles.imagePreviewCircle}
                                onClick={() => fileInputRef.current?.click()}
                                role="button"
                                tabIndex={0}
                                aria-label="Upload profile image"
                            >
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Profile preview" className={styles.previewImg} />
                                ) : (
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                            <span className={styles.imageLabel}>Add Profile Photo</span>
                        </div>

                        {/* Full Name */}
                        <div className={styles.inputGroup}>
                            <label htmlFor="name">Full Name</label>
                            <input
                                id="name"
                                className={`${styles.textInput} ${errors.name ? styles.inputError : ''}`}
                                type="text"
                                placeholder="e.g. MS Dhoni"
                                value={name}
                                onChange={e => { setName(e.target.value); if (errors.name) setErrors({ ...errors, name: '' }); }}
                            />
                            {errors.name && <span className={styles.errorMsg}>{errors.name}</span>}
                        </div>

                        {/* Email */}
                        <div className={styles.inputGroup}>
                            <label htmlFor="email">Email Address</label>
                            <input
                                id="email"
                                className={`${styles.textInput} ${errors.email ? styles.inputError : ''}`}
                                type="email"
                                placeholder="dhoni@example.com"
                                value={email}
                                onChange={e => { setEmail(e.target.value); if (errors.email) setErrors({ ...errors, email: '' }); }}
                            />
                            {errors.email && <span className={styles.errorMsg}>{errors.email}</span>}
                        </div>

                        {/* Mobile Number */}
                        <div className={styles.inputGroup}>
                            <label htmlFor="mobile">Mobile Number</label>
                            <PhoneInput
                                id="mobile"
                                international
                                defaultCountry="IN"
                                value={mobile}
                                onChange={(value: string | undefined) => {
                                    setMobile(value || '');
                                    if (errors.mobile) setErrors({ ...errors, mobile: '' });
                                }}
                                className={`${styles.phoneInputContainer} ${errors.mobile ? styles.inputError : ''}`}
                            />
                            {errors.mobile && <span className={styles.errorMsg}>{errors.mobile}</span>}
                        </div>

                        {/* City */}
                        <div className={styles.inputGroup}>
                            <label htmlFor="city">City</label>
                            <input
                                id="city"
                                className={`${styles.textInput} ${errors.city ? styles.inputError : ''}`}
                                type="text"
                                placeholder="e.g. Ranchi"
                                value={city}
                                onChange={e => { setCity(e.target.value); if (errors.city) setErrors({ ...errors, city: '' }); }}
                            />
                            {errors.city && <span className={styles.errorMsg}>{errors.city}</span>}
                        </div>

                        <button
                            type="submit"
                            className={`${styles.primaryBtn} ${registering ? styles.loading : ''}`}
                            disabled={registering}
                        >
                            {registering ? <span className={styles.spinner} /> : 'Create Account →'}
                        </button>
                    </form>

                    <div className={styles.loginLink}>
                        Already have an account? <Link to="/login">Login here</Link>
                    </div>
                </div>
            </div>

            <p className={styles.footer}>
                © {new Date().getFullYear()} CrickBoss. All rights reserved.
            </p>
        </div>
    );
}
