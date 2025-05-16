import { useContext, useEffect, useState } from 'react';
import styles from './Header.module.css';
import MobileHeaderLogo from '../../../Components/MobilHeaderLogo/MobileHeaderLogo.jsx';
import { NavLink } from 'react-router-dom';
import { isLogedIn } from '../../../Services/common.jsx';
import { UserContext } from '../../../Services/userContext.jsx';
import { useTranslation } from 'react-i18next';
import { BellIcon, UnverifiedIcon, VerifPendingIcon, VerifiedIcon } from '../../../assets/svg/svg.jsx';

const Header = () => {
  const [t] = useTranslation();
  const [showVeriff, setShowVeriff] = useState();
  const { userData } = useContext(UserContext);
  const [deferredPrompt, setDeferredPrompt] = useState(false);
  const [installable, setInstallable] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      setDeferredPrompt(e);
      setInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      setDeferredPrompt(null);
      setInstallable(false);
    }
  };

  useEffect(() => {
    if (userData) {
      if (isLogedIn()) {
        setShowVeriff(!userData.verified);
      }
    }
  }, [userData]);

  return (
    <>
      {
        <header className={styles.header}>
          <div className={styles.headerWrapper}>
            <MobileHeaderLogo />
            {installable && <div onClick={handleInstallClick}>{t('header.install')}</div>}
            {isLogedIn() ? (
              <>
                {/* <div onClick={changeVeriff} className={styles.verify}>VERIFY</div> */}
                <div className={styles.headerRight}>
                  {userData && userData.notificationCount > 0 && (
                    <NavLink to={'/menu/notifications'} className={styles.notificationCount}>
                      <BellIcon />
                      <div className={styles.count}>{userData.notificationCount}</div>
                    </NavLink>
                  )}
                  <NavLink to={'/menu'} className={styles.burgerIconWrapper}>
                    <div className={styles.burgerMenuAvatarContainer}>
                      {userData && userData.avatar ? (
                        <img
                          alt="profile-avatar"
                          src={`./avatars/avatar${userData.avatar}.png`}
                          className={styles.burgerMenuAvatar}
                        ></img>
                      ) : (
                        <div className={styles.burgerMenuAvatar}></div>
                      )}
                      {/* <div className={styles.burgerMenuNotification}>12</div>   */}
                      <div className={styles.verifIcon}>
                        {' '}
                        {showVeriff !== undefined &&
                          (showVeriff === true ? (
                            userData.pending ? (
                              <VerifPendingIcon />
                            ) : (
                              <UnverifiedIcon />
                            )
                          ) : (
                            <VerifiedIcon />
                          ))}
                      </div>
                    </div>
                    <div className={styles.burgerMenuIcon}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M16.6667 16.6667H3.33333C2.87333 16.6667 2.5 16.2942 2.5 15.8333C2.5 15.3725 2.87333 15 3.33333 15H16.6667C17.1267 15 17.5 15.3725 17.5 15.8333C17.5 16.2942 17.1267 16.6667 16.6667 16.6667Z"
                          fill="white"
                        />
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M16.6667 5H3.33333C2.87333 5 2.5 4.6275 2.5 4.16667C2.5 3.70583 2.87333 3.33333 3.33333 3.33333H16.6667C17.1267 3.33333 17.5 3.70583 17.5 4.16667C17.5 4.6275 17.1267 5 16.6667 5Z"
                          fill="white"
                        />
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M16.6667 10.8333H3.33333C2.87333 10.8333 2.5 10.4608 2.5 10C2.5 9.53916 2.87333 9.16666 3.33333 9.16666H16.6667C17.1267 9.16666 17.5 9.53916 17.5 10C17.5 10.4608 17.1267 10.8333 16.6667 10.8333Z"
                          fill="white"
                        />
                      </svg>
                    </div>
                  </NavLink>
                </div>
              </>
            ) : (
              <NavLink to={'/login'} className={styles.signIn}>
                {t('signIn')}
              </NavLink>
            )}
          </div>
        </header>
      }
    </>
  );
};

export default Header;
