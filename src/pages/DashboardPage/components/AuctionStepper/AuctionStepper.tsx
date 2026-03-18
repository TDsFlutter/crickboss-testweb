import styles from './AuctionStepper.module.css';
import { useTheme } from '../../../../context/ThemeContext';
import { FaCheckCircle, FaCircle, FaUser, FaShieldAlt, FaClipboardList, FaCheckSquare } from 'react-icons/fa';

interface AuctionStepperProps {
    currentStep: number;
    totalSteps: number;
}

const STEPS = [
    { label: 'Details', icon: <FaClipboardList /> },
    { label: 'Teams', icon: <FaShieldAlt /> },
    { label: 'Players', icon: <FaUser /> },
    { label: 'Verify', icon: <FaCheckSquare /> },
];

export default function AuctionStepper({ currentStep, totalSteps }: AuctionStepperProps) {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const d = isDark ? styles.dark : '';

    const currentStepData = STEPS[currentStep - 1] || STEPS[0];
    const progressPercent = (currentStep / totalSteps) * 100;

    return (
        <div className={`${styles.stepperBox} ${d}`}>
            {/* Header */}
            <div className={styles.stepperHeader}>
                <div className={`${styles.stepperTitle} ${d}`}>
                    <span className={styles.headerIcon}>{currentStepData.icon}</span>
                    {currentStepData.label}
                </div>
                <div className={styles.stepperCount}>
                    Step {currentStep} of {totalSteps}
                </div>
            </div>

            {/* Progress Bar */}
            <div className={`${styles.progressBarBg} ${d}`}>
                <div className={`${styles.progressBarFill} ${d}`} style={{ width: `${progressPercent}%` }} />
            </div>

            {/* Footer Labels */}
            <div className={styles.stepperFooter}>
                {STEPS.map((step, idx) => {
                    const stepNum = idx + 1;
                    const isCompleted = stepNum < currentStep;
                    const isActive = stepNum === currentStep;
                    const isFuture = stepNum > currentStep;

                    return (
                        <div 
                            key={step.label} 
                            className={`${styles.stepItem} ${isActive ? styles.stepActive : ''} ${isFuture ? styles.stepFuture : ''} ${d}`}
                        >
                            <span className={styles.stepItemIcon}>
                                {isCompleted && <FaCheckCircle className={styles.iconCompleted} />}
                                {isActive && <FaCircle className={styles.iconActive} />}
                                {isFuture && <FaCircle className={styles.iconFuture} />}
                            </span>
                            <span className={styles.stepItemLabel}>{step.label}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
