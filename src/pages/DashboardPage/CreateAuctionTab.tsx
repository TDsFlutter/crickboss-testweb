import { useState, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import styles from './CreateAuctionTab.module.css';

interface BidSlab {
    id: number;
    from: string;
    to: string;
    increment: string;
}

const SPORTS = ['Cricket', 'Football', 'Volleyball', 'Basketball', 'Kabaddi', 'Badminton', 'Tennis', 'Hockey'];

export default function CreateAuctionTab() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const [bannerUrl, setBannerUrl] = useState('');
    const [iconUrl, setIconUrl] = useState('');
    const [form, setForm] = useState({
        name: '',
        date: '',
        time: '',
        venue: '',
        sport: 'Cricket',
        pointsPerTeam: '',
        baseValue: '',
        bidIncrement: '',
        playersPerTeam: '',
    });
    const [slabs, setSlabs] = useState<BidSlab[]>([
        { id: 1, from: '100', to: '5000', increment: '500' },
    ]);
    const [remoteBidding, setRemoteBidding] = useState(false);
    const bannerRef = useRef<HTMLInputElement>(null);
    const iconRef = useRef<HTMLInputElement>(null);
    const slabCounter = useRef(2);

    const handleField = (k: keyof typeof form, v: string) =>
        setForm(f => ({ ...f, [k]: v }));

    const handleBanner = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) setBannerUrl(URL.createObjectURL(file));
    };

    const handleIcon = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) setIconUrl(URL.createObjectURL(file));
    };

    const addSlab = () => {
        setSlabs(s => [...s, { id: slabCounter.current++, from: '', to: '', increment: '' }]);
    };

    const updateSlab = (id: number, field: keyof Omit<BidSlab, 'id'>, value: string) =>
        setSlabs(s => s.map(sl => sl.id === id ? { ...sl, [field]: value } : sl));

    const deleteSlab = (id: number) =>
        setSlabs(s => s.filter(sl => sl.id !== id));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Show a basic success feedback (demo)
        alert('Auction created successfully! (Demo mode)');
    };

    const d = isDark ? styles.dark : '';

    return (
        <form className={`${styles.wrap} ${d}`} onSubmit={handleSubmit} noValidate>

            {/* ── Media Section ── */}
            <div className={`${styles.section} ${d}`}>
                <h2 className={`${styles.sectionTitle} ${d}`}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
                    Media
                </h2>
                <p className={styles.sectionDesc}>Add a banner image and auction icon</p>

                {/* Banner */}
                <div className={`${styles.bannerUpload} ${d}`} onClick={() => bannerRef.current?.click()}>
                    <input ref={bannerRef} type="file" accept="image/*" onChange={handleBanner} tabIndex={-1} />
                    {bannerUrl
                        ? <img src={bannerUrl} alt="Banner preview" className={styles.bannerPreview} />
                        : <>
                            <div className={styles.uploadIcon}>
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
                            </div>
                            <span className={styles.uploadLabel}>Tap to upload banner image</span>
                            <span className={styles.uploadHint}>Recommended: 16:9 ratio</span>
                        </>
                    }
                </div>

                {/* Icon */}
                <div className={styles.iconRow}>
                    <div className={`${styles.iconUpload} ${d}`} onClick={() => iconRef.current?.click()}>
                        <input ref={iconRef} type="file" accept="image/*" onChange={handleIcon} tabIndex={-1} />
                        {iconUrl
                            ? <img src={iconUrl} alt="Icon preview" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 14 }} />
                            : <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                        }
                    </div>
                    <div className={styles.iconMeta}>
                        <h4>Auction Logo / Icon</h4>
                        <p>Square image, used as auction avatar</p>
                    </div>
                </div>
            </div>

            {/* ── Basic Info ── */}
            <div className={`${styles.section} ${d}`}>
                <h2 className={`${styles.sectionTitle} ${d}`}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 14.66V20a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2h5.34" /><polygon points="18 2 22 6 12 16 8 16 8 12 18 2" /></svg>
                    Auction Info
                </h2>
                <p className={styles.sectionDesc}>Basic details about your auction</p>

                <div className={styles.formGrid}>
                    {/* Name */}
                    <div className={`${styles.field} ${styles.fullSpan}`}>
                        <label className={`${styles.label} ${d}`}>
                            Auction Name <span className={styles.required}>*</span>
                        </label>
                        <div className={styles.inputWrap}>
                            <span className={styles.inputIcon}>
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" /></svg>
                            </span>
                            <input
                                className={`${styles.input} ${d}`}
                                type="text"
                                placeholder="e.g. IPL Season 2026"
                                value={form.name}
                                onChange={e => handleField('name', e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {/* Date */}
                    <div className={styles.field}>
                        <label className={`${styles.label} ${d}`}>Date <span className={styles.required}>*</span></label>
                        <div className={styles.inputWrap}>
                            <span className={styles.inputIcon}>
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                            </span>
                            <input className={`${styles.input} ${d}`} type="date" value={form.date} onChange={e => handleField('date', e.target.value)} required />
                        </div>
                    </div>

                    {/* Time */}
                    <div className={styles.field}>
                        <label className={`${styles.label} ${d}`}>Time <span className={styles.required}>*</span></label>
                        <div className={styles.inputWrap}>
                            <span className={styles.inputIcon}>
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                            </span>
                            <input className={`${styles.input} ${d}`} type="time" value={form.time} onChange={e => handleField('time', e.target.value)} required />
                        </div>
                    </div>

                    {/* Venue */}
                    <div className={`${styles.field} ${styles.fullSpan}`}>
                        <label className={`${styles.label} ${d}`}>Venue <span className={styles.required}>*</span></label>
                        <div className={styles.inputWrap}>
                            <span className={styles.inputIcon}>
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
                            </span>
                            <input className={`${styles.input} ${d}`} type="text" placeholder="e.g. Wankhede Stadium" value={form.venue} onChange={e => handleField('venue', e.target.value)} required />
                        </div>
                    </div>

                    {/* Play Type */}
                    <div className={`${styles.field} ${styles.fullSpan}`}>
                        <label className={`${styles.label} ${d}`}>Play Type</label>
                        <div className={styles.selectWrap}>
                            <select className={`${styles.select} ${d}`} value={form.sport} onChange={e => handleField('sport', e.target.value)}>
                                {SPORTS.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                            <span className={styles.selectArrow}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9" /></svg>
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Auction Settings ── */}
            <div className={`${styles.section} ${d}`}>
                <h2 className={`${styles.sectionTitle} ${d}`}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.07 4.93a10 10 0 010 14.14M4.93 4.93a10 10 0 000 14.14" /></svg>
                    Auction Settings
                </h2>
                <p className={styles.sectionDesc}>Configure points, bids and player limits</p>

                <div className={`${styles.formGrid} ${d}`}>
                    {[
                        { key: 'pointsPerTeam', label: 'Points per Team', placeholder: '100' },
                        { key: 'baseValue', label: 'Base Value (₹)', placeholder: '100' },
                        { key: 'bidIncrement', label: 'Bid Increment (₹)', placeholder: '50' },
                        { key: 'playersPerTeam', label: 'Players per Team', placeholder: '11' },
                    ].map(f => (
                        <div key={f.key} className={styles.field}>
                            <label className={`${styles.label} ${d}`}>{f.label} <span className={styles.required}>*</span></label>
                            <input
                                className={`${styles.input} ${d}`}
                                type="number"
                                placeholder={f.placeholder}
                                min={0}
                                value={form[f.key as keyof typeof form]}
                                onChange={e => handleField(f.key as keyof typeof form, e.target.value)}
                                required
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Bid Slabs ── */}
            <div className={`${styles.section} ${d}`}>
                <h2 className={`${styles.sectionTitle} ${d}`}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg>
                    Bid Slabs
                </h2>
                <p className={styles.sectionDesc}>Set different bid increments for different price ranges</p>

                <div className={styles.slabList}>
                    {slabs.map((slab, idx) => (
                        <div key={slab.id} className={`${styles.slabRow} ${d}`}>
                            <span className={`${styles.slabLabel} ${d}`}>Slab {idx + 1}</span>

                            <div className={styles.slabFieldWrap}>
                                <div className={styles.slabFieldLabel}>From (₹)</div>
                                <input
                                    className={`${styles.slabInput} ${d}`}
                                    type="number"
                                    placeholder="0"
                                    value={slab.from}
                                    onChange={e => updateSlab(slab.id, 'from', e.target.value)}
                                />
                            </div>

                            <span className={styles.slabDash}>—</span>

                            <div className={styles.slabFieldWrap}>
                                <div className={styles.slabFieldLabel}>To (₹)</div>
                                <input
                                    className={`${styles.slabInput} ${d}`}
                                    type="number"
                                    placeholder="5000"
                                    value={slab.to}
                                    onChange={e => updateSlab(slab.id, 'to', e.target.value)}
                                />
                            </div>

                            <span className={styles.slabDash}>+</span>

                            <div className={styles.slabFieldWrap}>
                                <div className={styles.slabFieldLabel}>Increment (₹)</div>
                                <input
                                    className={`${styles.slabInput} ${d}`}
                                    type="number"
                                    placeholder="500"
                                    value={slab.increment}
                                    onChange={e => updateSlab(slab.id, 'increment', e.target.value)}
                                />
                            </div>

                            <button
                                type="button"
                                className={styles.deleteSlabBtn}
                                onClick={() => deleteSlab(slab.id)}
                                aria-label={`Remove slab ${idx + 1}`}
                            >
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                            </button>
                        </div>
                    ))}
                </div>

                <button type="button" className={`${styles.addSlabBtn} ${d}`} onClick={addSlab}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                    Add Bid Slab
                </button>
            </div>

            {/* ── Remote Bidding ── */}
            <div className={`${styles.section} ${d}`}>
                <div className={styles.toggleRow}>
                    <div className={styles.toggleInfo}>
                        <h4>Remote Bidding</h4>
                        <p>Allow participants to join and bid remotely</p>
                    </div>
                    <label className={styles.toggle} aria-label="Toggle remote bidding">
                        <input
                            type="checkbox"
                            checked={remoteBidding}
                            onChange={e => setRemoteBidding(e.target.checked)}
                        />
                        <span className={styles.toggleSlider} />
                    </label>
                </div>
            </div>

            {/* ── Submit ── */}
            <button type="submit" className={styles.submitBtn}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 14.66V20a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2h5.34" /><polygon points="18 2 22 6 12 16 8 16 8 12 18 2" /></svg>
                Create Auction
            </button>
        </form>
    );
}
