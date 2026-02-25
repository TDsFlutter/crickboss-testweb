import { useState } from 'react';
import styles from './FAQSection.module.css';

const FAQS = [
    { q: 'What is CrickBoss?', a: 'CrickBoss is a professional cricket player auction platform that allows organizers to create and manage live player bidding auctions for tournaments and leagues.' },
    { q: 'Is CrickBoss free to use?', a: 'Yes! Our Starter plan is completely free for auctions with up to 3 teams. Paid plans start at ₹1,999 per auction for larger team counts.' },
    { q: 'How do I create an auction?', a: 'Register an account, click "Create Auction", fill in your tournament details, add teams and players, then share your unique auction code with participants.' },
    { q: 'Can spectators watch the auction?', a: 'Absolutely. Share your public auction link and anyone can watch the real-time bidding without needing an account.' },
    { q: 'Is the mobile app free?', a: 'Yes, the CrickBoss mobile app is free to download on both iOS (App Store) and Android (Google Play).' },
    { q: 'What sports are supported?', a: 'CrickBoss works for Cricket, Kabaddi, Football, Volleyball, Hockey, Badminton, and more. Any sport that uses a player draft or auction format.' },
    { q: 'Can I stream my auction on YouTube?', a: 'Yes! CrickBoss has built-in YouTube live streaming integration. Broadcast your auction live to any audience worldwide.' },
    { q: 'How do I contact support?', a: 'Email us at support@crickboss.live or reach us via WhatsApp. Our team responds within 24 hours on business days.' },
];

interface Props { limit?: number; }

export default function FAQSection({ limit }: Props) {
    const [open, setOpen] = useState<number | null>(null);
    const items = limit ? FAQS.slice(0, limit) : FAQS;

    return (
        <section className="section bg-light">
            <div className="container">
                <div className="section-header">
                    <p className="overline">FAQ</p>
                    <h2 className="h2">Frequently Asked Questions</h2>
                    <p className="subtitle">Everything you need to know before getting started.</p>
                </div>

                <div className={styles.list}>
                    {items.map((faq, i) => (
                        <div key={i} className={`${styles.item} ${open === i ? styles.itemOpen : ''}`}>
                            <button
                                className={styles.question}
                                onClick={() => setOpen(open === i ? null : i)}
                                aria-expanded={open === i}
                            >
                                <span>{faq.q}</span>
                                <span className={styles.icon}>{open === i ? '−' : '+'}</span>
                            </button>
                            <div className={styles.answer} aria-hidden={open !== i}>
                                <p>{faq.a}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
