import { useRef, useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import ImageCropper, { useImageCropper } from '../../components/ImageCropper/ImageCropper';
import styles from './CreateAuctionTab.module.css';

interface BidSlab { id: number; from: string; to: string; increment: string; }
const SPORTS = ['Cricket', 'Football', 'Volleyball', 'Basketball', 'Kabaddi', 'Badminton', 'Tennis', 'Hockey'];
interface FormErrors {
    name?: string; date?: string; time?: string; venue?: string;
    pointsPerTeam?: string; baseValue?: string; bidIncrement?: string; playersPerTeam?: string; slabs?: string;
}

export default function CreateAuctionTab() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const d = isDark ? styles.dark : '';

    const banner = useImageCropper();
    const icon = useImageCropper();

    const [form, setForm] = useState({
        name: '', date: '', time: '', venue: '', sport: 'Cricket',
        pointsPerTeam: '', baseValue: '', bidIncrement: '', playersPerTeam: '',
    });
    const [slabs, setSlabs] = useState<BidSlab[]>([]);
    const [remoteBidding, setRemoteBidding] = useState(false);
    const [errors, setErrors] = useState<FormErrors>({});
    const [submitted, setSubmitted] = useState(false);
    const slabId = useRef(1);

    const field = (k: keyof typeof form, v: string) => {
        setForm(f => ({ ...f, [k]: v }));
        setErrors(prev => { const e = { ...prev }; delete e[k as keyof FormErrors]; return e; });
    };

    const addSlab = () => {
        setSlabs(s => [...s, { id: slabId.current++, from: '', to: '', increment: '' }]);
        setErrors(prev => { const e = { ...prev }; delete e.slabs; return e; });
    };
    const updateSlab = (id: number, f: keyof Omit<BidSlab, 'id'>, v: string) =>
        setSlabs(s => s.map(sl => sl.id === id ? { ...sl, [f]: v } : sl));
    const deleteSlab = (id: number) => setSlabs(s => s.filter(sl => sl.id !== id));

    const posNum = (val: string, label: string): string | undefined => {
        if (!val.trim()) return `${label} is required.`;
        const n = parseFloat(val);
        if (isNaN(n) || n <= 0) return `${label} must be a positive number.`;
    };

    const validate = () => {
        const e: FormErrors = {};
        if (!form.name.trim()) e.name = 'Auction name is required.';
        if (!form.date) e.date = 'Date is required.';
        if (!form.time) e.time = 'Time is required.';
        if (!form.venue.trim()) e.venue = 'Venue is required.';
        const pt = posNum(form.pointsPerTeam, 'Points per team'); if (pt) e.pointsPerTeam = pt;
        const bv = posNum(form.baseValue, 'Base value'); if (bv) e.baseValue = bv;
        const bi = posNum(form.bidIncrement, 'Bid increment'); if (bi) e.bidIncrement = bi;
        const pp = posNum(form.playersPerTeam, 'Players per team'); if (pp) e.playersPerTeam = pp;
        if (slabs.length > 0) {
            const bad = slabs.some(s => {
                const f = parseFloat(s.from), t = parseFloat(s.to), i = parseFloat(s.increment);
                return !s.from || !s.to || !s.increment || isNaN(f) || isNaN(t) || isNaN(i) || f >= t || i <= 0;
            });
            if (bad) e.slabs = 'Complete all slab fields. "From" must be less than "To".';
        }
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 4000);
    };

    return (
        <>
            {banner.rawSrc && <ImageCropper src={banner.rawSrc} aspect={16 / 9} title="Crop Banner (16:9)" onCropComplete={banner.confirm} onCancel={banner.cancel} />}
            {icon.rawSrc && <ImageCropper src={icon.rawSrc} aspect={1} title="Crop Logo (1:1)" onCropComplete={icon.confirm} onCancel={icon.cancel} />}

            {/* Hidden file inputs */}
            <input ref={banner.fileInputRef} type="file" accept="image/*" onChange={banner.handleFile} style={{ display: 'none' }} />
            <input ref={icon.fileInputRef} type="file" accept="image/*" onChange={icon.handleFile} style={{ display: 'none' }} />

            <form className={`${styles.wrap} ${d}`} onSubmit={handleSubmit} noValidate>

                {/* ── BANNER — no section card, full-width 16:9 zone ── */}
                <div
                    className={`${styles.bannerZone} ${d}`}
                    onClick={banner.openPicker}
                    role="button" tabIndex={0}
                    onKeyDown={e => e.key === 'Enter' && banner.openPicker()}
                    aria-label="Upload and crop banner (16:9)"
                >
                    {banner.resultUrl ? (
                        <>
                            <img src={banner.resultUrl} alt="Banner preview" className={styles.bannerPreviewImg} />
                            <div className={styles.bannerOverlay}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
                                </svg>
                                Replace Banner
                            </div>
                        </>
                    ) : (
                        <div className={styles.bannerPlaceholder}>
                            <div className={styles.uploadCircle}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                    <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
                                </svg>
                            </div>
                            <div>
                                <div className={styles.uploadTitle}>Click to upload banner</div>
                                <div className={styles.uploadSub}>PNG, JPG · Cropped to 16:9 ✂️</div>
                            </div>
                        </div>
                    )}
                </div>

                {/* ── 01. Auction Info  ─────────────────────────────── */}
                <div className={`${styles.section} ${d}`}>
                    <div className={styles.sectionHead}>
                        <span className={styles.sectionBadge}>01</span>
                        <div>
                            <h2 className={`${styles.sectionTitle} ${d}`}>Auction Info</h2>
                            <p className={styles.sectionDesc}>Basic details about your auction event</p>
                        </div>
                    </div>

                    <hr className={styles.divider} />

                    {/* Middle Section: Left(Sport + Title) | Right(Logo) */}
                    <div className={styles.upperSection}>
                        <div className={styles.leftFields}>
                            <div className={styles.fieldGroup}>
                                <label className={`${styles.label} ${d}`}>Sport</label>
                                <div className={styles.selectWrap}>
                                    <select className={`${styles.input} ${styles.select} ${d}`} value={form.sport} onChange={e => field('sport', e.target.value)}>
                                        {SPORTS.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                    <span className={styles.selectChev}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9" /></svg></span>
                                </div>
                            </div>
                            <div className={styles.fieldGroup}>
                                <label className={`${styles.label} ${d}`}>Auction Title <span className={styles.req}>*</span></label>
                                <input className={`${styles.input} ${d} ${errors.name ? styles.inputErr : ''}`} type="text" placeholder="e.g. IPL Season 2026" value={form.name} onChange={e => field('name', e.target.value)} />
                                {errors.name && <span className={styles.err}>{errors.name}</span>}
                            </div>
                        </div>

                        {/* Logo square on right */}
                        <div className={styles.fieldGroup}>
                            <label className={`${styles.label} ${d}`}>Logo <span className={styles.logoSize}>500×500 px</span></label>
                            <div
                                className={`${styles.logoZone} ${d}`}
                                onClick={icon.openPicker}
                                role="button" tabIndex={0}
                                onKeyDown={e => e.key === 'Enter' && icon.openPicker()}
                                aria-label="Upload logo (1:1 square)"
                            >
                                {icon.resultUrl
                                    ? <img src={icon.resultUrl} alt="Logo" className={styles.logoPreviewImg} />
                                    : <>
                                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                                        <span>Browse</span>
                                    </>
                                }
                            </div>
                        </div>
                    </div>

                    <hr className={styles.divider} />

                    {/* Bottom Row: Date | Time | Venue */}
                    <div className={styles.grid3}>
                        <div className={styles.fieldGroup}>
                            <label className={`${styles.label} ${d}`}>Date <span className={styles.req}>*</span></label>
                            <input className={`${styles.input} ${d} ${errors.date ? styles.inputErr : ''}`} type="date" value={form.date} onChange={e => field('date', e.target.value)} />
                            {errors.date && <span className={styles.err}>{errors.date}</span>}
                        </div>
                        <div className={styles.fieldGroup}>
                            <label className={`${styles.label} ${d}`}>Time <span className={styles.req}>*</span></label>
                            <input className={`${styles.input} ${d} ${errors.time ? styles.inputErr : ''}`} type="time" value={form.time} onChange={e => field('time', e.target.value)} />
                            {errors.time && <span className={styles.err}>{errors.time}</span>}
                        </div>
                        <div className={styles.fieldGroup}>
                            <label className={`${styles.label} ${d}`}>Venue <span className={styles.req}>*</span></label>
                            <input className={`${styles.input} ${d} ${errors.venue ? styles.inputErr : ''}`} type="text" placeholder="e.g. Wankhede Stadium" value={form.venue} onChange={e => field('venue', e.target.value)} />
                            {errors.venue && <span className={styles.err}>{errors.venue}</span>}
                        </div>
                    </div>
                </div>

                {/* ── 02. Auction Settings ───────────────────────── */}
                <div className={`${styles.section} ${d}`}>
                    <div className={styles.sectionHead}>
                        <span className={styles.sectionBadge}>02</span>
                        <div>
                            <h2 className={`${styles.sectionTitle} ${d}`}>Auction Settings</h2>
                            <p className={styles.sectionDesc}>Configure purse, bids, and player limits</p>
                        </div>
                    </div>
                    <div className={styles.grid4}>
                        {[
                            { key: 'pointsPerTeam', label: 'Team Purse Value', ph: '100' },
                            { key: 'baseValue', label: 'Player Base Price', ph: '100' },
                            { key: 'bidIncrement', label: 'Bid Increment (₹)', ph: '50' },
                            { key: 'playersPerTeam', label: 'Players per Team', ph: '11' },
                        ].map(f => (
                            <div key={f.key} className={styles.fieldGroup}>
                                <label className={`${styles.label} ${d}`}>{f.label} <span className={styles.req}>*</span></label>
                                <input
                                    className={`${styles.input} ${d} ${errors[f.key as keyof FormErrors] ? styles.inputErr : ''}`}
                                    type="number" placeholder={f.ph} min={1}
                                    value={form[f.key as keyof typeof form]}
                                    onChange={e => field(f.key as keyof typeof form, e.target.value)}
                                />
                                {errors[f.key as keyof FormErrors] && <span className={styles.err}>{errors[f.key as keyof FormErrors]}</span>}
                            </div>
                        ))}
                    </div>
                    <p className={styles.settingsNote}>
                        💡 Base price and bid increment can be changed per-category or per-player after creating.
                    </p>
                </div>

                {/* ── 03. Bid Slabs ─────────────────────────────── */}
                <div className={`${styles.section} ${d}`}>
                    <div className={styles.sectionHead}>
                        <span className={styles.sectionBadge}>03</span>
                        <div>
                            <h2 className={`${styles.sectionTitle} ${d}`}>
                                Bid Slabs <span className={styles.optionalTag}>Optional</span>
                            </h2>
                            <p className={styles.sectionDesc}>Different bid increments for different price ranges</p>
                        </div>
                    </div>

                    {slabs.length === 0 ? (
                        <div className={styles.slabEmpty}>
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                                <rect x="3" y="3" width="18" height="18" rx="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="21" x2="9" y2="9" />
                            </svg>
                            <p>No bid slabs configured yet. Click below to add ranges.</p>
                        </div>
                    ) : (
                        <div className={styles.slabTable}>
                            <div className={styles.slabTHead}>
                                <span>#</span><span>From (₹)</span><span>To (₹)</span><span>Increment (₹)</span><span></span>
                            </div>
                            {slabs.map((slab, idx) => (
                                <div key={slab.id} className={`${styles.slabTRow} ${d}`}>
                                    <span className={styles.slabIdx}>{idx + 1}</span>
                                    <input className={`${styles.slabInput} ${d}`} type="number" placeholder="0" min={0} value={slab.from} onChange={e => updateSlab(slab.id, 'from', e.target.value)} />
                                    <input className={`${styles.slabInput} ${d}`} type="number" placeholder="5000" min={0} value={slab.to} onChange={e => updateSlab(slab.id, 'to', e.target.value)} />
                                    <input className={`${styles.slabInput} ${d}`} type="number" placeholder="500" min={1} value={slab.increment} onChange={e => updateSlab(slab.id, 'increment', e.target.value)} />
                                    <button type="button" className={styles.slabDel} onClick={() => deleteSlab(slab.id)} aria-label="Remove">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                    {errors.slabs && <p className={styles.err} style={{ marginTop: 8 }}>{errors.slabs}</p>}
                    <button type="button" className={`${styles.addSlabBtn} ${d}`} onClick={addSlab}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                        Add Bid Slab
                    </button>
                </div>

                {/* ── Options ─────────────────────────────────────── */}
                <div className={`${styles.section} ${d}`}>
                    <div className={styles.toggleRow}>
                        <div>
                            <div className={styles.toggleTitle}>Remote Bidding</div>
                            <div className={styles.toggleSub}>Allow participants to join and bid from anywhere</div>
                        </div>
                        <label className={styles.toggle}>
                            <input type="checkbox" checked={remoteBidding} onChange={e => setRemoteBidding(e.target.checked)} />
                            <span className={styles.toggleSlider} />
                        </label>
                    </div>
                </div>

                {submitted && (
                    <div className={styles.successToast}>✅ Auction created successfully! (Demo mode)</div>
                )}

                <div className={styles.submitRow}>
                    <button type="submit" className={styles.submitBtn}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 14.66V20a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2h5.34" /><polygon points="18 2 22 6 12 16 8 16 8 12 18 2" />
                        </svg>
                        Create Auction
                    </button>
                    <p className={styles.submitNote}>You can edit all details after creating.</p>
                </div>
            </form>
        </>
    );
}
