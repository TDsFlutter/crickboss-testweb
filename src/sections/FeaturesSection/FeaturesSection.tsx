import { Link } from 'react-router-dom';
import { MdSportsScore, MdEmojiEvents, MdGroupWork, MdBarChart, MdLiveTv, MdShare, MdPhoneAndroid, MdSettings, MdLock, MdVideocam, MdNotifications, MdPublic } from 'react-icons/md';
import styles from './FeaturesSection.module.css';

interface Feature {
    icon: React.ReactNode;
    title: string;
    desc: string;
}

const FEATURES: Feature[] = [
    {
        icon: <MdSportsScore size={26} color="#3DBE8B" />,
        title: 'Real-Time Live Bidding',
        desc: 'Dynamic bid updates with instant team formation and live leaderboard.',
    },
    {
        icon: <MdEmojiEvents size={26} color="#FFDC3C" />,
        title: 'Tournament & League Management',
        desc: 'Create and manage full tournament cycles with customizable rules and schedules.',
    },
    {
        icon: <MdGroupWork size={26} color="#7B9EFF" />,
        title: 'Team Builder & Roster Tools',
        desc: 'Build balanced squads with drag-and-drop ease and budget tracking.',
    },
    {
        icon: <MdBarChart size={26} color="#3DBE8B" />,
        title: 'Player Profiles & Stats',
        desc: 'Comprehensive player cards with stats, positions, and auction history.',
    },
    {
        icon: <MdLiveTv size={26} color="#FF4444" />,
        title: 'Live Streaming Integration',
        desc: 'Broadcast your auction live on YouTube directly from the platform.',
    },
    {
        icon: <MdShare size={26} color="#FF9F43" />,
        title: 'Public Auction Sharing',
        desc: 'Share a unique link for spectators to watch your auction live on the web.',
    },
    {
        icon: <MdPhoneAndroid size={26} color="#3DBE8B" />,
        title: 'Mobile App (iOS & Android)',
        desc: 'Full-featured mobile app for organizers and team managers on the go.',
    },
    {
        icon: <MdSettings size={26} color="#A0AEC0" />,
        title: 'Customizable Auction Settings',
        desc: 'Set base price, bid increments, player limits, and time constraints.',
    },
    {
        icon: <MdLock size={26} color="#7B9EFF" />,
        title: 'Secure Tournament Codes',
        desc: 'Private auctions with unique codes for verified participant access.',
    },
    {
        icon: <MdVideocam size={26} color="#FF9F43" />,
        title: 'Video Auction Replays',
        desc: 'Watch recordings of past auctions at any time for review and learning.',
    },
    {
        icon: <MdNotifications size={26} color="#FFDC3C" />,
        title: 'Notifications & Alerts',
        desc: 'Real-time push alerts for bids, upcoming auctions, and announcements.',
    },
    {
        icon: <MdPublic size={26} color="#3DBE8B" />,
        title: 'Multi-Sport Support',
        desc: 'Also works for Kabaddi, Football, Volleyball, Hockey, and more.',
    },
];

export default function FeaturesSection() {
    return (
        <section className={`section ${styles.section}`}>
            <div className="container">
                <div className="section-header">
                    <p className="overline">Platform Features</p>
                    <h2 className="h2">Everything You Need to Run<br />World-Class Auctions</h2>
                    <p className="subtitle" style={{ color: 'var(--color-muted)' }}>
                        From live bidding to mobile apps — CrickBoss gives organizers every tool they need.
                    </p>
                </div>

                <div className="grid-3" style={{ gap: 'var(--space-6)' }}>
                    {FEATURES.map(f => (
                        <div key={f.title} className={styles.card}>
                            <div className={styles.iconWrap}>{f.icon}</div>
                            <h3 className={styles.title}>{f.title}</h3>
                            <p className={styles.desc}>{f.desc}</p>
                        </div>
                    ))}
                </div>

                <div className={styles.cta}>
                    <Link to="/features" className={styles.ctaBtn}>Explore All Features →</Link>
                </div>
            </div>
        </section>
    );
}
