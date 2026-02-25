import { Link } from 'react-router-dom';
import { STATS } from '../../utils/constants';
import styles from './HeroSection.module.css';

export default function HeroSection() {
    return (
        <section className={styles.hero} aria-label="Hero section">
            {/* Animated background layers */}
            <div className={styles.bg} aria-hidden="true">
                {/* Stadium photo overlay */}
                <div className={styles.stadiumBg} />
                {/* Gradient overlay for readability */}
                <div className={styles.gradientOverlay} />
                {/* Animated floating cricket elements */}
                <div className={styles.floatingElements}>
                    <div className={`${styles.floatEl} ${styles.ball1}`}>🏏</div>
                    <div className={`${styles.floatEl} ${styles.ball2}`}>🔴</div>
                    <div className={`${styles.floatEl} ${styles.ball3}`}>🏆</div>
                    <div className={`${styles.floatEl} ${styles.ball4}`}>⭐</div>
                    <div className={`${styles.floatEl} ${styles.ball5}`}>🎯</div>
                </div>
                {/* Animated spotlight rings */}
                <div className={styles.ring1} />
                <div className={styles.ring2} />
                <div className={styles.ring3} />
            </div>

            <div className={`container ${styles.inner}`}>
                {/* Left content */}
                <div className={styles.content}>
                    <div className={styles.overlineBadge}>
                        <span className={styles.badgeDot} />
                        <span>The World's Most Trusted Cricket Auction Platform</span>
                    </div>

                    <h1 className={styles.heading}>
                        Run Powerful<br />
                        Cricket Auctions —<br />
                        <span className={styles.accentText}>Anywhere, Anytime</span>
                    </h1>

                    <p className={styles.lead}>
                        CrickBoss makes live player bidding, team formation, and tournament management effortless.
                        Trusted by thousands of organizers across 20+ countries.
                    </p>

                    <div className={styles.ctas}>
                        <Link to="/auctions/today" className={styles.ctaPrimary}>
                            Get Started Free →
                        </Link>
                        <Link to="/video-gallery" className={styles.ctaGhost}>
                            ▶ Watch Demo
                        </Link>
                    </div>

                    {/* Trust badges */}
                    <div className={styles.trustRow}>
                        <div className={styles.trustBadge}>✅ No credit card required</div>
                        <div className={styles.trustBadge}>⚡ Setup in 2 minutes</div>
                        <div className={styles.trustBadge}>🌍 20+ countries</div>
                    </div>
                </div>

                {/* Right — Auction Image Visual */}
                <div className={styles.visual} aria-hidden="true">
                    {/* Main auction banner card */}
                    <div className={styles.auctionBanner}>
                        <div className={styles.bannerImage}>
                            {/* Big cricket bat + ball SVG art */}
                            <svg viewBox="0 0 360 280" fill="none" className={styles.cricketArt}>
                                {/* Stadium lights */}
                                <ellipse cx="80" cy="30" rx="60" ry="20" fill="rgba(255,220,80,0.12)" />
                                <ellipse cx="280" cy="30" rx="60" ry="20" fill="rgba(255,220,80,0.12)" />
                                {/* Ground */}
                                <ellipse cx="180" cy="240" rx="150" ry="40" fill="rgba(61,190,139,0.08)" />
                                <ellipse cx="180" cy="240" rx="100" ry="28" fill="rgba(61,190,139,0.12)" />
                                {/* Pitch */}
                                <rect x="160" y="160" width="40" height="80" rx="4" fill="rgba(255,255,255,0.05)" stroke="rgba(61,190,139,0.3)" strokeWidth="1" />
                                {/* Stumps */}
                                <rect x="172" y="155" width="4" height="40" rx="2" fill="#fff" opacity="0.8" />
                                <rect x="180" y="155" width="4" height="40" rx="2" fill="#fff" opacity="0.8" />
                                <rect x="188" y="155" width="4" height="40" rx="2" fill="#fff" opacity="0.8" />
                                <rect x="169" y="155" width="26" height="3" rx="1.5" fill="#fff" opacity="0.8" />
                                <rect x="169" y="162" width="26" height="3" rx="1.5" fill="#fff" opacity="0.8" />
                                {/* Big Bat */}
                                <g transform="rotate(-30 180 140)">
                                    <rect x="173" y="60" width="22" height="120" rx="8" fill="rgba(255,200,100,0.9)" stroke="rgba(255,159,67,0.5)" strokeWidth="1.5" />
                                    <rect x="176" y="60" width="15" height="15" rx="3" fill="rgba(255,255,255,0.15)" />
                                    <rect x="180" y="180" width="5" height="30" rx="2.5" fill="rgba(200,150,80,0.9)" />
                                </g>
                                {/* Cricket ball */}
                                <circle cx="85" cy="110" r="22" fill="#CC2200" />
                                <circle cx="85" cy="110" r="22" fill="url(#ballGrad)" />
                                <path d="M75 95 Q85 105 75 125" stroke="rgba(255,200,200,0.6)" strokeWidth="1.5" fill="none" />
                                <path d="M95 95 Q85 105 95 125" stroke="rgba(255,200,200,0.6)" strokeWidth="1.5" fill="none" />
                                <defs>
                                    <radialGradient id="ballGrad" cx="35%" cy="35%">
                                        <stop offset="0%" stopColor="#EE3311" stopOpacity="0.9" />
                                        <stop offset="100%" stopColor="#880000" stopOpacity="0.95" />
                                    </radialGradient>
                                </defs>
                                {/* Player silhouette */}
                                <g transform="translate(230,100)">
                                    <circle cx="30" cy="0" r="14" fill="rgba(255,255,255,0.15)" />
                                    <path d="M16 20 Q30 55 44 20" stroke="rgba(255,255,255,0.15)" strokeWidth="18" strokeLinecap="round" fill="none" />
                                    <path d="M44 20 L62 -5" stroke="rgba(255,255,255,0.15)" strokeWidth="10" strokeLinecap="round" />
                                </g>
                                {/* Score overlay */}
                                <rect x="200" y="30" width="120" height="60" rx="12" fill="rgba(31,60,136,0.7)" stroke="rgba(61,190,139,0.3)" strokeWidth="1" />
                                <text x="215" y="52" fontSize="11" fill="rgba(161,190,139,0.9)" fontFamily="monospace">LIVE AUCTION</text>
                                <text x="215" y="72" fontSize="18" fill="#3DBE8B" fontFamily="sans-serif" fontWeight="bold">₹2,50,000</text>
                                <text x="215" y="84" fontSize="9" fill="rgba(255,255,255,0.5)" fontFamily="sans-serif">Current Bid</text>
                            </svg>
                        </div>

                        {/* Floating info chips */}
                        <div className={styles.chip1}>
                            <span className={styles.chipDot} />
                            <span>12 Teams Bidding</span>
                        </div>
                        <div className={styles.chip2}>
                            <span>🏆</span>
                            <span>10,000+ Auctions</span>
                        </div>
                        <div className={styles.chip3}>
                            <span>⚡</span>
                            <span>Real-Time Bids</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats strip */}
            <div className={styles.statsStrip}>
                <div className="container">
                    <div className={styles.statsGrid}>
                        {STATS.map(stat => (
                            <div key={stat.label} className={styles.stat}>
                                <span className={styles.statValue}>{stat.value}</span>
                                <span className={styles.statLabel}>{stat.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
