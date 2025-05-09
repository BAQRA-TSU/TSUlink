import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import styles from './MobileGamesContainer.module.css';
import { crashGamesArray } from './crashGamesArray.js';
import { addToActivity, GetAccessToken, isLogedIn, RefreshToken, removeFromActivity } from '../../../Services/common';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckIcon, FavIconActive, FavIconInactive, NoResultsIcon, SearchIcon } from '../../../assets/svg/svg.jsx';
import { GetActivity, GetAviatorGames, GetGames } from '../../../Services/service.jsx';
import { UserContext } from '../../../Services/userContext.jsx';
import { useTranslation } from 'react-i18next';
import Popup from '../Popup/Popup.jsx';
import ProvidersComponent from '../Providers/Providers.jsx';
import { useNotificationPopup } from '../../../Services/notificationPopupProvider.jsx';
import PropTypes from 'prop-types';

const GamesContainer = ({ categoryName }) => {
  const [showFilters, setShowFilters] = useState(true);
  const [y, setY] = useState(window.scrollY);
  const [data, setData] = useState(null);
  const [favoritesData, setFavoritesData] = useState(null);
  const [showData, setShowData] = useState(null);
  const [gamesLoading, setGamesLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState(null);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [providerSortTypes, setProviderSortTypes] = useState([]);
  const [popularSortType, setPopularSortType] = useState('all');
  const [isPopularFilterOpen, setIsPopularFilterOpen] = useState(false);
  const [loadGamesNumber, setLoadGamesNumber] = useState(24);
  const { userData } = useContext(UserContext);
  const [t] = useTranslation();
  const scrollRef = useRef();
  const history = useNavigate();
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const location = useLocation();
  const [showHeader, setShowHeader] = useState(false);
  const { showSnackNotificationPopup } = useNotificationPopup();
  const { logout } = useContext(UserContext);

  const handleNavigation = useCallback(() => {
    const window = scrollRef.current;
    if (y > window.scrollTop) {
      setShowFilters(true);
      setY(window.scrollTop);
    } else if (y < window.scrollTop - 50) {
      setShowFilters(false);
      setY(window.scrollTop);
    }
  }, [y]);

  useEffect(() => {
    setY(scrollRef.current.scrollTop);
    const window = scrollRef.current;
    window.addEventListener('scroll', handleNavigation);

    return () => {
      window.removeEventListener('scroll', handleNavigation);
    };
  }, [handleNavigation]);
  // const isMobile = IsMobileBrowser();

  function getFromFavourite(tries = 0) {
    if (isLogedIn()) {
      const accessToken = GetAccessToken();
      if (accessToken) {
        GetActivity(accessToken, 'favourite')
          .then((response) => {
            setFavoritesData(response.data);
          })
          .catch((error) => {
            if (error.response && error.response.status === 403) {
              RefreshToken().then((resp) => {
                if (!resp) {
                  logout();
                } else {
                  if (tries < 4) {
                    getFromFavourite(tries + 1);
                  } else {
                    logout();
                  }
                }
              });
            }
          });
      } else {
        logout();
      }
    } else {
      logout();
    }
  }

  useEffect(() => {
    const storedProviderSort = JSON.parse(sessionStorage.getItem('providerSortTypes'));
    const storedPopularSort = JSON.parse(sessionStorage.getItem('popularSortTypes'));
    if (storedPopularSort) setPopularSortType(storedPopularSort);
    if (categoryName === 'Crash') {
      GetAviatorGames()
        .then((response) => {
          setData([...response.data, ...crashGamesArray]);
          setShowData([...response.data, ...crashGamesArray]);
        })
        .finally(() => {
          setGamesLoading(false);
        })
    } else {
      setGamesLoading(true);
      if (storedProviderSort && storedProviderSort.length > 0) {
        setProviderSortTypes(storedProviderSort);
        GetGames(0, -1, storedPopularSort) //categoryName
          .then((response) => {
            setData(response.data.games.filter((game) => storedProviderSort.includes(game.provider)));
            setTotalCount(response.data.games.filter((game) => storedProviderSort.includes(game.provider)).length);
            setShowData(
              response.data.games.filter((game) => storedProviderSort.includes(game.provider)).slice(0, loadGamesNumber)
            );
            setGamesLoading(false);
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        GetGames(0, -1, storedPopularSort ? storedPopularSort : 'all') //categoryName
          .then((response) => {
            setData(response.data.games);
            setTotalCount(response.data.totalCount);
            setShowData(response.data.games.slice(0, loadGamesNumber));
            setGamesLoading(false);
          })
          .catch(() => {});
      }
    }
    if (isLogedIn()) {
      getFromFavourite();
    }
  }, []);

  useEffect(() => {
    const wrapperElement = scrollRef.current;
    const handleEvent = (event) => {
      if (
        Math.round(event.target.scrollTop + event.target.offsetHeight) + 5 >= Math.round(event.target.scrollHeight) &&
        !search
      ) {
        const newLoadingGameNumber = loadGamesNumber + 24;
        if (newLoadingGameNumber < totalCount - 1) {
          setShowData([...showData, ...data.slice(loadGamesNumber, newLoadingGameNumber)]);
        } else if (loadGamesNumber <= totalCount) {
          setShowData([...showData, ...data.slice(loadGamesNumber, totalCount)]);
        }
        setLoadGamesNumber(newLoadingGameNumber);
      }
    };
    wrapperElement.addEventListener('scroll', handleEvent);
    return () => wrapperElement.removeEventListener('scroll', handleEvent);
  }, [showData]);

  useEffect(() => {
    if (data) {
      setShowData(
        data.filter((element) => {
          if (search) {
            return element.name.toLowerCase().includes(search.toLowerCase());
          } else {
            return true;
          }
        })
      );
    }
  }, [search]);

  useEffect(() => {
    if (location.pathname === '/game') {
      setShowHeader(false);
    } else {
      setShowHeader(true);
    }
  }, [location]);

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

  function addToFav(id) {
    if (isLogedIn()) {
      if (!favoritesData.find((game) => game.id === id)) {
        addToActivity(id, 'favourite')
          .then((resp) => {
            if (resp === false) {
              showSnackNotificationPopup({ status: 'FAILED', text: 'Add to activity failed' });
              return;
            }
            getFromFavourite();
            showSnackNotificationPopup({ status: 'COMPLETED', text: t('game.added.to.fav') });
          })
          .catch((error) => {
            if (error.message === 'UNAUTHORIZED') {
              logout();
            } else {
              showSnackNotificationPopup({ status: 'FAILED', text: error.message });
            }
          });
      } else {
        removeFromActivity(id)
          .then((resp) => {
            if (resp === false) {
              showSnackNotificationPopup({ status: 'FAILED', text: 'Remove from activity failed' });
              return;
            }
            getFromFavourite();
            showSnackNotificationPopup({ status: 'COMPLETED', text: t('game.removed.from.fav') });
          })
          .catch((error) => {
            if (error.message === 'UNAUTHORIZED') {
              logout();
            } else {
              showSnackNotificationPopup({ status: 'FAILED', text: error.message });
            }
          });
      }
    }
  }

  function sortByProvider(providers) {
    scrollRef.current.scrollTo(0, 1);
    setPopularSortType('all');
    sessionStorage.setItem('popularSortTypes', JSON.stringify('all'));
    setGamesLoading(true);
    if (providers.length !== 0) {
      setProviderSortTypes(providers);
      sessionStorage.setItem('providerSortTypes', JSON.stringify(providers));
      GetGames(0, -1, 'all') //categoryName
        .then((response) => {
          setData(response.data.games.filter((game) => providers.includes(game.provider)));
          setTotalCount(response.data.games.filter((game) => providers.includes(game.provider)).length);
          setShowData(
            response.data.games.filter((game) => providers.includes(game.provider)).slice(0, loadGamesNumber)
          );
          setGamesLoading(false);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setProviderSortTypes([]);
      sessionStorage.setItem('providerSortTypes', JSON.stringify([]));
      GetGames(0, -1, 'all') //categoryName
        .then((response) => {
          setData(response.data.games);
          setTotalCount(response.data.totalCount);
          setShowData(response.data.games.slice(0, loadGamesNumber));
          setGamesLoading(false);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  function sortByPopular(sortType) {
    scrollRef.current.scrollTo(0, 1);
    setPopularSortType(sortType);
    setProviderSortTypes([]);
    sessionStorage.setItem('popularSortTypes', JSON.stringify(sortType));
    sessionStorage.setItem('providerSortTypes', JSON.stringify([]));
    setGamesLoading(true);
    GetGames(0, -1, sortType) //categoryName
      .then((response) => {
        setData(response.data.games);
        setTotalCount(response.data.totalCount);
        setShowData(response.data.games.slice(0, loadGamesNumber));
        setGamesLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <>
      <div ref={scrollRef} className={styles.gamesContainer + ' ' + (!showHeader ? styles.dontShowHeader : '')}>
        {showFilters && (
          <div
            className={
              styles.gamesHeader +
              ' ' +
              (showSearchBar ? styles.searchActive : '') +
              ' ' +
              (categoryName === 'Crash' ? styles.hide : '')
            }
          >
            {!showSearchBar ? (
              <div
                onClick={() => {
                  setIsPopupVisible(true);
                  setIsPopularFilterOpen(false);
                }}
                className={styles.gamesHeaderItem}
              >
                {t('providers')}{' '}
                {providerSortTypes.length > 0 && (
                  <div className={styles.providerAmountDiv}>{providerSortTypes.length}</div>
                )}
              </div>
            ) : (
              <></>
            )}
            <div className={styles.searchContainer + ' ' + (showSearchBar ? styles.searchActive : '')}>
              <input
                type={'text'}
                placeholder={t('search')}
                onChange={(event) => {
                  setSearch(event.currentTarget.value);
                }}
                onFocus={() => {
                  setShowSearchBar(true);
                  setIsPopularFilterOpen(false);
                }}
                className={
                  !showSearchBar ? styles.gamesHeaderSearch + ' ' + styles.gamesHeaderItem : styles.bigSearchBar
                }
              ></input>
              <span className={styles.gamesSearchIcon}>
                <SearchIcon />
              </span>
            </div>
            {!showSearchBar ? (
              <div className={styles.gamesHeaderItem} onClick={() => setIsPopularFilterOpen(!isPopularFilterOpen)}>
                {t(popularSortType)}
              </div>
            ) : (
              <div
                className={styles.gamesSearhCancel}
                onClick={(event) => {
                  event.target.parentNode.childNodes[0].childNodes[0].value = '';
                  setShowSearchBar(false);
                  setSearch(null);
                }}
              >
                Cancel
              </div>
            )}
            {isPopularFilterOpen && (
              <div className={styles.popularFilterWrapper}>
                <div className={styles.popularFilterElemetn} onClick={() => sortByPopular('all')}>
                  <p>{t('all')}</p> {popularSortType === 'all' && <CheckIcon />}
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" width="168" height="2" viewBox="0 0 168 2" fill="none">
                  <path d="M0 1H168" stroke="#494949" strokeWidth="0.3" />
                </svg>
                <div className={styles.popularFilterElemetn} onClick={() => sortByPopular('popular')}>
                  <p>{t('popular')}</p> {popularSortType === 'popular' && <CheckIcon />}
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" width="168" height="2" viewBox="0 0 168 2" fill="none">
                  <path d="M0 1H168" stroke="#494949" strokeWidth="0.3" />
                </svg>
                <div className={styles.popularFilterElemetn} onClick={() => sortByPopular('new')}>
                  <p>{t('new')}</p> {popularSortType === 'new' && <CheckIcon />}
                </div>
              </div>
            )}
          </div>
        )}
        <div
          className={
            styles.gamesWrapper +
            ' ' +
            (showSearchBar ? styles.searchActive : '') +
            ' ' +
            (categoryName === 'Crash' ? styles.crash : '')
          }
        >
          {showData && !gamesLoading && showData.length > 0 ? (
            showData.map((item) => (
              <div
                key={item.id}
                className={
                  styles.gameItemWraper +
                  ' ' +
                  (item.active === 'true' ? '' : styles.disabled) +
                  ' ' +
                  (categoryName === 'Crash' ? styles.crash : '')
                }
              >
                <div id={item.id} className={styles.gameItem}>
                  <img
                    onClick={() => openGameCaller(item.id, item.openMode)}
                    className={styles.img}
                    src={item.thumbnail}
                    alt={item.name}
                  />
                  {favoritesData && !(categoryName === 'Crash') && (
                    <div onClick={() => addToFav(item.id)} className={styles.favIcon}>
                      {favoritesData.find((game) => game.id === item.id) ? <FavIconActive /> : <FavIconInactive />}
                    </div>
                  )}
                  <div
                    onClick={() => openGameCaller(item.id, item.openMode)}
                    className={styles.gameTitleContainer}
                  >
                    {/* <div className={styles.gameTitle}>
											{item.name}
										</div> */}
                    <div
                      className={
                        styles.gameTitle +
                        ' ' +
                        styles.provider +
                        ' ' +
                        (categoryName === 'Crash' ? styles.commingSoon : '')
                      }
                    >
                      {item.provider}
                    </div>
                  </div>
                </div>
                <div className={styles.onlinePlayer + ' ' + (categoryName === 'Crash' ? styles.hide : '')}>
                  <span className={styles.onlineCircle}></span> {/*item.onlinePlayer*/ 25} {t('playing')}
                </div>
              </div>
            ))
          ) : (
            <div className={styles.noResultContainer}>
              {gamesLoading ? (
                "..."
              ) : (
                <>
                  <NoResultsIcon />
                  <div>
                    <h1 className={styles.noResultHeader}>{t('no.result.found')}</h1>
                    <p className={styles.noResultText}>{t('try.other.seearch')}</p>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
      {isPopupVisible && (
        <Popup header={'providers'} hidePopup={setIsPopupVisible}>
          <ProvidersComponent
            hidePopup={setIsPopupVisible}
            providerSortTypes={providerSortTypes}
            sortByProvider={sortByProvider}
          />
        </Popup>
      )}
    </>
  );
};

export default GamesContainer;

GamesContainer.propTypes = {
  categoryName: PropTypes.string, // Name of the game category (e.g., "Crash")
};
