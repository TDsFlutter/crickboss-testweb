import type { InputHTMLAttributes, ReactNode } from 'react';
import { useTheme } from '../../context/ThemeContext';
import styles from './FormField.module.css';

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    hint?: string;
    icon?: ReactNode;
    required?: boolean;
    /** Force dark/light theme override (uses ThemeContext by default) */
    themeProp?: 'dark' | 'light';
}

export default function FormField({
    label,
    error,
    hint,
    icon,
    required,
    themeProp,
    className,
    ...inputProps
}: FormFieldProps) {
    const { theme } = useTheme();
    const isDark = themeProp ? themeProp === 'dark' : theme === 'dark';
    const d = isDark ? styles.dark : '';

    return (
        <div className={`${styles.group} ${d}`}>
            {label && (
                <label className={styles.label}>
                    {label}
                    {required && <span className={styles.required}>*</span>}
                </label>
            )}
            <div className={`${styles.inputWrap} ${icon ? styles.hasIcon : ''}`}>
                {icon && <span className={styles.icon}>{icon}</span>}
                <input
                    {...inputProps}
                    className={`${styles.input} ${error ? styles.error : ''} ${className || ''}`}
                    required={required}
                />
            </div>
            {error && <p className={styles.errorMsg}>{error}</p>}
            {hint && !error && <p className={styles.hint}>{hint}</p>}
        </div>
    );
}
