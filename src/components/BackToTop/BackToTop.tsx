import { useEffect, useState } from 'react';
import { MdKeyboardArrowUp } from 'react-icons/md';
import styles from './BackToTop.module.css';

export default function BackToTop() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const onScroll = () => setVisible(window.scrollY > 400);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

    return (
        <button
            className={`${styles.btn} ${visible ? styles.visible : ''}`}
            onClick={scrollToTop}
            aria-label="Back to top"
            title="Back to top"
        >
            <MdKeyboardArrowUp size={24} />
        </button>
    );
}
