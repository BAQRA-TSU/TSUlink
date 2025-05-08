import { useContext, useEffect, useState } from 'react';
import styles from './Menu.module.css';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { editUserInfo } from '../../../../Services/common';
import {
  CloseCircleIcon,
  EyeIcon,
  PersonalInfoIcon,
  SecurityInfoIcon,
  TransactionsIcon,
  WalletIcon,
  NotificationsIcon,
  RightArrow,
  EyeOffIcon,
  VerifiedIcon,
  UnverifiedIcon,
  EditIcon,
  FlagEn,
  FlagRus,
  FlagGeo,
  GearIcon,
} from '../../../../assets/svg/svg';
import { UserContext } from '../../../../Services/userContext';
import MobileHeaderLogo from '../../../../Components/Mobile/MobilHeaderLogo/MobileHeaderLogo';
import Popup from '../../../../Components/Mobile/Popup/Popup';
import AvatarsComponent from '../../../../Components/Mobile/Avatars/Avatars';
import { useNotificationPopup } from '../../../../Services/notificationPopupProvider';

const Menu = () => {
  const [t, i18n] = useTranslation();
  const [lang, setLang] = useState(i18n.language);
  const [data, setData] = useState({ userName: '', id: null, verified: false });
  const [localWallet, setLocalWallet] = useState({
    currencySymbol: '₾',
    currceny: 'GEL',
    balance: 0,
    showBalance: false,
  });
  const { userData, setUserData } = useContext(UserContext);
  const { wallet, setWallet } = useContext(UserContext);
  const { logout } = useContext(UserContext);
  const [showAvatarSelect, setShowAvatarSelect] = useState();
  const { showSnackNotificationPopup } = useNotificationPopup();
  const [isWithdrawOnlyBlock, setIsWithdrawOnlyBlock] = useState();

  useEffect(() => {
    if (userData && userData.withdrawalOnlyBlock === true) {
      setIsWithdrawOnlyBlock(true);
    }
  }, [userData]);

  let history = useNavigate();

  function formatNumberWithDots(number) {
    return number
      .toFixed(2)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  useEffect(() => {
    if (userData) {
      setData({ userName: userData.username, id: userData.playerId, verified: userData.verified });
    }
  }, [userData]);

  useEffect(() => {
    if (wallet) {
      setLocalWallet(wallet);
    }
  }, [wallet]);

  function langChange(params) {
    i18n.changeLanguage(params.target.value);
    localStorage.setItem('i18nextLng', params.target.value);
    setLang(params.target.value);
  }

  function selectAvatar(avatar) {
    editUserInfo('avatar', Number(avatar))
      .then((resp) => {
        if (resp === false) {
          showSnackNotificationPopup({ status: 'FAILED', text: 'Edit failed' });
          return;
        }
        setUserData({ ...userData, avatar: avatar });
      })
      .catch((error) => {
        if (error.message === 'UNAUTHORIZED') {
          logout();
        } else {
          showSnackNotificationPopup({ status: 'FAILED', text: error.message });
        }
      });
  }
  return (
    data && (
      <>
        <div className={styles.menuWrapper}>
          <div className={styles.menuHeader}>
            <div className={styles.menuHeaderTop}>
              <MobileHeaderLogo />
              <div onClick={() => history('/')} className={styles.closeMenu}>
                <CloseCircleIcon />
              </div>
            </div>
            <div className={styles.menuHeaderInfo}>
              <div className={styles.menuHeaderUserInfo}>
                <div className={styles.menuHeaderLeft}>
                  <div className={styles.name}>
                    {t('hey')}, {data.userName}
                  </div>
                  <div className={styles.id}>
                    {data.verified ? <VerifiedIcon /> : <UnverifiedIcon />}ID: {data.id}
                  </div>
                </div>
                <div
                  onClick={() => {
                    setShowAvatarSelect(true);
                  }}
                  className={styles.avatarDiv}
                >
                  {userData && userData.avatar ? (
                    <img
                      alt="profile-avatar"
                      src={`./avatars/avatar${userData.avatar}.png`}
                      className={styles.burgerMenuAvatar}
                    ></img>
                  ) : (
                    ''
                  )}
                  <span className={styles.editButton}>
                    <EditIcon />
                  </span>
                </div>
              </div>
              <div className={styles.balanceContainer}>
                <div className={styles.balanceFirstRow}>
                  <div className={styles.balanceFirstRowTop}>
                    <div className={styles.balanceFirstRowTitle}>{t('balance')}</div>
                    <div
                      className={styles.eyeDiv}
                      onClick={() => {
                        wallet && setWallet({ ...wallet, showBalance: !wallet.showBalance });
                      }}
                    >
                      {localWallet.showBalance ? <EyeIcon /> : <EyeOffIcon />}
                    </div>
                  </div>
                  <div className={styles.moneyAmount}>
                    {localWallet.showBalance
                      ? localWallet.currencySymbol + ' ' + formatNumberWithDots(localWallet.balance / 100)
                      : '****'}
                  </div>
                </div>
                <div className={styles.balanceSecondRow}>
                  <NavLink
                    className={
                      styles.depositButton +
                      ' ' +
                      (!data.verified ? styles.disabled : '') +
                      (isWithdrawOnlyBlock ? ' ' + styles.disabled : '')
                    }
                    to={'/deposit'}
                  >
                    {t('deposit')}
                  </NavLink>
                </div>
              </div>
            </div>
          </div>
          <p className={styles.categoryTitle}>{t('garage')}</p>
          <div className={styles.categoryContainer}>
            <NavLink
              className={styles.categoryItem + ' ' + (!data.verified ? styles.disabled : '')}
              to={'/withdrawal'}
            >
              <WalletIcon />
              <p className={styles.myGarageItemTitle}>{t('withdrawal')}</p>
              <RightArrow />
            </NavLink>
            {/* <NavLink className={styles.categoryItem + " " + (!data.verified? styles.disabled : "")} to={'/loyalty'}>
              <LoyaltyIcon/>
              <p className={styles.myGarageItemTitle}>{t("loyalty")}</p></NavLink>
            <NavLink className={styles.categoryItem + " " + (!data.verified? styles.disabled : "")} to={'/activity'}>
              <FavoritesIcon/>
              <p className={styles.myGarageItemTitle}>{t("recent.favorites")}</p></NavLink> */}
            {/* <NavLink className={styles.categoryItem}><span className={styles.myGarageItemIcon + " " + styles.inviteImg}></span> <p className={styles.myGarageItemTitle}>Invite a Friend</p></NavLink> */}
            {/* <NavLink className={styles.categoryItem} to={'/notifications'}><span className={styles.myGarageItemIcon + " " + styles.notificationsImg}></span> <p className={styles.myGarageItemTitle}>Notifications</p></NavLink> */}
            <NavLink
              className={
                styles.categoryItem +
                ' ' +
                (!data.verified ? styles.disabled : '') +
                (isWithdrawOnlyBlock ? ' ' + styles.disabled : '')
              }
              to={'/menu/transaction'}
            >
              <TransactionsIcon />
              <p className={styles.myGarageItemTitle}>{t('transactions')}</p>
              <RightArrow />
            </NavLink>
            <NavLink
              className={
                styles.categoryItem +
                ' ' +
                (!data.verified ? styles.disabled : '') +
                (isWithdrawOnlyBlock ? ' ' + styles.disabled : '')
              }
              to={'/menu/notifications'}
            >
              <NotificationsIcon />
              <p className={styles.myGarageItemTitle}>{t('notifications')}</p>
              <RightArrow />
            </NavLink>
          </div>
          <p className={styles.categoryTitle}>{t('acc.security')}</p>
          <div className={styles.categoryContainer}>
            <NavLink
              className={styles.categoryItem + (isWithdrawOnlyBlock ? ' ' + styles.disabled : '')}
              to={'/menu/configurations'}
            >
              <GearIcon />
              <p className={styles.myGarageItemTitle}>{t('configurations')}</p>
              <RightArrow />
            </NavLink>
            <NavLink
              className={styles.categoryItem + (isWithdrawOnlyBlock ? ' ' + styles.disabled : '')}
              to={'/menu/personal-info'}
            >
              <PersonalInfoIcon />
              <p className={styles.myGarageItemTitle}>{t('personal.info')}</p>
              <RightArrow />
            </NavLink>
            <NavLink
              className={styles.categoryItem + (isWithdrawOnlyBlock ? ' ' + styles.disabled : '')}
              to={'/menu/security'}
            >
              <SecurityInfoIcon />
              <p className={styles.myGarageItemTitle}>{t('security.privacy')}</p>
              <RightArrow />
            </NavLink>
            <NavLink className={styles.categoryItem} to={'/menu/loginHistory'}>
              <TransactionsIcon />
              <p className={styles.myGarageItemTitle}>{t('login.history')}</p>
              <RightArrow />
            </NavLink>
          </div>
          <p className={styles.categoryTitle}>{t('other')}</p>
          <NavLink className={styles.categoryItem} to={'/footer/termsAndConditions'}>
            {/* <TransactionsIcon/> */}
            <p className={styles.myGarageItemTitle}>{t('terms.conditions')}</p>
            <RightArrow />
          </NavLink>
          <div className={styles.languageContainer}>
            <div className={styles.flagDiv}>
              {lang === 'en' ? <FlagEn /> : ''}
              {lang === 'ru' ? <FlagRus /> : ''}
              {lang === 'ka' ? <FlagGeo /> : ''}
            </div>
            <p className={styles.placeHolder}>{t('language')}</p>
            <span className={styles.rightArrow}>
              <RightArrow />
            </span>
            <select
              onChange={(el) => {
                langChange(el);
              }}
              value={lang}
              className={styles.categoryItem + ' ' + styles.language}
              name="language"
              id="language"
            >
              <option value="en" label="English"></option>
              <option value="ka" label="ქართული"></option>
              <option value="ru" label="русский"></option>
            </select>
          </div>
          {/* <NavLink className={styles.categoryItem} to={'/security'}>
              <SecurityInfoIcon/>
              <p className={styles.myGarageItemTitle}>{t("security.privacy")}</p></NavLink> */}
          <div onClick={logout} className={styles.logout}>
            {t('logOut')}
          </div>
        </div>
        {showAvatarSelect && (
          <Popup hidePopup={setShowAvatarSelect} header={'change.avatar'}>
            <AvatarsComponent
              hidePopup={setShowAvatarSelect}
              selectedAvatar={userData.avatar}
              selectAvatar={selectAvatar}
            />
          </Popup>
        )}
      </>
    )
  );
};

export default Menu;
