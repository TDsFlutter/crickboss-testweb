import { Link } from 'react-router-dom';
import styles from './PolicyPage.module.css';

export default function TermsConditionsPage() {
    return (
        <main id="main-content">
            <section className={styles.hero}>
                <div className="container">
                    <span className={styles.heroOverline}>Legal Documentation</span>
                    <h1 className={styles.heroTitle}>Terms &amp; Conditions</h1>
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
                            <span>Terms &amp; Conditions</span>
                        </div>

                        <p className={styles.intro}>
                            Welcome to <strong>CrickBoss</strong>. By accessing or using our mobile application and/or website
                            (collectively, the "Platform"), you agree to be bound by these Terms &amp; Conditions ("Terms").
                            Please read them carefully. If you do not agree to these Terms, do not use the Platform.
                        </p>
                        <p className={styles.intro}>
                            These Terms constitute a legally binding agreement between you ("User", "you") and CrickBoss ("we",
                            "us", "our"), the operator of this Platform.
                        </p>

                        <h2 className={styles.sectionTitle}>1. About CrickBoss</h2>
                        <p className={styles.intro}>
                            CrickBoss is a sports technology platform that enables cricket enthusiasts, players, and organizers
                            to create, manage, and participate in cricket tournaments. The Platform provides tools for:
                        </p>
                        <ul className={styles.list}>
                            <li>Tournament creation and management by organizers.</li>
                            <li>Team and player registration for cricket tournaments.</li>
                            <li>Score tracking, match scheduling, and results publishing.</li>
                            <li>Online collection of registration fees on behalf of organizers.</li>
                            <li>Player profiles, leaderboards, and performance statistics.</li>
                        </ul>
                        <div className={styles.alertBox}>
                            <strong>Important:</strong> CrickBoss is a <strong>tournament management and registration service</strong>. It is not a fantasy
                            sports platform, nor does it involve skill-based or chance-based monetary competitions. All
                            financial transactions on the Platform are strictly limited to entry or registration fees for
                            real-world cricket tournaments.
                        </div>

                        <h2 className={styles.sectionTitle}>2. Eligibility</h2>
                        <ul className={styles.list}>
                            <li>You must be at least <strong>18 years of age</strong> to use the Platform independently.</li>
                            <li>Users between 13 and 17 years may use the Platform only with explicit parental or guardian consent.</li>
                            <li>You must provide accurate and complete information during registration and keep it updated.</li>
                            <li>By using the Platform, you represent and warrant that all information you provide is truthful and that you have the right to use the Platform.</li>
                        </ul>

                        <h2 className={styles.sectionTitle}>3. Account Registration</h2>
                        <ul className={styles.list}>
                            <li>You must create an account to access the full features of the Platform.</li>
                            <li>You are responsible for maintaining the confidentiality of your login credentials.</li>
                            <li>You are responsible for all activities that occur under your account.</li>
                            <li>Notify us immediately at support@crickboss.in if you suspect unauthorized access to your account.</li>
                            <li>We reserve the right to suspend or terminate accounts that violate these Terms.</li>
                        </ul>

                        <h2 className={styles.sectionTitle}>4. User Roles</h2>
                        <p className={styles.intro}>The Platform supports two primary user roles:</p>
                        <ul className={styles.list}>
                            <li>
                                <strong>Players / Teams:</strong> Individuals or teams who register to participate in tournaments listed
                                on the Platform. Players agree to abide by the rules set by tournament organizers and the general
                                conduct policies of CrickBoss.
                            </li>
                            <li>
                                <strong>Tournament Organizers:</strong> Individuals or organizations who create and manage tournaments
                                on the Platform. Organizers are responsible for setting tournament rules, registration fees, eligibility
                                criteria, match schedules, and prize structures. Organizers must ensure their tournaments comply with
                                applicable laws and CrickBoss policies.
                            </li>
                        </ul>

                        <h2 className={styles.sectionTitle}>5. Tournament Registration &amp; Fees</h2>
                        <ul className={styles.list}>
                            <li>Registration fees, if applicable, are set by the tournament organizer and are displayed clearly on the tournament listing page.</li>
                            <li>All fees are collected securely via our payment gateway partner, Razorpay.</li>
                            <li>By completing payment, you confirm your intent to participate in the respective tournament.</li>
                            <li>CrickBoss may charge a platform service fee on registrations, which will be disclosed at the time of payment.</li>
                            <li>Any disputes regarding registration fees or payouts between players and organizers must be resolved between the concerned parties. CrickBoss will assist in good faith but is not liable for such disputes.</li>
                        </ul>

                        <h2 className={styles.sectionTitle}>6. Organizer Obligations</h2>
                        <p className={styles.intro}>Tournament organizers using CrickBoss agree to:</p>
                        <ul className={styles.list}>
                            <li>Provide accurate tournament information (dates, venue, rules, eligibility, and fees).</li>
                            <li>Conduct tournaments as advertised and in compliance with applicable laws and sports regulations.</li>
                            <li>Not misuse player registration data for purposes other than tournament management.</li>
                            <li>Ensure that prize money or other rewards offered in the tournament are lawful and do not constitute an unlicensed prize competition or any other regulated activity in the relevant jurisdiction.</li>
                            <li>Complete the Razorpay organizer (Route) onboarding process to receive tournament registration fund transfers.</li>
                        </ul>

                        <h2 className={styles.sectionTitle}>7. Permitted Use</h2>
                        <p className={styles.intro}>You agree to use the Platform only for lawful purposes and in accordance with these Terms. You must not:</p>
                        <ul className={styles.list}>
                            <li>Post false, misleading, or fraudulent tournament information.</li>
                            <li>Collect registration fees without the genuine intent to conduct the tournament.</li>
                            <li>Use the Platform to engage in any activity that is illegal under Indian law or applicable local laws.</li>
                            <li>Attempt to gain unauthorized access to any part of the Platform, systems, or user accounts.</li>
                            <li>Upload malware, viruses, or any harmful code.</li>
                            <li>Harass, abuse, or harm other users.</li>
                            <li>Use automated bots, scrapers, or data collection tools without our written consent.</li>
                        </ul>

                        <h2 className={styles.sectionTitle}>8. Intellectual Property</h2>
                        <p className={styles.intro}>
                            All content on the Platform, including but not limited to the CrickBoss name, logo, design, text,
                            graphics, software, and data, is owned by or licensed to CrickBoss and is protected by applicable
                            intellectual property laws.
                        </p>
                        <p className={styles.intro}>
                            You may not reproduce, distribute, modify, or create derivative works of any Platform content
                            without our prior written permission.
                        </p>
                        <p className={styles.intro}>
                            By submitting content (such as tournament details, team names, or photos) to the Platform, you
                            grant CrickBoss a non-exclusive, royalty-free license to use, display, and promote such content
                            in connection with the Platform.
                        </p>

                        <h2 className={styles.sectionTitle}>9. Privacy</h2>
                        <p className={styles.intro}>
                            Your use of the Platform is also governed by our <Link to="/privacy">Privacy Policy</Link>, which is incorporated into these Terms by
                            reference. Please review the Privacy Policy to understand our practices.
                        </p>

                        <h2 className={styles.sectionTitle}>10. Disclaimers &amp; Limitation of Liability</h2>
                        <ul className={styles.list}>
                            <li>The Platform is provided on an "as is" and "as available" basis. We make no warranties, express or implied, about the reliability, accuracy, or availability of the Platform.</li>
                            <li>CrickBoss is a platform intermediary. We are not responsible for the conduct of tournament organizers or players, or for the successful completion of any tournament listed on the Platform.</li>
                            <li>To the maximum extent permitted by law, CrickBoss shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of your use of or inability to use the Platform.</li>
                            <li>Our total liability to you for any claim arising under these Terms shall not exceed the amount paid by you to CrickBoss in the three (3) months preceding the claim.</li>
                        </ul>

                        <h2 className={styles.sectionTitle}>11. Indemnification</h2>
                        <p className={styles.intro}>
                            You agree to indemnify and hold CrickBoss, its officers, employees, and partners harmless from any
                            claims, liabilities, damages, losses, and expenses (including legal fees) arising from your use of
                            the Platform, your violation of these Terms, or your violation of any third-party rights.
                        </p>

                        <h2 className={styles.sectionTitle}>12. Termination</h2>
                        <p className={styles.intro}>
                            We reserve the right to suspend or permanently terminate your account and access to the Platform
                            at our discretion if you violate these Terms, engage in fraudulent activity, or for any other
                            reason we deem necessary to protect the Platform and its users.
                        </p>
                        <p className={styles.intro}>
                            You may also delete your account at any time through the Platform settings or by contacting us.
                            Termination does not affect any rights or obligations that arose before termination.
                        </p>

                        <h2 className={styles.sectionTitle}>13. Governing Law &amp; Dispute Resolution</h2>
                        <p className={styles.intro}>
                            These Terms shall be governed by and construed in accordance with the laws of India. Any disputes
                            arising out of or in connection with these Terms shall be subject to the exclusive jurisdiction of
                            the courts located in India.
                        </p>
                        <p className={styles.intro}>
                            We encourage you to contact us first at <strong>support@crickboss.in</strong>
                            to resolve any disputes amicably before pursuing legal remedies.
                        </p>

                        <h2 className={styles.sectionTitle}>14. Changes to These Terms</h2>
                        <p className={styles.intro}>
                            We may update these Terms from time to time. The revised Terms will be posted on this page with an
                            updated "Last Updated" date. Your continued use of the Platform after the effective date of any
                            changes constitutes your acceptance of the new Terms.
                        </p>

                        <h2 className={styles.sectionTitle}>15. Contact Us</h2>
                        <p className={styles.intro}>If you have any questions about these Terms, please contact us:</p>
                        
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
