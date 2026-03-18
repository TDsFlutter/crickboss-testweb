import styles from './AuctionStepper.module.css';
import { useTheme } from '../../../../context/ThemeContext';

interface AuctionStepperProps {
    currentStep: number;
    totalSteps: number;
}

const STEPS = [
    { label: 'Details', icon: '📋' },
    { label: 'Teams', icon: '🛡️' },
    { label: 'Players', icon: '🏏' },
    { label: 'Verify', icon: '✅' },
];

export default function AuctionStepper({ currentStep, totalSteps }: AuctionStepperProps) {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <div className={`${styles.stepper} ${isDark ? styles.dark : ''}`}>
            {STEPS.map((step, idx) => {
                const stepNum = idx + 1;
                const isCompleted = stepNum < currentStep;
                const isActive = stepNum === currentStep;
                const isFuture = stepNum > currentStep;

                return (
                    <div key={step.label} className={styles.stepWrapper}>
                        {/* Node */}
                        <div className={`${styles.node} ${isCompleted ? styles.completed : ''} ${isActive ? styles.active : ''} ${isFuture ? styles.future : ''}`}>
                            {isCompleted ? (
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                            ) : (
                                <span className={styles.nodeNum}>{stepNum}</span>
                            )}
                            {isActive && <span className={styles.pulse} />}
                        </div>

                        {/* Label */}
                        <div className={`${styles.stepLabel} ${isCompleted ? styles.labelDone : ''} ${isActive ? styles.labelActive : ''} ${isFuture ? styles.labelFuture : ''}`}>
                            <span className={styles.stepIcon}>{step.icon}</span>
                            {step.label}
                        </div>

                        {/* Connector Line (not on last) */}
                        {idx < totalSteps - 1 && (
                            <div className={`${styles.connector} ${isCompleted ? styles.connectorDone : ''}`}>
                                <div className={`${styles.connectorFill} ${isCompleted ? styles.connectorFillDone : ''}`} />
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
