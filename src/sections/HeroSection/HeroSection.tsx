import { Link } from 'react-router-dom';
import { STATS } from '../../utils/constants';
import styles from './HeroSection.module.css';

// Google Play & App Store SVG icons
function GooglePlayIcon() {
    return (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M3.18 23.76c.37.21.8.22 1.18.03l12.61-7.28-2.69-2.7-11.1 9.95zm-1.18-21.27v19.02c0 .5.27.93.68 1.18L13.9 12 2.68 2.31a1.38 1.38 0 0 0-.68 1.18zm19.5 8.72L18.76 9l-3.03 3.02 3.03 3.03 2.78-1.6c.79-.46.79-1.55-.04-2.04zM4.36.21C3.98.02 3.55.03 3.18.24L14.26 11.3l2.69-2.7L4.36.21z" />
        </svg>
    );
}

function AppStoreIcon() {
    return (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98l-.09.06c-.22.14-2.18 1.27-2.16 3.8.03 3.02 2.65 4.03 2.68 4.04l-.06.18zM13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
        </svg>
    );
}

export default function HeroSection() {
    return (
        <section className={styles.hero} aria-label="Hero section">
            {/* Background */}
            <div className={styles.bg} aria-hidden="true">
                <div className={styles.stadiumBg} />
                <div className={styles.gradientOverlay} />
                <div className={styles.floatingElements}>
                    <div className={`${styles.floatEl} ${styles.ball1}`}>🏏</div>
                    <div className={`${styles.floatEl} ${styles.ball2}`}>🔴</div>
                    <div className={`${styles.floatEl} ${styles.ball3}`}>🏆</div>
                    <div className={`${styles.floatEl} ${styles.ball4}`}>⭐</div>
                    <div className={`${styles.floatEl} ${styles.ball5}`}>🎯</div>
                </div>
                <div className={styles.ring1} />
                <div className={styles.ring2} />
                <div className={styles.ring3} />
            </div>

            {/* Main hero content */}
            <div className={`container ${styles.inner}`}>
                {/* Left content */}
                <div className={styles.content}>
                    <div className={styles.overlineBadge}>
                        <span className={styles.badgeDot} />
                        <span>India's #1 Cricket Team Builder &amp; League Manager</span>
                    </div>

                    <h1 className={styles.heading}>
                        Build Teams &amp; Run<br />
                        <span className={styles.accentText}>Cricket Leagues</span>
                    </h1>

                    <p className={styles.tagline}>Cricket Team Builder &amp; League Manager — Anywhere, Anytime</p>

                    <p className={styles.lead}>
                        Seamless team selection, squad building, and league administration made effortless.
                        Trusted by <strong>10,000+ organizers</strong> across <strong>20+ countries</strong>.
                    </p>

                    {/* Primary CTAs */}
                    <div className={styles.ctas}>
                        <Link to="/auctions/today" className={styles.ctaPrimary}>
                            Get Started Free →
                        </Link>
                        <Link to="/video-gallery" className={styles.ctaGhost}>
                            ▶ Watch Demo
                        </Link>
                    </div>

                    {/* App Download Buttons */}
                    <div className={styles.appDownloads}>
                        <p className={styles.appLabel}>Download the App:</p>
                        <div className={styles.appButtons}>
                            <a
                                href="https://play.google.com/store"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.appBtn}
                                aria-label="Get it on Google Play"
                            >
                                <span className={styles.appBtnIcon}><GooglePlayIcon /></span>
                                <span className={styles.appBtnText}>
                                    <span className={styles.appBtnSmall}>GET IT ON</span>
                                    <span className={styles.appBtnBig}>Google Play</span>
                                </span>
                            </a>
                            <a
                                href="https://apps.apple.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.appBtn}
                                aria-label="Download on the App Store"
                            >
                                <span className={styles.appBtnIcon}><AppStoreIcon /></span>
                                <span className={styles.appBtnText}>
                                    <span className={styles.appBtnSmall}>Download on the</span>
                                    <span className={styles.appBtnBig}>App Store</span>
                                </span>
                            </a>
                        </div>
                    </div>

                    {/* Trust badges */}
                    <div className={styles.trustRow}>
                        <div className={styles.trustBadge}>✅ No credit card required</div>
                        <div className={styles.trustBadge}>⚡ Setup in 2 minutes</div>
                        <div className={styles.trustBadge}>🌍 20+ countries</div>
                    </div>
                </div>

                {/* Right — Auction art visual */}
                <div className={styles.visual} aria-hidden="true">
                    <div className={styles.auctionBanner}>
                        <div className={styles.bannerImage}>
                            <svg viewBox="0 0 400 320" fill="none" className={styles.cricketArt}>
                                {/* Stadium lights */}
                                <ellipse cx="100" cy="40" rx="80" ry="25" fill="rgba(255,220,80,0.10)" />
                                <ellipse cx="300" cy="40" rx="80" ry="25" fill="rgba(255,220,80,0.10)" />
                                {/* Ground */}
                                <ellipse cx="200" cy="280" rx="180" ry="50" fill="rgba(61,190,139,0.08)" />
                                <ellipse cx="200" cy="280" rx="120" ry="35" fill="rgba(61,190,139,0.12)" />
                                {/* Pitch strip */}
                                <rect x="180" y="185" width="40" height="90" rx="5" fill="rgba(255,255,255,0.04)" stroke="rgba(61,190,139,0.25)" strokeWidth="1" />
                                {/* Stumps */}
                                <rect x="192" y="178" width="4" height="46" rx="2" fill="#fff" opacity="0.85" />
                                <rect x="200" y="178" width="4" height="46" rx="2" fill="#fff" opacity="0.85" />
                                <rect x="208" y="178" width="4" height="46" rx="2" fill="#fff" opacity="0.85" />
                                <rect x="188" y="178" width="28" height="3" rx="1.5" fill="#fff" opacity="0.85" />
                                <rect x="188" y="185" width="28" height="3" rx="1.5" fill="#fff" opacity="0.85" />
                                {/* Big Bat */}
                                <g transform="rotate(-28 200 155)">
                                    <rect x="191" y="65" width="24" height="135" rx="9" fill="rgba(255,210,110,0.92)" stroke="rgba(255,159,67,0.6)" strokeWidth="1.5" />
                                    <rect x="194" y="65" width="16" height="18" rx="3" fill="rgba(255,255,255,0.15)" />
                                    <rect x="198" y="200" width="6" height="34" rx="3" fill="rgba(200,150,80,0.9)" />
                                </g>
                                {/* Cricket ball */}
                                <circle cx="92" cy="120" r="26" fill="#CC2200" />
                                <circle cx="92" cy="120" r="26" fill="url(#ballGrad2)" />
                                <path d="M80 104 Q92 116 80 136" stroke="rgba(255,200,200,0.5)" strokeWidth="1.8" fill="none" />
                                <path d="M104 104 Q92 116 104 136" stroke="rgba(255,200,200,0.5)" strokeWidth="1.8" fill="none" />
                                <defs>
                                    <radialGradient id="ballGrad2" cx="35%" cy="35%">
                                        <stop offset="0%" stopColor="#EE3311" stopOpacity="0.9" />
                                        <stop offset="100%" stopColor="#880000" stopOpacity="0.95" />
                                    </radialGradient>
                                </defs>
                                {/* Batsman silhouette */}
                                <g transform="translate(265,100)">
                                    <circle cx="30" cy="0" r="16" fill="rgba(255,255,255,0.13)" />
                                    <path d="M14 22 Q30 58 46 22" stroke="rgba(255,255,255,0.13)" strokeWidth="20" strokeLinecap="round" fill="none" />
                                    <path d="M46 22 L68 -8" stroke="rgba(255,255,255,0.13)" strokeWidth="11" strokeLinecap="round" />
                                </g>
                                {/* Score overlay */}
                                <rect x="225" y="35" width="140" height="72" rx="14" fill="rgba(31,60,136,0.72)" stroke="rgba(61,190,139,0.35)" strokeWidth="1" />
                                <text x="242" y="58" fontSize="11" fill="rgba(161,220,180,0.9)" fontFamily="monospace">LIVE DRAFT</text>
                                <text x="242" y="82" fontSize="22" fill="#3DBE8B" fontFamily="sans-serif" fontWeight="bold">₹2,50,000</text>
                                <text x="242" y="98" fontSize="10" fill="rgba(255,255,255,0.5)" fontFamily="sans-serif">Base Value</text>
                            </svg>
                        </div>

                        {/* Floating chips */}
                        <div className={styles.chip1}>
                            <span className={styles.chipDot} />
                            <span>12 Teams in Draft</span>
                        </div>
                        <div className={styles.chip2}>
                            <span>🏆</span>
                            <span>10,000+ Events</span>
                        </div>
                        <div className={styles.chip3}>
                            <span>⚡</span>
                            <span>Real-Time Updates</span>
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
