import { Link } from 'react-router-dom';
import { FaXTwitter, FaInstagram, FaYoutube, FaLinkedinIn, FaFacebook, FaApple } from 'react-icons/fa6';
import { IoLogoGooglePlaystore } from 'react-icons/io5';
import { MdEmail, MdPhone } from 'react-icons/md';
import { FOOTER_QUICK_LINKS, FOOTER_COMPANY_LINKS, FOOTER_LEGAL_LINKS, CONTACT_INFO } from '../../utils/constants';
import styles from './Footer.module.css';

const SOCIAL = [
    { name: 'Twitter / X', href: 'https://x.com/crickboss', Icon: FaXTwitter, color: '#000000' },
    { name: 'Instagram', href: 'https://instagram.com/crickboss', Icon: FaInstagram, color: '#E1306C' },
    { name: 'YouTube', href: 'https://youtube.com/@crickboss', Icon: FaYoutube, color: '#FF0000' },
    { name: 'LinkedIn', href: 'https://linkedin.com/company/crickboss', Icon: FaLinkedinIn, color: '#0A66C2' },
    { name: 'Facebook', href: 'https://facebook.com/crickboss', Icon: FaFacebook, color: '#1877F2' },
];

export default function Footer() {
    return (
        <footer className={styles.footer} aria-label="Site footer">
            <div className={`container ${styles.grid}`}>

                {/* Col 1: Brand */}
                <div className={styles.brand}>
                    <Link to="/" className={styles.logo}>
                        <svg width="22" height="22" viewBox="0 0 32 32" fill="none" aria-hidden="true">
                            <circle cx="16" cy="16" r="16" fill="#1F3C88" />
                            <path d="M10 22 L16 8 L22 22" stroke="#3DBE8B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                            <line x1="11.5" y1="18" x2="20.5" y2="18" stroke="#3DBE8B" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        <span>Crick<span className={styles.logoBoss}>Boss</span></span>
                    </Link>
                    <p className={styles.tagline}>
                        The world's most trusted cricket player auction platform. Run fair, fast, and fun auctions — anywhere, anytime.
                    </p>
                    <div className={styles.socials}>
                        {SOCIAL.map(({ name, href, Icon, color }) => (
                            <a key={name} href={href} target="_blank" rel="noopener noreferrer"
                                className={styles.socialIcon}
                                aria-label={name}
                                style={{ '--brand-color': color } as React.CSSProperties}
                            >
                                <Icon size={17} />
                            </a>
                        ))}
                    </div>
                </div>

                {/* Col 2: Quick Links */}
                <div className={styles.col}>
                    <h4 className={styles.colTitle}>Quick Links</h4>
                    <ul>
                        {FOOTER_QUICK_LINKS.map(l => (
                            <li key={l.href}><Link to={l.href} className={styles.link}>{l.label}</Link></li>
                        ))}
                    </ul>
                </div>

                {/* Col 3: Company */}
                <div className={styles.col}>
                    <h4 className={styles.colTitle}>Company</h4>
                    <ul>
                        {FOOTER_COMPANY_LINKS.map(l => (
                            <li key={l.href}><Link to={l.href} className={styles.link}>{l.label}</Link></li>
                        ))}
                    </ul>
                </div>

                {/* Col 4: App + Contact */}
                <div className={styles.col}>
                    <h4 className={styles.colTitle}>Get the App</h4>
                    <div className={styles.appBadges}>
                        <a href="#" className={styles.appBadge} aria-label="Download on App Store">
                            <FaApple size={22} className={styles.appIcon} />
                            <div><div className={styles.appSmall}>Download on the</div><div className={styles.appBig}>App Store</div></div>
                        </a>
                        <a href="#" className={styles.appBadge} aria-label="Get it on Google Play">
                            <IoLogoGooglePlaystore size={22} className={styles.appIcon} style={{ color: '#01875f' }} />
                            <div><div className={styles.appSmall}>Get it on</div><div className={styles.appBig}>Google Play</div></div>
                        </a>
                    </div>
                    <h4 className={`${styles.colTitle} ${styles.contactTitle}`}>Contact</h4>
                    <div className={styles.contactInfo}>
                        <a href={`mailto:${CONTACT_INFO.email}`} className={styles.contactLink}>
                            <MdEmail size={15} /> {CONTACT_INFO.email}
                        </a>
                        <a href={`tel:${CONTACT_INFO.phone1}`} className={styles.contactLink}>
                            <MdPhone size={15} /> {CONTACT_INFO.phone1}
                        </a>
                    </div>
                </div>
            </div>

            {/* Bottom strip */}
            <div className={styles.bottom}>
                <div className="container">
                    <div className={styles.bottomInner}>
                        <p className={styles.copyright}>© {new Date().getFullYear()} CrickBoss.live — All Rights Reserved</p>
                        <div className={styles.legalLinks}>
                            {FOOTER_LEGAL_LINKS.map(l => (
                                <Link key={l.href} to={l.href} className={styles.legalLink}>{l.label}</Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
