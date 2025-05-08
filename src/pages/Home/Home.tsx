import styles from './Home.module.css';

const Home = () => {
    return (
        <div className={styles.homeContainer}>
            <header className={styles.navigationBar}>
                <h1>TSUlink</h1>
                <nav>
                    <ul>
                        <li>Home</li>
                        <li>Profile</li>
                        <li>Messages</li>
                        <li>Settings</li>
                    </ul>
                </nav>
            </header>
            <div className={styles.content}>
                <aside className="categories">
                    <h2>Categories</h2>
                    <ul>
                        <li>Technology</li>
                        <li>Science</li>
                        <li>Art</li>
                        <li>Sports</li>
                    </ul>
                </aside>
                <main className="feed">
                    <h2>Feed</h2>
                    <div className="post">Post 1</div>
                    <div className="post">Post 2</div>
                    <div className="post">Post 3</div>
                </main>
                <aside className="people">
                    <h2>People</h2>
                    <ul>
                        <li>John Doe</li>
                        <li>Jane Smith</li>
                        <li>Bob Johnson</li>
                    </ul>
                </aside>
            </div>
        </div>
    );
};

export default Home;