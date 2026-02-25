import { useEffect, useRef } from 'react';

/**
 * Triggers IntersectionObserver on an element ref.
 * Adds 'visible' class when intersecting for CSS fade-up animations.
 */
export function useIntersection<T extends HTMLElement>(threshold = 0.15) {
    const ref = useRef<T>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { el.classList.add('visible'); observer.disconnect(); } },
            { threshold }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [threshold]);

    return ref;
}
