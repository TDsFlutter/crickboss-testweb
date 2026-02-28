import { useState, useRef } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { isValidPhoneNumber } from 'react-phone-number-input';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import FormField from '../../components/FormField/FormField';
import PhoneField from '../../components/PhoneField/PhoneField';
import styles from './RegisterPage.module.css';

export default function RegisterPage() {
    const { isLoggedIn, login } = useAuth();
    const navigate = useNavigate();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');
    const [city, setCity] = useState('');
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [registering, setRegistering] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    if (isLoggedIn) return <Navigate to="/dashboard" replace />;

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
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
        if (!mobile || !isValidPhoneNumber(mobile)) {
            newErrors.mobile = 'Please enter a valid mobile number.';
        }
        if (!city.trim()) newErrors.city = 'City is required.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const clearError = (field: string) => {
        if (errors[field]) setErrors(prev => { const e = { ...prev }; delete e[field]; return e; });
    };

    const handleRegister = (e: FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;
        setRegistering(true);
        setTimeout(() => {
            setRegistering(false);
            login(mobile);
            navigate('/dashboard', { replace: true });
        }, 800);
    };

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

                <div className={styles.formPanel}>
                    <h1 className={styles.title}>Create Account ✨</h1>
                    <p className={styles.sub}>Join CrickBoss to manage your tournaments</p>

                    <form onSubmit={handleRegister} className={styles.form} noValidate>
                        {/* Image Upload */}
                        <div className={styles.imageUploadGroup}>
                            <div
                                className={styles.imagePreviewCircle}
                                onClick={() => fileInputRef.current?.click()}
                                role="button"
                                tabIndex={0}
                                aria-label="Upload profile image"
                                onKeyDown={e => e.key === 'Enter' && fileInputRef.current?.click()}
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
                                aria-label="Upload profile photo"
                            />
                            <span className={styles.imageLabel}>Add Profile Photo</span>
                        </div>

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

                        {/* Mobile Number */}
                        <PhoneField
                            label="Mobile Number"
                            id="reg-mobile"
                            value={mobile}
                            onChange={(value) => { setMobile(value || ''); clearError('mobile'); }}
                            error={errors.mobile}
                            required
                            defaultCountry="IN"
                        />

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
