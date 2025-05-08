import styles from "./Footer.module.css";
import { NavLink } from "react-router-dom";
// import PartnersSlider from "../../../../Components/PartnersSlider/PartnersSlider";
// import TermsAndConditions from "../../../../Components/TermsAndConditions/TermsAndConditions";
// import MailchimpSubscribe from "react-mailchimp-subscribe";
// import Slider from "react-slick";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <NavLink to={"/"} className={styles.homeComponent}>
        <span style={{ color: "rgba(255, 209, 6, 1)" }}>
        </span>
        <div className={styles.title}>Home</div>
      </NavLink>
      <NavLink to={"/loyalty"} className={styles.homeComponent}>
        <div className={styles.title}>Loyalty</div>
      </NavLink>
      <div className={styles.homeComponent}>
        <div className={styles.title}>activity</div>
      </div>
      <div className={styles.title}>chat</div>
    </footer>
  );
};

export default Footer;
