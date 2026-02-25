import { Link } from 'react-router-dom';
import { PRICING_PLANS } from '../../utils/constants';
import styles from './PricingSection.module.css';

const PLAN_FEATURES = [
    'Live player bidding',
    'Team management',
    'Player profiles & stats',
    'Mobile app access',
    'Public auction link',
];

export default function PricingSection() {
    return (
        <section className="section bg-light">
            <div className="container">
                <div className="section-header">
                    <p className="overline">Pricing</p>
                    <h2 className="h2">Simple, Transparent Pricing</h2>
                    <p className="subtitle">Start free. Scale as you grow. No hidden fees.</p>
                </div>

                <div className={styles.grid}>
                    {PRICING_PLANS.map(plan => (
                        <div key={plan.name} className={`${styles.card} ${plan.popular ? styles.popular : ''}`}>
                            {plan.popular && <div className={styles.popularBadge}>🔥 Most Popular</div>}

                            <div className={styles.planName}>{plan.name}</div>
                            <div className={styles.teamCount}>Up to {plan.teams} Teams</div>

                            <div className={styles.price}>
                                {plan.price
                                    ? <><span className={styles.currency}>₹</span>{plan.price.toLocaleString()}</>
                                    : <span className={styles.free}>Free</span>
                                }
                                {plan.price && <span className={styles.period}> / auction</span>}
                            </div>

                            <ul className={styles.features}>
                                {PLAN_FEATURES.map(f => (
                                    <li key={f} className={styles.featureItem}>
                                        <span className={styles.check}>✓</span> {f}
                                    </li>
                                ))}
                            </ul>

                            <Link
                                to="/contact"
                                className={`${styles.cta} ${plan.popular ? styles.ctaPopular : ''}`}
                            >
                                {plan.price ? 'Get Started' : 'Start Free'}
                            </Link>
                        </div>
                    ))}
                </div>

                <p className={styles.note}>
                    All prices include GST. Volume discounts available.{' '}
                    <Link to="/contact" className={styles.noteLink}>Contact us</Link> for custom plans.
                </p>
            </div>
        </section>
    );
}
