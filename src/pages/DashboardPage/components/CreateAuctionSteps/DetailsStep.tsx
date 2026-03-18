import React from 'react';
import styles from '../../CreateAuctionTab.module.css';
import { useTheme } from '../../../../context/ThemeContext';
import { FaHammer, FaMapMarkerAlt, FaCalendarAlt, FaClock, FaTrophy, FaUsers, FaArrowRight, FaPlus, FaTrash, FaGlobeAmericas, FaLock } from 'react-icons/fa';

export interface BidSlab {
    id: number;
    from: string;
    to: string;
    increment: string;
}

interface ImageCropperResult {
    openPicker: () => void;
    handleFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
    resultUrl: string | null;
    reset: () => void;
    isLoading?: boolean;
}

interface DetailsStepProps {
    data: any;
    errors: any;
    onFieldChange: (k: string, v: string) => void;
    onNext: () => void;
    banner: ImageCropperResult;
    icon: ImageCropperResult;
    isDraggingBanner: boolean;
    setIsDraggingBanner: (v: boolean) => void;
    isDraggingIcon: boolean;
    setIsDraggingIcon: (v: boolean) => void;
    makeDragHandlers: (setDragging: (v: boolean) => void, handleFile: (e: React.ChangeEvent<HTMLInputElement>) => void) => any;
    SPORTS: string[];
    onAddSlab: () => void;
    onRemoveSlab: (id: number) => void;
    onSlabChange: (id: number, k: keyof BidSlab, v: string) => void;
}

const DetailsStep: React.FC<DetailsStepProps> = ({ 
    data, errors, onFieldChange, onNext, banner, icon, 
    isDraggingBanner, setIsDraggingBanner, isDraggingIcon, setIsDraggingIcon, 
    makeDragHandlers, SPORTS, onAddSlab, onRemoveSlab, onSlabChange 
}) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const d = isDark ? styles.dark : '';

    return (
        <div className={styles.stepContent}>
            {/* Banner Upload Zone */}
            <div
                className={`${styles.bannerZone} ${d} ${isDraggingBanner ? styles.bannerZoneDrag : ''}`}
                onClick={banner.openPicker}
                role="button" tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && banner.openPicker()}
                {...makeDragHandlers(setIsDraggingBanner, banner.handleFile)}
            >
                {banner.resultUrl ? (
                    <>
                        <img src={banner.resultUrl} alt="Banner" className={styles.bannerPreviewImg} />
                        <div className={styles.bannerOverlay}>Replace Banner</div>
                    </>
                ) : (
                    <div className={styles.bannerPlaceholder}>
                        <div className={styles.uploadCircle}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
                        </div>
                        <div>
                            <div className={styles.uploadTitle}>{isDraggingBanner ? 'Drop image here' : 'Tap to upload banner'}</div>
                            <div className={styles.uploadSub}>16:9 ratio recommended</div>
                        </div>
                    </div>
                )}
            </div>

            {/* Section 01: Auction Details */}
            <div className={`${styles.section} ${d}`}>
                <div className={styles.sectionHead}>
                    <span className={styles.sectionBadge}>01</span>
                    <div>
                        <h2 className={`${styles.sectionTitle} ${d}`}>Auction Details</h2>
                        <p className={styles.sectionDesc}>Basic information about your auction</p>
                    </div>
                </div>

                <div className={styles.divider} />

                <div className={styles.upperSection}>
                    <div className={styles.leftFields}>
                        <div className={styles.fieldGroup}>
                            <label className={`${styles.label} ${d}`}>
                                <FaHammer /> Auction Name <span className={styles.req}>*</span>
                            </label>
                            <input
                                className={`${styles.input} ${d} ${errors.name ? styles.inputErr : ''}`}
                                type="text"
                                placeholder="e.g. IPL Season 2026"
                                value={data.name}
                                onChange={e => onFieldChange('name', e.target.value)}
                            />
                            {errors.name && <span className={styles.err}>{errors.name}</span>}
                        </div>
                        <div className={styles.fieldGroup}>
                            <label className={`${styles.label} ${d}`}>
                                <FaMapMarkerAlt /> Venue <span className={styles.req}>*</span>
                            </label>
                            <input
                                className={`${styles.input} ${d} ${errors.venue ? styles.inputErr : ''}`}
                                type="text"
                                placeholder="e.g. Wankhede Stadium"
                                value={data.venue}
                                onChange={e => onFieldChange('venue', e.target.value)}
                            />
                            {errors.venue && <span className={styles.err}>{errors.venue}</span>}
                        </div>
                    </div>

                    <div className={styles.fieldGroup}>
                        <label className={`${styles.label} ${d}`}>Auction Icon</label>
                        <div
                            className={`${styles.logoZone} ${d} ${isDraggingIcon ? styles.logoZoneDrag : ''}`}
                            onClick={icon.openPicker}
                            role="button" tabIndex={0}
                            {...makeDragHandlers(setIsDraggingIcon, icon.handleFile)}
                        >
                            {icon.resultUrl ? (
                                <>
                                    <img src={icon.resultUrl} alt="Icon" className={styles.logoPreviewImg} />
                                    <div className={styles.logoChangeOverlay}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                                        Change
                                    </div>
                                </>
                            ) : (
                                <div className={styles.logoPlaceholder}>
                                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                                    <span>{isDraggingIcon ? 'Drop it!' : 'Icon'}</span>
                                    <small>Tap or drag</small>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className={styles.grid3}>
                    <div className={styles.fieldGroup}>
                        <label className={`${styles.label} ${d}`}>
                            <FaCalendarAlt /> Date <span className={styles.req}>*</span>
                        </label>
                        <input className={`${styles.input} ${d}`} type="date" value={data.date} onChange={e => onFieldChange('date', e.target.value)} />
                    </div>
                    <div className={styles.fieldGroup}>
                        <label className={`${styles.label} ${d}`}>
                            <FaClock /> Time <span className={styles.req}>*</span>
                        </label>
                        <input className={`${styles.input} ${d}`} type="time" value={data.time} onChange={e => onFieldChange('time', e.target.value)} />
                    </div>
                    <div className={styles.fieldGroup}>
                        <label className={`${styles.label} ${d}`}>
                            <FaTrophy /> Play Type
                        </label>
                        <div className={styles.selectWrap}>
                            <select className={`${styles.input} ${styles.select} ${d}`} value={data.sport} onChange={e => onFieldChange('sport', e.target.value)}>
                                {SPORTS.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Section 02: Auction Settings */}
            <div className={`${styles.section} ${d}`}>
                <div className={styles.sectionHead}>
                    <span className={styles.sectionBadge}>02</span>
                    <div>
                        <h2 className={`${styles.sectionTitle} ${d}`}>Auction Settings</h2>
                        <p className={styles.sectionDesc}>Configure points, base values, and increments</p>
                    </div>
                </div>

                <div className={styles.divider} />

                <div className={styles.grid4}>
                    {[
                        { key: 'pointsPerTeam', label: 'Points/Team', icon: <FaUsers /> },
                        { key: 'baseValue', label: 'Base Value', icon: <FaTrophy /> },
                        { key: 'bidIncrement', label: 'Bid Increment', icon: <FaPlus /> },
                        { key: 'playersPerTeam', label: 'Players/Team', icon: <FaUsers /> },
                    ].map(f => (
                        <div key={f.key} className={styles.fieldGroup}>
                            <label className={`${styles.label} ${d}`}>{f.icon} {f.label} *</label>
                            <input
                                className={`${styles.input} ${d}`}
                                type="number"
                                value={data[f.key]}
                                onChange={e => onFieldChange(f.key, e.target.value)}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Section 03: Bid Slabs (Optional) */}
            <div className={`${styles.section} ${d}`}>
                <div className={styles.sectionHead}>
                    <span className={styles.sectionBadge}>03</span>
                    <div>
                        <h2 className={`${styles.sectionTitle} ${d}`}>Bid Slabs <span className={styles.optionalTag}>Optional</span></h2>
                        <p className={styles.sectionDesc}>Define custom increments for different bid ranges</p>
                    </div>
                </div>

                <div className={styles.divider} />

                <div className={styles.slabWrapper}>
                    {data.bidSlabs.length === 0 ? (
                        <div className={styles.slabEmpty}>
                            <FaHammer />
                            <p>No bid slabs added yet. Click the button below to add one.</p>
                        </div>
                    ) : (
                        <div className={styles.slabTable}>
                            <div className={styles.slabTHead}>
                                <div>#</div>
                                <div>From (₹)</div>
                                <div>To (₹)</div>
                                <div>Increment (₹)</div>
                                <div></div>
                            </div>
                            {data.bidSlabs.map((slab: BidSlab, idx: number) => (
                                <div key={slab.id} className={styles.slabTRow}>
                                    <div className={styles.slabIdx}>{idx + 1}</div>
                                    <input 
                                        type="number" 
                                        className={styles.slabInput} 
                                        placeholder="0"
                                        value={slab.from} 
                                        onChange={(e) => onSlabChange(slab.id, 'from', e.target.value)}
                                    />
                                    <input 
                                        type="number" 
                                        className={styles.slabInput} 
                                        placeholder="1000"
                                        value={slab.to} 
                                        onChange={(e) => onSlabChange(slab.id, 'to', e.target.value)}
                                    />
                                    <input 
                                        type="number" 
                                        className={styles.slabInput} 
                                        placeholder="100"
                                        value={slab.increment} 
                                        onChange={(e) => onSlabChange(slab.id, 'increment', e.target.value)}
                                    />
                                    <button 
                                        className={styles.slabDel} 
                                        onClick={() => onRemoveSlab(slab.id)}
                                        title="Remove Slab"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                    <button className={styles.addSlabBtn} onClick={onAddSlab}>
                        <FaPlus /> Add Bid Slab
                    </button>
                </div>
            </div>

            {/* Section 04: Auction Visibility */}
            <div className={`${styles.section} ${d}`}>
                <div className={styles.sectionHead}>
                    <span className={styles.sectionBadge}>04</span>
                    <div>
                        <h2 className={`${styles.sectionTitle} ${d}`}>Auction Visibility</h2>
                        <p className={styles.sectionDesc}>Choose who can see your auction</p>
                    </div>
                </div>

                <div className={styles.divider} />

                <div className={styles.visibilityToggle}>
                    <button 
                        className={`${styles.visBtn} ${data.visibility === 'Public' ? styles.visActive : ''}`}
                        onClick={() => onFieldChange('visibility', 'Public')}
                        type="button"
                    >
                        <FaGlobeAmericas /> Public
                    </button>
                    <button 
                        className={`${styles.visBtn} ${data.visibility === 'Private' ? styles.visActive : ''}`}
                        onClick={() => onFieldChange('visibility', 'Private')}
                        type="button"
                    >
                        <FaLock /> Private
                    </button>
                </div>
            </div>

            <div className={styles.submitRow}>
                <button className={styles.submitBtn} onClick={onNext}>
                    Save & Continue <FaArrowRight />
                </button>
                <p className={styles.submitNote}>Step 1 of 4: All fields can be edited later</p>
            </div>
        </div>
    );
};

export default DetailsStep;
