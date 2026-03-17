import styles from './AuctionStepper.module.css';
import { useTheme } from '../../../../context/ThemeContext';

interface AuctionStepperProps {
    currentStep: number;
    totalSteps: number;
}

const STEPS = ['Details', 'Teams', 'Players', 'Verify'];

export default function AuctionStepper({ currentStep, totalSteps }: AuctionStepperProps) {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const d = isDark ? styles.dark : '';

    return (
        <div className={`${styles.stepperContainer} ${d}`}>
            <div className={styles.progressTop}>
                <div className={styles.activeLabel}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {STEPS[currentStep - 1]}
                </div>
                <div className={styles.stepCount}>Step {currentStep} of {totalSteps}</div>
            </div>
            
            <div className={styles.progressBarBg}>
                <div 
                    className={styles.progressBarFill} 
                    style={{ width: `${(currentStep / totalSteps) * 100}%` }} 
                />
            </div>

            <div className={styles.stepLabelsRow}>
                {STEPS.map((step, idx) => {
                    const stepNum = idx + 1;
                    const isActive = stepNum <= currentStep;
                    const isCompleted = stepNum < currentStep;

                    return (
                        <div key={step} className={`${styles.stepItem} ${isActive ? styles.active : ''}`}>
                            <span className={styles.dot}>
                                {isCompleted && (
                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                )}
                            </span>
                            <span className={styles.label}>{step}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
