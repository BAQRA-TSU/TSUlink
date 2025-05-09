import { useContext, useEffect, useRef, useState } from 'react';
import styles from './Loyalty.module.css';
import { UserContext } from '../../../Services/userContext';
import { isLogedIn } from '../../../Services/common';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ClockClose, LeftArrow, LoginIcon, RightArrow } from '../../../assets/svg/svg';
import Rules from './parts/rules/rules';
import Progress from './parts/progress/progress';
import History from './parts/history/history';
import Popup from '../../../Components/Mobile/Popup/Popup';
import DateFilter from '../../../Components/Mobile/DateFilter/DateFilter';
import CashbackCard from './parts/cashbackCard/cashbackCard';
import { GetLoyaltyList } from '../../../Services/service';

const LoyaltyPage = () => {
  const { userData } = useContext(UserContext);
  const history = useNavigate();
  const [t] = useTranslation();
  const [filterByDate, setFilterByDate] = useState(null);
  const [isDatePopupVisible, setIsDatePopupVisible] = useState(false);
  const [loyaltyListLoading, setLoyaltyListLoading] = useState(true);
  const [loyaltyList, setLoyaltyList] = useState();
  const cardsRef = useRef();

  useEffect(() => {
    if (userData) {
      if (isLogedIn() && !userData.verified) {
        history('/verify');
      }
    }
  }, [userData]);

  useEffect(() => {
    GetLoyaltyList()
      .then((resp) => {
        if (resp.data) {
          setLoyaltyList(resp.data);
          setLoyaltyListLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  function scrollCardsLeft() {
    cardsRef.current.scrollLeft -= 300;
  }

  function scrollCardsRight() {
    cardsRef.current.scrollLeft += 300;
  }

  return (
    <div className={styles.loyaltyWrapper}>
      <div className={styles.loyaltyContainer}>
        {/* <div className={styles.levelIcons}>
                <span></span>
                <span></span>
                <span></span>
            </div> */}
        {isLogedIn() && <Progress />}
        <div className={styles.informationContainer}>
          <h1 className={styles.informationContainerHeader}>{t('loyalty.information.header')}</h1>
          <h1 className={styles.informationContainerDescription}>{t('loyalty.information.description')}</h1>
          {isLogedIn() ? (
            <NavLink to={'/slots'} className={styles.informationContainerButton}>
              {t('loyalty.information.button')}
            </NavLink>
          ) : (
            <div className={styles.informationContainerButtons}>
              <NavLink to={'/login'} className={styles.informationContainerButton}>
                <LoginIcon />
                {t('signIn')}
              </NavLink>
              <NavLink to={'/register'} className={styles.informationContainerButton}>
                {t('create.account')}
              </NavLink>
            </div>
          )}
        </div>
        <div className={styles.loyaltyBottom}>
          <div className={styles.cashbackContainer}>
            <h1 className={styles.containerHeader}>{t('cashback.levels.header')}</h1>
            <div ref={cardsRef} className={styles.cashbackContainerList}>
              {loyaltyList && !loyaltyListLoading && loyaltyList.length > 0 ? (
                loyaltyList.map((item, index) => (
                  <CashbackCard
                    key={index}
                    isCurrent={true}
                    cardType={item.name}
                    proccent={Number(item.cashBack)}
                    maxPoint={Number(item.maxPoint)}
                  />
                ))
              ) : (
                <div className={styles.noResultContainer}>
                  {loyaltyListLoading ? (
                    <>...</>
                  ) : (
                    <>
                      <div className={styles.noData}>
                        <span className={styles.noDataIcon}>
                          <ClockClose />
                        </span>
                        <p className={styles.noDataText}>{t('no.result.found')}</p>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
            <div className={styles.cashbackNavigation}>
              <span onClick={scrollCardsLeft}>
                <LeftArrow />
              </span>
              <span onClick={scrollCardsRight}>
                <RightArrow />
              </span>
            </div>
          </div>
          {isLogedIn() && <History setFilterByDate={setFilterByDate} setIsDatePopupVisible={setIsDatePopupVisible} />}
          <Rules />
        </div>
      </div>
      {isDatePopupVisible && (
        <Popup header={'time.filter'} hidePopup={setIsDatePopupVisible}>
          <DateFilter filterByDate={filterByDate} />
        </Popup>
      )}
    </div>
  );
};

export default LoyaltyPage;
