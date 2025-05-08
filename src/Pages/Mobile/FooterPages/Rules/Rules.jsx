import { useState } from 'react';
import styles from "./Rules.module.css";
import { useNavigate} from "react-router-dom";
import { BackIcon, DownArrow, UpArrow } from '../../../../assets/svg/svg';
import { useTranslation } from 'react-i18next';
import MobileHeaderLogo from '../../../../Components/Mobile/MobilHeaderLogo/MobileHeaderLogo';
import FooterComponenet from '../../../../Components/Mobile/Footer/Footer';

const Rules = () => {
  const {t} = useTranslation()
  let history = useNavigate();
  const [openSections, setOpenSections] = useState({
    introduction: false,
    age: false,
    law: false,
    agreement: false,
  });

  function accordeon(params,section) {
    setOpenSections((prevState) => ({
      ...prevState,
      [section]: !prevState[section],
    }));
    var panel = params.target.parentElement.nextElementSibling;
    if (panel.style.display === "flex") {
      panel.style.display = "none";
      params.target.style.borderBottomLeftRadius = 16 + "px"
      params.target.style.borderBottomRightRadius = 16 + "px"
    } else {
      panel.style.display = "flex";
      params.target.style.borderBottomLeftRadius = 0
      params.target.style.borderBottomRightRadius = 0
    } 
  }

  return (
    <div className={styles.rulesWrapper}>
      <div className={styles.rulesHeader}>
            <div onClick={() => { history('/') }}><BackIcon/></div>          
          <MobileHeaderLogo />
          <div className={styles.filler} />
      </div>
      {/* <div className={styles.sliderComponent}>
          <div className={styles.slider}>
              <NavLink className={styles.sliderText + " " +styles.active} to={"/footer/rules"}> {t("rules")}</NavLink>
              <NavLink className={styles.sliderText} to={"/footer/responsibility"}>{t("responsibility")}</NavLink>
              <NavLink className={styles.sliderText} to={"/footer/confidentiality"}>{t("security.confidentiality")}</NavLink>
          </div>
      </div> */}
      <h1 className={styles.header}>{t("rules")}</h1>
      <div className={styles.rulesContent}>

        <div className={styles.buttonDiv}>
          <button onClick={(e) => accordeon(e,'introduction')} className={styles.accordion}>{t("rules.introduction.header")}</button>
          <div className={styles.arrow}>{openSections.introduction ? <UpArrow /> : <DownArrow />}</div>
        </div>
        <div className={styles.panel}>
          {t("rules.introduction.description")}
        </div>

        <div className={styles.buttonDiv}>
          <button onClick={(e) => accordeon(e,'age')} className={styles.accordion}>{t("rules.age.header")}</button>
          <div className={styles.arrow}>{openSections.age ? <UpArrow /> : <DownArrow />}</div>
        </div>
        <div className={styles.panel}>
          {t("rules.age.description")}
        </div>

        <div className={styles.buttonDiv}>
          <button onClick={(e) => accordeon(e,'law')} className={styles.accordion} >{t("rules.law.header")}</button>
          <div className={styles.arrow}>{openSections.law ? <UpArrow /> : <DownArrow />}</div>
        </div>
        <div className={styles.panel}>
          {t("rules.law.description")}
        </div>

        <div className={styles.buttonDiv}>
          <button onClick={(e) => accordeon(e,'agreement')} className={styles.accordion} >{t("rules.agreement.header")}</button>
          <div className={styles.arrow}> {openSections.agreement ? <UpArrow /> : <DownArrow />}</div>
        </div>
        <div className={styles.panel}>
          {t("rules.agreement.description")}
        </div>

      </div>
      <FooterComponenet/>
    </div>
  );
};

export default Rules;
