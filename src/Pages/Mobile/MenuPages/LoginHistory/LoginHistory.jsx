import { useContext, useEffect, useState} from 'react';
import styles from "./LoginHistory.module.css";
import { useNavigate} from "react-router-dom";
import { BackIcon, ClockClose } from '../../../../assets/svg/svg';
import { useTranslation } from 'react-i18next';
import MobileHeaderLogo from '../../../../Components/Mobile/MobilHeaderLogo/MobileHeaderLogo';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import Loader from "../../../../assets/images/loader-setanta.json"
import { getAccountLogins } from '../../../../Services/common';
import { UserContext } from '../../../../Services/userContext';
import { useNotificationPopup } from '../../../../Services/notificationPopupProvider';


const LoginHistory = () => {
  const {t} = useTranslation()
  let history = useNavigate();
	const [showData, setShowData] = useState(null);
	const [transactionsLoading, setTransactionsLoading] = useState(true);
  const { showSnackNotificationPopup } = useNotificationPopup();
  const { logout } = useContext(UserContext);

  useEffect(() => {
    setTransactionsLoading(true);
    getAccountLogins()
      .then((resp) => {
        if (resp === false) {
          showSnackNotificationPopup({status: "FAILED", text: "Logins fetch failed"});
          return;
        }
        setShowData(resp.items);
        setTransactionsLoading(false);
      })
      .catch((error) => {
        if(error.message === "UNAUTHORIZED"){
            logout();
        }else{
            showSnackNotificationPopup({status: "FAILED", text: t(error.message)});
        }
      })
  },[])

  return (
    <div className={styles.transactionWrapper}>
      <div className={styles.transactionComponent}>
        <div className={styles.transactionHeader}>
              <div onClick={() => { history('/menu') }}><BackIcon/></div>          
            <MobileHeaderLogo />
            <div className={styles.filler} />
        </div>
        <h1 className={styles.categoryTitle}>{t('login.history')}</h1>
        <div className={styles.transactionListOuter}>

          <div className={styles.transactionList}>
            {showData && !transactionsLoading && showData.length > 0 ? 
                showData.map((item) => (
                  <div className={styles.categoryItem} key={item.id}>
                    <div className={styles.categoryItemLeft}>
                      <div className={styles.categoryHeader}>Device: {item.deviceType}</div>
                      <div className={styles.categoryFooter}>{new Date (item.LoginDate).getDate() + "/" + new Date (item.LoginDate).getMonth() + "/" + new Date (item.LoginDate).getFullYear() + " " + new Date (item.LoginDate).getHours() + ":" + new Date (item.LoginDate).getMinutes() + ":" +new Date (item.LoginDate).getSeconds()}</div>
                    </div>
                    <div className={styles.categoryItemRight}>
                      <div className={styles.categoryItemRightInner}>
                        <div className={styles.categoryHeader}>IP: {item.ip}</div>
                      </div>
                    </div>
                  </div>
                ))
            :
              <div className={styles.noResultContainer}>
                {transactionsLoading?
                  <DotLottieReact
                    data={Loader}
                    loop={true}
                    autoplay={true}
                    className={styles.loader}
                  />
                  :	
                  <>
                    <div className={styles.noData}>
                      <span className={styles.noDataIcon}><ClockClose /></span>
                      <p className={styles.noDataText}>{t("no.result.found")}</p>
                    </div>
                  </>
                }
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginHistory;
