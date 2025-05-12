import { useContext, useEffect, useState } from "react";
import styles from "./Footer.module.css";
import { NavLink, useLocation } from "react-router-dom";
import { isLogedIn } from "../../../../Services/common";
import Popup from "../../../../Components/Popup/Popup";
import { ActivityIcon, ChatIcon, HomeSetantaIcon, HomeLoyalyIcon, HomePlusIcon } from "../../../../assets/svg/svg";
import ActivityComponent from "../../../../Components/Activity/Activity";
import { useTranslation } from "react-i18next";
import { UserContext } from "../../../../Services/userContext";
// import PartnersSlider from "../../../../Components/PartnersSlider/PartnersSlider";
// import TermsAndConditions from "../../../../Components/TermsAndConditions/TermsAndConditions";
// import MailchimpSubscribe from "react-mailchimp-subscribe";
// import Slider from "react-slick";


const Footer = () => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [t] = useTranslation();
  const { wallet } = useContext(UserContext);
  const [localWallet, setLocalWallet] = useState({ currencySymbol: "₾",currceny: "GEL", balance: 0});
  const [showFooter, setShowFooter] = useState(true)
	const [activePage, setActivePage] = useState("/");
  const location = useLocation();
  const { userData } = useContext(UserContext);
  const [isWithdrawOnlyBlock, setIsWithdrawOnlyBlock] = useState();

  useEffect(() => {
    if (userData && userData.withdrawalOnlyBlock === true) {
      setIsWithdrawOnlyBlock(true);
    }
  }, [userData])
  
  useEffect(() => {
    setActivePage(location.pathname)
    if (location.pathname.includes("/verify")) {
      setShowFooter(false)
    } else {
      setShowFooter(true)
    }
  }, [location])
  
  useEffect(() => {
    if (wallet) {
      setLocalWallet(wallet)
    }
  }, [wallet])

  function formatNumberWithDots(number) {
    return number.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  
  function openChat() {
      window._dixa_.invoke('setWidgetOpen', true);
  }
  

  return (
    <> {showFooter &&
        <footer className={styles.footer}>
          <NavLink to={"/"} className={styles.homeComponent + (isWithdrawOnlyBlock ? " " + styles.disabled : "")}>
                  <span style={{color: 'rgba(255, 209, 6, 1)'}}><HomeSetantaIcon/></span>
                  <div className={styles.title + " " + (activePage === "/" ?styles.active : "")}>
                      {t("home")}
                  </div>
          </NavLink>
          <NavLink to={"/loyalty"} className={styles.homeComponent + (isWithdrawOnlyBlock ? " " + styles.disabled : "")}>
                  <HomeLoyalyIcon/>
                  <div className={styles.title + " " + (activePage === "/loyalty" ?styles.active : "")}>
                      {t("loyalty")}
                  </div>
          </NavLink>
          {isLogedIn() ? 
            <NavLink to={'/deposit'} className={styles.balanceComponent}>
            <div className={styles.balanceNum}>{localWallet.showBalance ? (localWallet.currencySymbol + " " + formatNumberWithDots(localWallet.balance / 100)) : "****"}</div>
              <span className={(isWithdrawOnlyBlock ? " " + styles.disabled : "")}><HomePlusIcon/></span>
            </NavLink>
            :
            <NavLink to={'/login'} className={styles.signIn}>{t("signIn")}</NavLink>
          }
          <div onClick={() => setIsPopupVisible(true)} className={styles.homeComponent + (isWithdrawOnlyBlock ? " " + styles.disabled : "")}>
                  <ActivityIcon/>
                  <div className={styles.title}>
                      {t("activity")}
                  </div>
          </div>
          <NavLink onClick={openChat} className={styles.homeComponent}>
                  <ChatIcon/>
                  <div className={styles.title}>
                      {t("chat")}
                  </div>
          </NavLink>
        </footer>
      }
      {isPopupVisible &&
      <Popup header={"my.games"} hidePopup={setIsPopupVisible}>
        <ActivityComponent />
      </Popup>
      }
      </>
  );
};

export default Footer;
