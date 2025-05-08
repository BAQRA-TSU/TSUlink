import { useContext, useEffect, useRef, useState } from 'react';
import styles from './Home.module.css';
import { NavLink, useNavigate } from 'react-router-dom';
import { isLogedIn } from '../../../Services/common';
import { useTranslation } from 'react-i18next';
import { GetGames } from '../../../Services/service';
import { UserContext } from '../../../Services/userContext';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import Loader from '../../../assets/images/loader-setanta.json';
import FooterComponenet from '../../../Components/Mobile/Footer/Footer';
import 'swiped-events';
import Popup from '../../../Components/Mobile/Popup/Popup';

const Home = () => {
  const [homePageGames, setHomePageGames] = useState(null);
  const [t] = useTranslation();
  const history = useNavigate();
  const { userData } = useContext(UserContext);
  const [firstLoad, setFirstLoad] = useState(true);
  const [loader, setLoader] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isLoaded, setIsload] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const containerRef = useRef(null);
  const { logout } = useContext(UserContext);

  useEffect(() => {
    if (document.readyState === 'complete') {
      setFirstLoad(false);
      setLoading(false);
    } else {
      const handleBundleLoad = () => {
        setFirstLoad(false);
        setLoading(false);
      };
      window.addEventListener('load', handleBundleLoad);
      return () => {
        window.removeEventListener('load', handleBundleLoad);
      };
    }

    const storedGames = sessionStorage.getItem('homePageGames');
    if (storedGames) {
      setHomePageGames(JSON.parse(storedGames));
      setLoader(false);
    } else {
      // Fetch data only if not already stored in sessionStorage
      GetGames(0, -1, 'home')
        .then((response) => {
          setHomePageGames(response.data.games);
          sessionStorage.setItem('homePageGames', JSON.stringify(response.data.games));
        })
        .catch((err) => {
          console.error('Error fetching games:', err);
        })
        .finally(() => setLoader(false));
    }

    const handleSwipe = (e) => {
      if (e.detail.dir === 'up') {
        setIsPopupVisible(true);
      }
    };

    document.addEventListener('swiped-up', handleSwipe);
    document.addEventListener('swiped-down', handleSwipe);

    return () => {
      document.removeEventListener('swiped-up', handleSwipe);
      document.removeEventListener('swiped-down', handleSwipe);
    };
  }, []);

  useEffect(() => {
    setLoader(false);
  }, [loader]);

  useEffect(() => {
    if (firstLoad) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [firstLoad]);

  useEffect(() => {
    if (userData) {
      if (isLogedIn() && !userData.verified) {
        history('/verify');
      }
      if (userData.withdrawalOnlyBlock === true) {
        history('/withdrawal');
      }
    }
  }, [userData]);

  function openGameCaller(gameUid, openMode) {
    if (isLogedIn()) {
      if (userData && userData.verified) {
        history(
          `/game?&GameUid=${gameUid}&OpenMode=${openMode}`
        );
      } else {
        history('/');
      }
    } else {
      logout();
    }
  }

  return (
    <>
      {loader || loading ? (
        isLoaded && <DotLottieReact onLoad={() => setIsload(true)} data={Loader} loop={true} autoplay={true} />
      ) : (
        <div ref={containerRef} className={styles.gamesContainer}>
          <div className={styles.gamesWrapper}>
            <NavLink to={'/crashGames'} className={styles.crashGameComponent}>
              <div className={styles.gameTitle}>{t('crash')}</div>
              <div className={styles.crashGameImg}> </div>
            </NavLink>
            <NavLink to={'/slots'} className={styles.SlotsComponent}>
              <div className={styles.gameTitle}>{t('slots')}</div>
              <div className={styles.slotsImg}> </div>
            </NavLink>
            <div className={styles.gamesRow}>
              <div
                onClick={() =>
                  homePageGames &&
                  homePageGames[0] &&
                  openGameCaller(
                    homePageGames[0].gameId,
                    homePageGames[0].id,
                    homePageGames[0].openMode,
                    homePageGames[0].portalCode,
                    homePageGames[0].provider
                  )
                }
                className={styles.rouletteComponent}
              >
                <div className={styles.rowGameTitle}>{homePageGames && homePageGames[0] && homePageGames[0].name}</div>
                {homePageGames && homePageGames[0] && (
                  <div className={styles.rouletteImgDiv}>
                    {' '}
                    {/*<img className={styles.rouletteImg} src={homePageGames[0].thumbnail} alt={homePageGames[0].name} />*/}
                    <div className={styles.rouletteImg}></div>
                  </div>
                )}
              </div>
              {/* <div onClick={()=>homePageGames && homePageGames[1] && openGameCaller(homePageGames[1].gameId, homePageGames[1].id ,homePageGames[1].openMode, homePageGames[1].portalCode, homePageGames[1].provider)} className={styles.aviatorComponent}> */}
              <div
                onClick={() =>
                  openGameCaller(
                    '2ba752c6-c1eb-4a4d-a7de-75d73b20254c',
                    '',
                  )
                }
                className={styles.aviatorComponent}
              >
                <div className={styles.aviatorImage}></div>
                <div className={styles.aviatorText}></div>
              </div>
            </div>
            <div className={styles.gamesRow}>
              <NavLink to={'https://setantasports.com/'} target="_blank" className={styles.setantaComponent}>
                <div className={styles.setantaImg}> </div>
                <div className={styles.rowLive}>{t('live')}</div>
                <div className={styles.rowGameTitle}>Setanta Sports</div>
              </NavLink>
              <NavLink to={'/roulette'} className={styles.promoComponent}>
                <div className={styles.promoImg}> </div>
                <div className={styles.rowGameTitle}>{t('promotions')}</div>
              </NavLink>
            </div>
          </div>
        </div>
      )}
      {isPopupVisible && (
        <Popup header={''} hidePopup={setIsPopupVisible}>
          <FooterComponenet />
        </Popup>
      )}
    </>
  );
};

export default Home;
