import { Link } from 'react-router-dom';
import { CalendarIcon, UsersIcon } from '../Icons/Icons';
import styles from './AuctionCard.module.css';

export type AuctionStatus = 'LIVE' | 'TODAY' | 'UPCOMING';

export interface AuctionCardProps {
    name: string;
    date: string;
    code: string;
    status: AuctionStatus;
    teamsCount?: number;
}

const STATUS_LABELS: Record<AuctionStatus, string> = {
    LIVE: 'LIVE',
    TODAY: 'TODAY',
    UPCOMING: 'UPCOMING',
};

export default function AuctionCard({ name, date, code, status, teamsCount = 0 }: AuctionCardProps) {
    return (
        <article className={`${styles.card} ${styles[`status_${status.toLowerCase()}`]}`}>
            {/* Top row: status badge */}
            <div className={styles.top}>
                <span className={`${styles.statusBadge} ${styles[`badge_${status.toLowerCase()}`]}`}>
                    {status === 'LIVE' && <span className={styles.liveDot} />}
                    {STATUS_LABELS[status]}
                </span>
            </div>

            {/* Body */}
            <div className={styles.body}>
                <h3 className={styles.name}>{name}</h3>
                <div className={styles.meta}>
                    <span className={styles.metaItem}>
                        <CalendarIcon size={13} /> {date}
                    </span>
                    {teamsCount > 0 && (
                        <span className={styles.metaItem}>
                            <UsersIcon size={13} /> {teamsCount} Teams
                        </span>
                    )}
                </div>
            </div>

            {/* Footer */}
            <div className={styles.footer}>
                <span className={styles.code}>#{code}</span>
                <Link
                    to={`/auctions/${status === 'UPCOMING' ? 'upcoming' : 'today'}`}
                    className={styles.cta}
                >
                    View Details
                </Link>
            </div>
        </article>
    );
}
