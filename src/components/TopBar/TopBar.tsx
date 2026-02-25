import { FaXTwitter, FaInstagram, FaFacebook } from 'react-icons/fa6';
import { MdPhone } from 'react-icons/md';
import { CONTACT_INFO } from '../../utils/constants';
import styles from './TopBar.module.css';

const SOCIAL = [
    { name: 'Twitter / X', href: 'https://x.com/crickboss', Icon: FaXTwitter },
    { name: 'Instagram', href: 'https://instagram.com/crickboss', Icon: FaInstagram },
    { name: 'Facebook', href: 'https://facebook.com/crickboss', Icon: FaFacebook },
];

const TEXT = "Welcome to CrickBoss — India's Most Trusted Cricket Player Auction Management Platform.";

export default function TopBar() {
    return (
        <div className={styles.bar} role="banner" aria-label="Site announcement">
            <div className={`container ${styles.inner}`}>

                {/* Static text */}
                <p className={styles.text}>{TEXT}</p>

                {/* Right: socials + phone */}
                <div className={styles.right}>
                    <div className={styles.socials}>
                        {SOCIAL.map(({ name, href, Icon }) => (
                            <a key={name} href={href} target="_blank" rel="noopener noreferrer"
                                className={styles.socialLink} aria-label={name}>
                                <Icon size={13} />
                            </a>
                        ))}
                    </div>
                    <span className={styles.divider} aria-hidden="true" />
                    <a href={`tel:${CONTACT_INFO.phone1}`} className={styles.phone}>
                        <MdPhone size={13} />
                        <span>{CONTACT_INFO.phone1}</span>
                    </a>
                </div>

            </div>
        </div>
    );
}
