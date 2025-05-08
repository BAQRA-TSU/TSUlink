import styles from "./Responsibility.module.css";
import { useNavigate} from "react-router-dom";
import { BackIcon } from '../../../../assets/svg/svg';
import { useTranslation } from 'react-i18next';
import MobileHeaderLogo from '../../../../Components/Mobile/MobilHeaderLogo/MobileHeaderLogo';
import FooterComponenet from '../../../../Components/Mobile/Footer/Footer';

const Responsibility = () => {
  const {t} = useTranslation()
  let history = useNavigate();

  return (
    <div className={styles.responsibilityWrapper}>
      <div className={styles.responsibilityHeader}>
            <div onClick={() => { history('/') }}><BackIcon/></div>          
          <MobileHeaderLogo />
          <div className={styles.filler} />
      </div>
      {/* <div className={styles.sliderComponent}>
          <div className={styles.slider}>
              <NavLink className={styles.sliderText} to={"/footer/rules"}> {t("rules")}</NavLink>
              <NavLink className={styles.sliderText + " " +styles.active} to={"/footer/responsibility"}>{t("responsibility")}</NavLink>
              <NavLink className={styles.sliderText} to={"/footer/confidentiality"}>{t("security.confidentiality")}</NavLink>
          </div>
      </div> */}
      <h1 className={styles.header}>{t("security.confidentiality.header")}</h1>
      <div className={styles.responsibilityContent}>
      <div className={styles.content}
          dangerouslySetInnerHTML={{ __html: t("security.confidentiality.text") }}
        />   
        {/* <ol>
          <li className={styles.responsibilityContentHeader}>{t("responsibility.1.hedaer")}</li>
          <p className={styles.responsibilityContentDescription}>{t("responsibility.1.description")}</p>
          <li  className={styles.responsibilityContentHeader}>{t("responsibility.2.hedaer")}</li>
          <ul className={styles.responsibilityContentUl}>
            <li className={styles.responsibilityContentDescription}><span>{t("responsibility.2.description.1")}</span></li>
            <li className={styles.responsibilityContentDescription}><span>{t("responsibility.2.description.2")}</span></li>
          </ul>
          <li  className={styles.responsibilityContentHeader}>{t("responsibility.3.hedaer")}</li>
          <ul className={styles.responsibilityContentUl}>
            <li className={styles.responsibilityContentDescription}><span>{t("responsibility.3.description.1")}</span></li>
            <li className={styles.responsibilityContentDescription}><span>{t("responsibility.3.description.2")}</span></li>
          </ul>
        </ol> */}
      </div>
      <FooterComponenet/>
      
    </div>
  );
};

export default Responsibility;
