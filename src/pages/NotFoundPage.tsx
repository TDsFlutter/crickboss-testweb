import { Link } from 'react-router-dom';
import styles from './NotFoundPage.module.css';

export default function NotFoundPage() {
    return (
        <main id="main-content">
            <section className={`section bg-light ${styles.page}`}>
                <div className="container">
                    <div className={styles.center}>
                        <div className={styles.code}>404</div>
                        <h1 className="h3">Page Not Found</h1>
                        <p className={styles.desc}>The page you're looking for doesn't exist or has been moved.</p>
                        <Link to="/" className={styles.cta}>← Back to Home</Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
