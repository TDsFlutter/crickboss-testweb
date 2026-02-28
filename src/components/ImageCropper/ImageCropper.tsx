import { useState, useCallback, useRef } from 'react';
import type { ReactNode } from 'react';
import Cropper from 'react-easy-crop';
import type { Area, Point } from 'react-easy-crop';
import { createPortal } from 'react-dom';
import { useTheme } from '../../context/ThemeContext';
import { getCroppedImg } from '../../utils/cropImage';
import styles from './ImageCropper.module.css';

interface ImageCropperProps {
    /** Raw object URL from file picker */
    src: string;
    /** 16/9 for banners, 1 for icons/avatars */
    aspect?: number;
    /** Called with the final cropped data URL when user confirms */
    onCropComplete: (croppedUrl: string) => void;
    /** Called when user cancels */
    onCancel: () => void;
    title?: string;
}

export default function ImageCropper({
    src,
    aspect = 16 / 9,
    onCropComplete,
    onCancel,
    title = 'Crop Image',
}: ImageCropperProps) {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
    const [saving, setSaving] = useState(false);

    const handleCropComplete = useCallback((_: Area, croppedPixels: Area) => {
        setCroppedAreaPixels(croppedPixels);
    }, []);

    const handleConfirm = async () => {
        if (!croppedAreaPixels) return;
        setSaving(true);
        try {
            const url = await getCroppedImg(src, croppedAreaPixels, 'blob');
            onCropComplete(url);
        } finally {
            setSaving(false);
        }
    };

    // Compute slider gradient so the filled portion color tracks the thumb
    const sliderBg = `linear-gradient(to right, #1F3C88 ${((zoom - 1) / 2) * 100}%, #dde3ef ${((zoom - 1) / 2) * 100}%)`;

    const modal = (
        <div className={styles.overlay} onClick={e => { if (e.target === e.currentTarget) onCancel(); }}>
            <div className={`${styles.modal} ${isDark ? styles.dark : ''}`} role="dialog" aria-modal="true" aria-label={title}>
                {/* Header */}
                <div className={styles.header}>
                    <h2 className={styles.title}>{title}</h2>
                    <button className={styles.closeBtn} onClick={onCancel} aria-label="Close">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                {/* Crop area — fixed aspect ratio via CSS custom property */}
                <div
                    className={styles.cropArea}
                    style={{ '--crop-aspect': aspect } as React.CSSProperties}
                >
                    <Cropper
                        image={src}
                        crop={crop}
                        zoom={zoom}
                        aspect={aspect}
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                        onCropComplete={handleCropComplete}
                        showGrid
                        style={{
                            containerStyle: { background: '#000' },
                            cropAreaStyle: {
                                border: '2px solid #3DBE8B',
                                boxShadow: '0 0 0 9999px rgba(0,0,0,0.55)',
                            },
                        }}
                    />
                </div>

                {/* Zoom slider */}
                <div className={styles.controls}>
                    <span className={styles.sliderLabel}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><line x1="11" y1="8" x2="11" y2="14" /><line x1="8" y1="11" x2="14" y2="11" /></svg>
                        Zoom
                    </span>
                    <input
                        type="range"
                        min={1}
                        max={3}
                        step={0.01}
                        value={zoom}
                        onChange={e => setZoom(Number(e.target.value))}
                        className={styles.zoomSlider}
                        style={{ background: sliderBg }}
                        aria-label="Zoom level"
                    />
                </div>

                {/* Action buttons */}
                <div className={styles.actions}>
                    <button className={styles.cancelBtn} onClick={onCancel} type="button">
                        Cancel
                    </button>
                    <button
                        className={styles.cropBtn}
                        onClick={handleConfirm}
                        disabled={saving || !croppedAreaPixels}
                        type="button"
                    >
                        {saving
                            ? <span className={styles.spinner} />
                            : (
                                <>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                    Crop & Save
                                </>
                            )
                        }
                    </button>
                </div>
            </div>
        </div>
    );

    return createPortal(modal, document.body);
}

/**
 * Hook to manage the "pick → crop → result" flow cleanly.
 * Usage:
 *   const { rawSrc, resultUrl, openPicker, confirm, cancel, fileInputRef } = useImageCropper(...)
 */
export function useImageCropper() {
    const [rawSrc, setRawSrc] = useState<string | null>(null);
    const [resultUrl, setResultUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const openPicker = () => fileInputRef.current?.click();

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        // Revoke previous raw URL to avoid memory leaks
        if (rawSrc) URL.revokeObjectURL(rawSrc);
        setRawSrc(URL.createObjectURL(file));
        // Reset input so same file can be re-selected
        e.target.value = '';
    };

    const confirm = (url: string) => {
        if (rawSrc) URL.revokeObjectURL(rawSrc);
        setRawSrc(null);
        setResultUrl(url);
    };

    const cancel = () => {
        if (rawSrc) URL.revokeObjectURL(rawSrc);
        setRawSrc(null);
    };

    const reset = () => {
        if (rawSrc) URL.revokeObjectURL(rawSrc);
        if (resultUrl) URL.revokeObjectURL(resultUrl);
        setRawSrc(null);
        setResultUrl(null);
    };

    return { rawSrc, resultUrl, openPicker, handleFile, confirm, cancel, reset, fileInputRef };
}
