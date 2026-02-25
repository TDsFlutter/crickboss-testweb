import styles from './PlaceholderPage.module.css';

interface Props { title: string; icon?: string; desc?: string; }

export default function PlaceholderPage({ title, icon = '🏏', desc }: Props) {
    return (
        <main id="main-content">
            <section className={`section bg-light ${styles.page}`}>
                <div className="container">
                    <div className={styles.center}>
                        <div className={styles.iconWrap}>{icon}</div>
                        <h1 className="h2">{title}</h1>
                        <p className={styles.desc}>{desc ?? 'This page is coming soon. Check back later!'}</p>
                    </div>
                </div>
            </section>
        </main>
    );
}
