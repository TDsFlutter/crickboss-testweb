import { Link } from 'react-router-dom';
import AuctionCard from '../../components/AuctionCard/AuctionCard';
import styles from './AuctionsSection.module.css';

const TODAY_MOCK = [
    { name: 'Mumbai Premier League 2026', date: '24 Feb 2026', code: '52095-685', status: 'LIVE' as const, teamsCount: 8 },
    { name: 'Youngstars Cup Season 3', date: '24 Feb 2026', code: '75360-742', status: 'LIVE' as const, teamsCount: 6 },
    { name: 'Jaguars Sports Auction', date: '24 Feb 2026', code: '50582-502', status: 'TODAY' as const, teamsCount: 4 },
    { name: 'Bijapur RPL Season 4', date: '24 Feb 2026', code: '62013-515', status: 'TODAY' as const, teamsCount: 12 },
];

const UPCOMING_MOCK = [
    { name: 'Maharashtra Premier League', date: '25 Feb 2026', code: '72637-263', status: 'UPCOMING' as const, teamsCount: 8 },
    { name: 'MPL 2026 Night Edition', date: '26 Feb 2026', code: '52024-848', status: 'UPCOMING' as const, teamsCount: 6 },
    { name: 'Champions Auction 2026', date: '28 Feb 2026', code: '12389-270', status: 'UPCOMING' as const, teamsCount: 10 },
];

interface Props {
    variant: 'today' | 'upcoming';
    limit?: number;
    showAll?: boolean;
}

function EmptyState({ variant }: { variant: 'today' | 'upcoming' }) {
    return (
        <div className={styles.empty}>
            {/* Auction-themed SVG placeholder */}
            <div className={styles.emptyIllustration} aria-hidden="true">
                <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
                    <circle cx="60" cy="60" r="56" fill="var(--color-primary-bg)" stroke="var(--color-border)" strokeWidth="1.5" />
                    {/* Gavel */}
                    <rect x="30" y="52" width="44" height="14" rx="5" fill="var(--color-primary)" opacity="0.4" />
                    <rect x="60" y="45" width="12" height="32" rx="4" fill="var(--color-primary)" transform="rotate(40 66 61)" />
                    <circle cx="60" cy="60" r="8" fill="var(--color-accent)" opacity="0.7" />
                    {/* Stars */}
                    <text x="82" y="36" fontSize="14" fill="var(--color-warning)" opacity="0.8">★</text>
                    <text x="28" y="34" fontSize="10" fill="var(--color-accent)" opacity="0.6">✦</text>
                    <text x="88" y="80" fontSize="10" fill="var(--color-primary)" opacity="0.5">✦</text>
                </svg>
            </div>
            <p className={styles.emptyTitle}>
                {variant === 'today' ? 'No Live Auctions Right Now' : 'No Upcoming Auctions Scheduled'}
            </p>
            <p className={styles.emptyDesc}>
                {variant === 'today'
                    ? 'Check back soon — new auctions are added daily by organizers worldwide.'
                    : 'New auctions are scheduled regularly. Register to get notified.'}
            </p>
            <Link to="/contact" className={styles.emptyAction}>
                {variant === 'today' ? 'Create an Auction →' : 'Get Notified →'}
            </Link>
        </div>
    );
}

export default function AuctionsSection({ variant, limit = 4, showAll = false }: Props) {
    const isToday = variant === 'today';
    const data = isToday ? TODAY_MOCK : UPCOMING_MOCK;
    const items = showAll ? data : data.slice(0, limit);

    return (
        <section className={`section ${isToday ? 'bg-white' : 'bg-light'}`}>
            <div className="container">
                <div className={styles.header}>
                    <div>
                        <p className="overline">{isToday ? "Today's Auctions" : "Upcoming Auctions"}</p>
                        <h2 className="h2">
                            {isToday
                                ? <span>Live <span className={styles.liveAccent}>Right Now</span></span>
                                : 'Coming Up Next'}
                        </h2>
                    </div>
                    {items.length > 0 && (
                        <Link to={isToday ? '/auctions/today' : '/auctions/upcoming'} className="view-all-link">
                            View All →
                        </Link>
                    )}
                </div>

                {items.length === 0 ? (
                    <EmptyState variant={variant} />
                ) : (
                    <div className={`grid-${Math.min(items.length, 4) as 2 | 3 | 4}`}>
                        {items.map(a => <AuctionCard key={a.code} {...a} />)}
                    </div>
                )}
            </div>
        </section>
    );
}
