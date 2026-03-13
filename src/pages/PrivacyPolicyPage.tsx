import { Link } from 'react-router-dom';
import styles from './PolicyPage.module.css';

export default function PrivacyPolicyPage() {
    return (
        <main id="main-content">
            {/* Hero Section */}
            <section className={styles.hero}>
                <div className="container">
                    <span className={styles.heroOverline}>Legal Documentation</span>
                    <h1 className={styles.heroTitle}>Privacy Policy</h1>
                    <div className={styles.heroMeta}>
                        <span>Effective Date: March 8, 2026</span>
                        <span className={styles.heroDot}></span>
                        <span>Last Updated: March 8, 2026</span>
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <section className="section bg-light">
                <div className="container">
                    <div className={styles.content}>
                        <div className={styles.breadcrumb}>
                            <Link to="/">Home</Link>
                            <span>/</span>
                            <span>Privacy Policy</span>
                        </div>

                        <p className={styles.intro}>
                            Welcome to <strong>CrickBoss</strong> ("we", "our", or "us"). We are committed to protecting your
                            personal information and your right to privacy. This Privacy Policy explains how we collect,
                            use, disclose, and safeguard your information when you use our mobile application and/or
                            website (collectively, the "Platform"). Please read this policy carefully.
                        </p>

                        <h2 className={styles.sectionTitle}>1. Information We Collect</h2>
                        <p className={styles.intro}>We may collect the following categories of information:</p>
                        <ul className={styles.list}>
                            <li><strong>Personal Identification Information:</strong> Name, email address, phone number, and date of birth when you register an account.</li>
                            <li><strong>Profile Information:</strong> Username, profile photo, cricket team details, and role (player or tournament organizer).</li>
                            <li><strong>Payment Information:</strong> Transaction details, payment status, and reference IDs processed via our payment gateway (Razorpay). We do not store your card, UPI, or banking credentials on our servers.</li>
                            <li><strong>Tournament & Registration Data:</strong> Tournament names, teams registered, match schedules, scores, and participation history.</li>
                            <li><strong>Device & Usage Information:</strong> IP address, device model, operating system, browser type, pages visited, and usage patterns on the Platform.</li>
                            <li><strong>Communications:</strong> Messages or queries you send us through contact forms or support channels.</li>
                        </ul>

                        <h2 className={styles.sectionTitle}>2. How We Use Your Information</h2>
                        <p className={styles.intro}>We use the information we collect to:</p>
                        <ul className={styles.list}>
                            <li>Create and manage your account on the Platform.</li>
                            <li>Enable tournament registration, team management, and score tracking.</li>
                            <li>Process registration fees and other payments securely.</li>
                            <li>Send transactional notifications (registration confirmations, payment receipts, match updates).</li>
                            <li>Communicate promotional offers, app updates, and new features (you may opt out at any time).</li>
                            <li>Improve Platform performance, fix bugs, and enhance user experience.</li>
                            <li>Enforce our Terms & Conditions and prevent fraudulent or unauthorized activity.</li>
                            <li>Comply with applicable legal obligations.</li>
                        </ul>

                        <h2 className={styles.sectionTitle}>3. Sharing of Your Information</h2>
                        <p className={styles.intro}>We do <strong>not</strong> sell or rent your personal data. We may share your information only in the following circumstances:</p>
                        <ul className={styles.list}>
                            <li><strong>Service Providers:</strong> Trusted third-party vendors (e.g., payment processors, cloud hosting, analytics providers) who assist us in operating the Platform and are bound by data protection agreements.</li>
                            <li><strong>Tournament Organizers:</strong> Limited player information (name, team, contact number) may be shared with the organizer of a tournament you register for, solely for event management purposes.</li>
                            <li><strong>Legal Authorities:</strong> When required by law, court order, or government authority, or to protect the rights and safety of our users.</li>
                            <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, your data may be transferred subject to the same privacy protections.</li>
                        </ul>

                        <h2 className={styles.sectionTitle}>4. Payment Data & Security</h2>
                        <p className={styles.intro}>
                            All payment transactions are processed through <strong>Razorpay</strong>, a PCI-DSS compliant payment gateway.
                            CrickBoss does not store any sensitive financial information such as card numbers, CVVs, or bank account details.
                            Razorpay's privacy policy governs how they handle your payment data.
                        </p>
                        <p className={styles.intro}>
                            We implement industry-standard security measures including SSL/TLS encryption, secure cloud storage,
                            and access controls to protect your data from unauthorized access or disclosure.
                        </p>

                        <h2 className={styles.sectionTitle}>5. Cookies and Tracking Technologies</h2>
                        <p className={styles.intro}>
                            Our website may use cookies and similar tracking technologies to enhance user experience, analyze
                            traffic, and remember your preferences. You can control cookie settings through your browser.
                            Disabling cookies may affect certain features of the Platform.
                        </p>

                        <h2 className={styles.sectionTitle}>6. Data Retention</h2>
                        <p className={styles.intro}>
                            We retain your personal information for as long as your account is active or as necessary to provide
                            you with our services. You may request deletion of your account and associated data at any time by
                            contacting us. We may retain certain information as required by law or for legitimate business purposes
                            (e.g., transaction records for financial compliance).
                        </p>

                        <h2 className={styles.sectionTitle}>7. Your Rights</h2>
                        <p className={styles.intro}>Depending on your jurisdiction, you may have the following rights regarding your personal data:</p>
                        <ul className={styles.list}>
                            <li><strong>Access:</strong> Request a copy of the personal data we hold about you.</li>
                            <li><strong>Correction:</strong> Request correction of inaccurate or incomplete data.</li>
                            <li><strong>Deletion:</strong> Request deletion of your personal data ("right to be forgotten").</li>
                            <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications at any time.</li>
                            <li><strong>Data Portability:</strong> Request a copy of your data in a structured, machine-readable format.</li>
                            <li><strong>Restrict Processing:</strong> Request that we limit how we use your data.</li>
                        </ul>
                        <p className={styles.intro}>To exercise any of these rights, contact us at <strong>support@crickboss.in</strong>.</p>

                        <h2 className={styles.sectionTitle}>8. Children's Privacy</h2>
                        <p className={styles.intro}>
                            CrickBoss is not intended for use by individuals under the age of 18. We do not knowingly
                            collect personal information from minors. If we become aware that a minor has provided us
                            with personal data, we will promptly delete it. Parental consent is required for players
                            under 18 to register on the Platform.
                        </p>

                        <h2 className={styles.sectionTitle}>9. Third-Party Links</h2>
                        <p className={styles.intro}>
                            Our Platform may contain links to third-party websites or services. We are not responsible for the
                            privacy practices or content of those third parties. We encourage you to read the privacy policies
                            of any external sites you visit.
                        </p>

                        <h2 className={styles.sectionTitle}>10. Changes to This Privacy Policy</h2>
                        <p className={styles.intro}>
                            We may update this Privacy Policy from time to time. We will notify you of any significant changes
                            by posting the new policy on this page and updating the "Last Updated" date. Your continued use of
                            the Platform after the changes take effect constitutes your acceptance of the revised policy.
                        </p>

                        <h2 className={styles.sectionTitle}>11. Contact Us</h2>
                        <p className={styles.intro}>If you have any questions, concerns, or requests regarding this Privacy Policy, please contact us:</p>
                        
                        <div className={styles.contactCard}>
                            <div><strong>Email:</strong> <a href="mailto:support@crickboss.in">support@crickboss.in</a></div>
                            <div><strong>Website:</strong> <a href="https://www.crickboss.in" target="_blank" rel="noopener noreferrer">www.crickboss.in</a></div>
                            <div><strong>Address:</strong> CrickBoss, India</div>
                        </div>

                    </div>
                </div>
            </section>
        </main>
    );
}
