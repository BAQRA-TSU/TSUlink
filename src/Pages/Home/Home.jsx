import styles from './Home.module.css';
import Feed from '../../Components/Feed/Feed';
import Sidebar from '../../Components/Sidebar/Sidebar';

const Home = () => {
  return (
    <div className={styles.gamesContainer}>
      <Sidebar />
      <div className={styles.mainContent}>
        <Feed />
      </div>
    </div>
  );
};

export default Home;
