import { useContext } from 'react';
import styles from './Header.module.css';
import MobileHeaderLogo from '../../../Components/MobilHeaderLogo/MobileHeaderLogo.jsx';
import { NavLink } from 'react-router-dom';
import { isLogedIn } from '../../../Services/common.jsx';
import { UserContext } from '../../../Services/userContext.jsx';
import { useTranslation } from 'react-i18next';

const Header = () => {
  const [t] = useTranslation();
  const { logout } = useContext(UserContext);

  return (
    <>
      {
        <header className={styles.header}>
          <div className={styles.headerWrapper}>
            <MobileHeaderLogo />
            <div className={styles.headerRight}>
              <div onClick={logout} className={styles.logout}>
                {t('logOut')}
              </div>
            </div>
          </div>
        </header>
      }
    </>
  );
};

export default Header;
