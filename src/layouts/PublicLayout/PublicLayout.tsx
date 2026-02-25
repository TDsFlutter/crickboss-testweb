import { Outlet } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import TopBar from '../../components/TopBar/TopBar';
import BackToTop from '../../components/BackToTop/BackToTop';
import styles from './PublicLayout.module.css';

export default function PublicLayout() {
    return (
        <div className={styles.layout}>
            <a href="#main-content" className="skip-link">Skip to main content</a>
            <TopBar />
            <Header />
            <main id="main-content" className={styles.main}>
                <Outlet />
            </main>
            <Footer />
            <BackToTop />
        </div>
    );
}
