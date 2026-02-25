// Shared app constants — nav links, footer links, social handles, mock data

export const NAV_LINKS = [
    { label: 'Home', href: '/' },
    { label: "Today's Auctions", href: '/auctions/today' },
    { label: 'Upcoming', href: '/auctions/upcoming' },
    { label: 'Features', href: '/features' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Blog', href: '/blog' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
] as const;

export const FOOTER_QUICK_LINKS = [
    { label: 'Home', href: '/' },
    { label: "Today's Auctions", href: '/auctions/today' },
    { label: 'Upcoming Auctions', href: '/auctions/upcoming' },
    { label: 'Video Gallery', href: '/video-gallery' },
    { label: 'Blog', href: '/blog' },
    { label: 'FAQ', href: '/faq' },
];

export const FOOTER_COMPANY_LINKS = [
    { label: 'About Us', href: '/about' },
    { label: 'Clients & Partners', href: '/clients' },
    { label: 'Features', href: '/features' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Contact Us', href: '/contact' },
];

export const FOOTER_LEGAL_LINKS = [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms & Conditions', href: '/terms' },
    { label: 'Cancellation & Refund', href: '/cancellation' },
];

export const SOCIAL_LINKS = [
    { name: 'Twitter/X', href: 'https://x.com/crickboss', icon: 'twitter' },
    { name: 'Instagram', href: 'https://instagram.com/crickboss', icon: 'instagram' },
    { name: 'YouTube', href: 'https://youtube.com/@crickboss', icon: 'youtube' },
    { name: 'LinkedIn', href: 'https://linkedin.com/company/crickboss', icon: 'linkedin' },
    { name: 'Facebook', href: 'https://facebook.com/crickboss', icon: 'facebook' },
];

export const CONTACT_INFO = {
    email: 'support@crickboss.live',
    phone1: '+91 XXXXX XXXXX',
    phone2: '+91 XXXXX XXXXX',
    whatsapp: 'https://wa.me/91XXXXXXXXXX',
    address: 'India',
};

export const STATS = [
    { value: '10,000+', label: 'Auctions Completed' },
    { value: '5,000+', label: 'Organizers Registered' },
    { value: '50,000+', label: 'Teams Created' },
    { value: '5,00,000+', label: 'Players Registered' },
    { value: '20+', label: 'Countries Served' },
];

export const PRICING_PLANS = [
    { name: 'Starter', teams: 3, price: null, perAuction: true, popular: false },
    { name: 'Basic', teams: 4, price: 1999, perAuction: true, popular: false },
    { name: 'Standard', teams: 6, price: 2499, perAuction: true, popular: false },
    { name: 'Pro', teams: 8, price: 2999, perAuction: true, popular: false },
    { name: 'Advanced', teams: 12, price: 3999, perAuction: true, popular: false },
    { name: 'Elite', teams: 16, price: 4999, perAuction: true, popular: false },
];

export const FEATURES = [
    { icon: '🎯', title: 'Real-Time Live Bidding', desc: 'Dynamic bid updates with instant team formation and live leaderboard.' },
    { icon: '🏆', title: 'Tournament & League Management', desc: 'Create and manage full tournament cycles with customizable rules and schedules.' },
    { icon: '👥', title: 'Team Builder & Roster Tools', desc: 'Build balanced squads with drag-and-drop ease and budget tracking.' },
    { icon: '📊', title: 'Player Profiles & Stats', desc: 'Comprehensive player cards with stats, positions, and auction history.' },
    { icon: '📡', title: 'Live Streaming Integration', desc: 'Broadcast your auction live on YouTube directly from the platform.' },
    { icon: '🔗', title: 'Public Auction Sharing', desc: 'Share a unique link for spectators to watch your auction live on the web.' },
    { icon: '📲', title: 'Mobile App (iOS & Android)', desc: 'Full-featured mobile app for organizers and team managers on the go.' },
    { icon: '⚙️', title: 'Customizable Auction Settings', desc: 'Set base price, bid increments, player limits, and time constraints.' },
    { icon: '🔒', title: 'Secure Tournament Codes', desc: 'Private auctions with unique codes for verified participant access.' },
    { icon: '📹', title: 'Video Auction Replays', desc: 'Watch recordings of past auctions at any time for review and learning.' },
    { icon: '📧', title: 'Notifications & Alerts', desc: 'Real-time push alerts for bids, upcoming auctions, and announcements.' },
    { icon: '🌍', title: 'Multi-Sport Support', desc: 'Also works for Kabaddi, Football, Volleyball, Hockey, and more.' },
];
