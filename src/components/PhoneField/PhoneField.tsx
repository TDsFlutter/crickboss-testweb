import type { KeyboardEvent } from 'react';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { useTheme } from '../../context/ThemeContext';
import styles from './PhoneField.module.css';

interface PhoneFieldProps {
    label?: string;
    error?: string;
    value: string;
    onChange: (value: string | undefined) => void;
    onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
    required?: boolean;
    defaultCountry?: string;
    id?: string;
    /** Force dark/light theme override (uses ThemeContext by default) */
    themeProp?: 'dark' | 'light';
}

export default function PhoneField({
    label,
    error,
    value,
    onChange,
    onKeyDown,
    required,
    defaultCountry = 'IN',
    id,
    themeProp,
}: PhoneFieldProps) {
    const { theme } = useTheme();
    const isDark = themeProp ? themeProp === 'dark' : theme === 'dark';
    const d = isDark ? styles.dark : '';

    return (
        <div className={`${styles.group} ${d}`}>
            {label && (
                <label className={styles.label} htmlFor={id}>
                    {label}
                    {required && <span className={styles.required}>*</span>}
                </label>
            )}
            <PhoneInput
                international
                defaultCountry={defaultCountry as 'IN'}
                value={value}
                onChange={onChange}
                onKeyDown={onKeyDown}
                className={`${styles.container} ${error ? styles.error : ''}`}
                id={id}
                inputProps={{ id }}
            />
            {error && <p className={styles.errorMsg}>{error}</p>}
        </div>
    );
}
