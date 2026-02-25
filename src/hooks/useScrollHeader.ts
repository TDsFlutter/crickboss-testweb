import { useState, useEffect } from 'react';

/**
 * Returns true when user has scrolled past `threshold` pixels.
 * Used to switch Header from transparent to solid/white.
 */
export function useScrollHeader(threshold = 60) {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handler = () => setScrolled(window.scrollY > threshold);
        window.addEventListener('scroll', handler, { passive: true });
        handler(); // initial check
        return () => window.removeEventListener('scroll', handler);
    }, [threshold]);

    return scrolled;
}
