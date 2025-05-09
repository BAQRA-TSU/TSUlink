import { useContext, useEffect, useState } from "react";
import styles from "./progress.module.css";
import { UserContext } from "../../../../../Services/userContext";
import { useTranslation } from "react-i18next";
import {
  HomeSetantaIcon,
} from "../../../../../assets/svg/svg";
import { useNotificationPopup } from "../../../../../Services/notificationPopupProvider";
import { getLoyalty } from "../../../../../Services/common";

const Progress = () => {
  const [t] = useTranslation();
  const { wallet } = useContext(UserContext);
  const { logout } = useContext(UserContext);
  const { showSnackNotificationPopup } = useNotificationPopup();
  const [loyalty, setLoyalty] = useState();
  const [loyaltyLoading, setLoyaltyLoading] = useState(true);

  useEffect(() => {
    getLoyalty()
      .then((resp) => {
        if (resp === false) {
          showSnackNotificationPopup({ status: "FAILED", text: "Logins fetch failed" });
          return;
        }
        if(resp){
          setLoyalty(resp);
          setLoyaltyLoading(false);
        }
      })
      .catch((error) => {
        if (error.message === "UNAUTHORIZED") {
          logout()
        } else {
          showSnackNotificationPopup({ status: "FAILED", text: t(error.message) });
        }
      })
  }, [])

  return (
    !loyaltyLoading ?
      <div className={styles.levelCard} >
        <div className={styles.levelCardHeader}>
          <img className={styles.cardIcon} src={`./loyalty/${loyalty.name}.png`} />
          <span>{loyalty.name}</span>
          <span>
            {loyalty.cashBack}% {t("cashback")}
          </span>
        </div>
        <div className={styles.progressHeader}>
          <span>{t("your.vip.progress")}</span>
          <span>
            {loyalty.balance} {wallet && wallet.currencySymbol} / {loyalty.maxPoint} {wallet && wallet.currencySymbol}-დან
          </span>
        </div>
        <div className={styles.progressBar}>
          <div
            style={{ width: `${(loyalty.balance / loyalty.maxPoint) * 100}%` }}
            className={styles.progress}
          ></div>
        </div>
        <div className={styles.levelFooter}>
          <div>
            <span className={styles.lastLevel}>
              <HomeSetantaIcon />
            </span>
            <span>{t(loyalty.name)}</span>
          </div>
          <div>
            <span className={styles.nextLevel}>
              <HomeSetantaIcon />
            </span>
            <span>{t(loyalty.nextLoyaltyLvl)}</span>
          </div>
        </div>
      </div >
      :
      <>...</>
  );
};

export default Progress;
