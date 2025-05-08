import { useContext, useEffect, useState } from 'react';
import styles from './Favorites.module.css';
import { GetAccessToken, isLogedIn, RefreshToken, removeFromActivity } from '../../../Services/common';
import { GetActivity } from '../../../Services/service';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../../Services/userContext';
import { useTranslation } from 'react-i18next';
import { FavIconActive } from '../../../assets/svg/svg';
import { useNotificationPopup } from '../../../Services/notificationPopupProvider';

const FavoritesComponent = () => {
  const [t] = useTranslation();
  const history = useNavigate();
  const [data, setData] = useState(null);
  const { userData } = useContext(UserContext);
  const { showSnackNotificationPopup } = useNotificationPopup();
  const { logout } = useContext(UserContext);

  useEffect(() => {
    getFromFavourite();
  }, []);

  function getFromFavourite(tries = 0) {
    if (isLogedIn()) {
      const accessToken = GetAccessToken();
      if (accessToken) {
        GetActivity(accessToken, 'favourite')
          .then((response) => {
            setData(response.data);
            // window.open(resp.data.redirectUrl,'_blank')
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

  function removeFromFav(id) {
    removeFromActivity(id)
      .then(() => {
        getFromFavourite();
        showSnackNotificationPopup({ status: 'COMPLETED', text: t('game.removed.from.fav') });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <div className={styles.gamesWrapper}>
      {data &&
        data.map((item) => (
          <div key={item.id} className={styles.gameItemWraper + ' ' + (item.active ? '' : styles.disabled)}>
            <div id={item.id} className={styles.gameItem}>
              <img
                onClick={() => openGameCaller(item.id, item.openMode)}
                className={styles.img}
                src={item.thumbnail}
                alt={item.name}
              />
              <div onClick={() => removeFromFav(item.id)} className={styles.favIcon}>
                <FavIconActive />
              </div>
              <div
                onClick={() => openGameCaller(item.id, item.openMode)}
                className={styles.gameTitleContainer}
              >
                <div className={styles.gameTitle + ' ' + styles.provider}>{item.provider}</div>
              </div>
            </div>
            <div className={styles.onlinePlayer}>
              <span className={styles.onlineCircle}></span> {/*item.onlinePlayer*/ 25} {t('playing')}
            </div>
          </div>
        ))}
    </div>
  );
};

export default FavoritesComponent;
