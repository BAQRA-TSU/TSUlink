import styles from "./TermsNconditions.module.css";
import { useNavigate} from "react-router-dom";
import { BackIcon } from '../../../../assets/svg/svg';
import { useTranslation } from 'react-i18next';
import MobileHeaderLogo from '../../../../Components/Mobile/MobilHeaderLogo/MobileHeaderLogo';
import FooterComponenet from '../../../../Components/Mobile/Footer/Footer';

const TermsNconditions = () => {
  const {t} = useTranslation()
  let history = useNavigate();

  return (
    <div className={styles.confidentialityWrapper}>
      <div className={styles.confidentialityHeader}>
            <div onClick={() => { history('/') }}><BackIcon/></div>          
          <MobileHeaderLogo />
          <div className={styles.filler} />
      </div>
      {/* <div className={styles.sliderComponent}>
          <div className={styles.slider}>
              <NavLink className={styles.sliderText} to={"/footer/rules"}> {t("rules")}</NavLink>
              <NavLink className={styles.sliderText} to={"/footer/responsibility"}>{t("responsibility")}</NavLink>
              <NavLink className={styles.sliderText + " " +styles.active} to={"/footer/TermsNconditions"}>{t("security.TermsNconditions")}</NavLink>
          </div>
      </div> */}
      <h1 className={styles.header}>{t("terms.conditions")}</h1>
      <div className={styles.confidentialityContent}>
        <div className={styles.content}
          dangerouslySetInnerHTML={{ __html: t("register.terms.conditions") }}
        />    
      </div>
      <FooterComponenet/>
    </div>
  );
};

export default TermsNconditions;
