import { Link } from 'react-router-dom';
import styles from './PolicyPage.module.css';

export default function CancellationRefundPage() {
    return (
        <main id="main-content">
            <section className={styles.hero}>
                <div className="container">
                    <span className={styles.heroOverline}>Legal Documentation</span>
                    <h1 className={styles.heroTitle}>Cancellation &amp; Refund</h1>
                    <div className={styles.heroMeta}>
                        <span>Effective Date: March 8, 2026</span>
                        <span className={styles.heroDot}></span>
                        <span>Last Updated: March 8, 2026</span>
                    </div>
                </div>
            </section>

            <section className="section bg-light">
                <div className="container">
                    <div className={styles.content}>
                        <div className={styles.breadcrumb}>
                            <Link to="/">Home</Link>
                            <span>/</span>
                            <span>Cancellation &amp; Refund Policy</span>
                        </div>

                        <p className={styles.intro}>
                            At <strong>CrickBoss</strong>, we strive to ensure a fair and transparent experience for all users —
                            both players and tournament organizers. This Cancellation &amp; Refund Policy outlines the conditions
                            under which cancellations are accepted and refunds are processed for tournament registrations made
                            through our Platform.
                        </p>

                        <div className={styles.highlightBox}>
                            <strong>&#9432; Note:</strong> All registration fees on CrickBoss are payments for participating in
                            real-world, physically conducted cricket tournaments. Refund eligibility depends on when the
                            cancellation is made and the nature of the cancellation.
                        </div>

                        <h2 className={styles.sectionTitle}>1. Cancellation by the Player / Team</h2>
                        <p className={styles.intro}>
                            If a registered player or team wishes to cancel their tournament registration, the following
                            refund schedule applies based on the time of cancellation relative to the tournament start date:
                        </p>

                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Cancellation Timing</th>
                                    <th>Refund Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>More than 7 days before tournament start date</td>
                                    <td>100% refund (minus payment gateway processing charges)</td>
                                </tr>
                                <tr>
                                    <td>3 to 7 days before tournament start date</td>
                                    <td>50% refund of the registration fee</td>
                                </tr>
                                <tr>
                                    <td>Less than 3 days before tournament start date</td>
                                    <td>No refund</td>
                                </tr>
                                <tr>
                                    <td>After the tournament has commenced</td>
                                    <td>No refund</td>
                                </tr>
                                <tr>
                                    <td>No-show (registration not cancelled, team or player absent)</td>
                                    <td>No refund</td>
                                </tr>
                            </tbody>
                        </table>

                        <p className={styles.intro}>
                            All cancellations must be initiated by the registered user through the Platform (app or website)
                            or by contacting us at <strong>support@crickboss.in</strong> before the
                            applicable deadline.
                        </p>

                        <h2 className={styles.sectionTitle}>2. Cancellation by the Tournament Organizer</h2>
                        <p className={styles.intro}>
                            If a tournament is cancelled by the organizer after players have registered and paid, the
                            following policy applies:
                        </p>
                        <ul className={styles.list}>
                            <li><strong>Full Refund:</strong> All registered players/teams are entitled to a full refund of their registration fee if the organizer cancels the tournament for any reason prior to its commencement.</li>
                            <li>CrickBoss will facilitate the refund process and coordinate with the organizer and payment gateway accordingly.</li>
                            <li>In cases where the organizer fails to initiate the refund process, CrickBoss will take reasonable steps to assist affected players.</li>
                            <li>Organizers who repeatedly cancel tournaments may have their accounts reviewed or suspended from the Platform.</li>
                        </ul>

                        <h2 className={styles.sectionTitle}>3. Tournament Postponement</h2>
                        <ul className={styles.list}>
                            <li>If a tournament is postponed (rescheduled) by the organizer, your registration remains valid for the new date by default.</li>
                            <li>If you are unable to attend on the rescheduled date, you may request a cancellation and refund by contacting us within <strong>48 hours</strong> of the postponement announcement.</li>
                            <li>Refund eligibility in case of postponement will be assessed on a case-by-case basis.</li>
                        </ul>

                        <h2 className={styles.sectionTitle}>4. Platform Service Fees</h2>
                        <ul className={styles.list}>
                            <li>CrickBoss may charge a platform service fee at the time of registration. This fee is non-refundable in all circumstances, except in the case of a tournament cancellation by the organizer.</li>
                            <li>Payment gateway processing charges (charged by Razorpay) are non-refundable and will be deducted from the refundable amount where applicable.</li>
                        </ul>

                        <h2 className={styles.sectionTitle}>5. Refund Processing</h2>
                        <ul className={styles.list}>
                            <li>Approved refunds will be credited to the <strong>original payment method</strong> (UPI, debit/credit card, net banking, etc.) used at the time of registration.</li>
                            <li>Refunds are typically processed within <strong>5 to 10 business days</strong> from the date of approval, depending on the payment method and bank processing times.</li>
                            <li>CrickBoss reserves the right to request documentation (e.g., proof of registration, payment receipt) before processing a refund.</li>
                            <li>Refunds will not be issued in cash or via alternative payment methods.</li>
                        </ul>

                        <h2 className={styles.sectionTitle}>6. Duplicate Payments</h2>
                        <p className={styles.intro}>
                            If a user is charged more than once due to a technical error or payment failure, the duplicate
                            amount will be fully refunded within 5 to 10 business days after the issue is verified.
                            Please contact us at <strong>support@crickboss.in</strong> with your
                            transaction details for swift resolution.
                        </p>

                        <h2 className={styles.sectionTitle}>7. Failed Transactions</h2>
                        <p className={styles.intro}>
                            In cases where a payment is deducted from your account but your registration is not confirmed
                            (failed transaction), the amount will be automatically reversed to your payment source within
                            <strong>7 to 10 business days</strong>. If the reversal does not occur within this period,
                            please contact our support team immediately.
                        </p>

                        <h2 className={styles.sectionTitle}>8. Non-Refundable Circumstances</h2>
                        <p className={styles.intro}>Refunds will not be provided in the following circumstances:</p>
                        <ul className={styles.list}>
                            <li>The player or team does not meet the eligibility criteria of the tournament.</li>
                            <li>The player or team violates the tournament rules or code of conduct and is disqualified.</li>
                            <li>The registration was cancelled past the eligible window (less than 3 days before the tournament).</li>
                            <li>The platform service fee and payment gateway charges in normal cancellation scenarios.</li>
                            <li>Any registration that was processed free of charge (zero-fee tournaments).</li>
                        </ul>

                        <h2 className={styles.sectionTitle}>9. How to Request a Refund</h2>
                        <p className={styles.intro}>To initiate a refund or cancellation request, please follow these steps:</p>
                        <ul className={styles.list}>
                            <li>Log in to your CrickBoss account on the app or website.</li>
                            <li>Go to <strong>My Registrations</strong> and select the relevant tournament.</li>
                            <li>Click on <strong>Cancel Registration</strong> and follow the on-screen instructions.</li>
                            <li>Alternatively, email us at <strong>support@crickboss.in</strong> with:
                                <ul style={{ marginLeft: '20px', marginTop: '4px' }}>
                                    <li>Your registered name and email address</li>
                                    <li>Tournament name and registration ID</li>
                                    <li>Reason for cancellation</li>
                                    <li>Payment transaction ID</li>
                                </ul>
                            </li>
                        </ul>
                        <p className={styles.intro}>Our support team will acknowledge your request within <strong>24 to 48 hours</strong>.</p>

                        <h2 className={styles.sectionTitle}>10. Amendments to This Policy</h2>
                        <p className={styles.intro}>
                            CrickBoss reserves the right to amend this Cancellation &amp; Refund Policy at any time. Changes
                            will be posted on this page and are effective immediately upon posting. We encourage you to review
                            this policy periodically.
                        </p>

                        <h2 className={styles.sectionTitle}>11. Contact Us</h2>
                        <p className={styles.intro}>For any queries regarding cancellations or refunds, please reach out to us:</p>
                        
                        <div className={styles.contactCard}>
                            <div><strong>Email:</strong> <a href="mailto:support@crickboss.in">support@crickboss.in</a></div>
                            <div><strong>Website:</strong> <a href="https://www.crickboss.in" target="_blank" rel="noopener noreferrer">www.crickboss.in</a></div>
                            <div><strong>Response Time:</strong> Within 24–48 business hours</div>
                        </div>

                    </div>
                </div>
            </section>
        </main>
    );
}
