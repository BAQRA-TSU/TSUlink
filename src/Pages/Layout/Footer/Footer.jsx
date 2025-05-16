import { useTranslation } from "react-i18next"
import { AgeIcon, ChatIconFooter, FbIcon, FlagEn, FlagGeo, FlagRus, InstaIcon, PhoneIconFooter, RightArrow, YtIcon } from "../../../assets/svg/svg"
import MobileHeaderLogo from "../../../Components/MobilHeaderLogo/MobileHeaderLogo"
import styles from "./Footer.module.css"
import { useState } from "react"
import { NavLink } from "react-router-dom"

const FooterComponent = () => {
    const [t, i18n] = useTranslation()
    const [lang, setLang] = useState(i18n.language);


    function openChat() {
        window._dixa_.invoke('setWidgetOpen', true);
    }

    function langChange(params) {
        i18n.changeLanguage(params.target.value);
        localStorage.setItem("i18nextLng", params.target.value);
        setLang(params.target.value);
      }

    return (
        <div className={styles.footerComponenet}>
            <div className={styles.footerHeader}>
                <MobileHeaderLogo />
                <div className={styles.socialsComponent}>
                    <a rel="noreferrer" href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" target="_blank"><FbIcon/></a>
                    <a rel="noreferrer" href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" target="_blank"><InstaIcon/></a>
                    <a rel="noreferrer" href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" target="_blank"> <YtIcon/></a>
                </div>
            </div>
            <div className={styles.contactComponent}>
                <a href="tel:0 32 2 555 555" className={styles.contactElement}>
                    <PhoneIconFooter />
                    <div className={styles.contactRight}>
                        <p className={styles.contactHeader}>0 32 2 555 555</p>
                        <p className={styles.contactText}>{t("call")}</p>
                    </div>
                </a>
            </div>
            <div className={styles.languageContainer}>
                <div className={styles.flagDiv}>
                {lang === "en" ? <FlagEn/> :""}
                {lang === "ru" ? <FlagRus/> :""}
                {lang === "ka" ? <FlagGeo/> :""}
                </div>
                <span className={styles.rightArrow}><RightArrow/></span>
                <select onChange={(el) => {langChange(el)}} value={lang} className={styles.categoryItem} name="language" id="language">
                            <option value="en" label="English"></option>
                            <option value="ka" label="ქართული"></option>
                            <option value="ru" label="русский"></option>
                </select>
            </div>
            <div className={styles.footerInfo}>
                <p className={styles.footerText}>{t("copyright")}</p>
                <span className={styles.ageIcon}><AgeIcon/></span>
            </div>
            <div className={styles.infoNumbers}>
                <div className={styles.row}>
                    <p className={styles.infoHeader}>{t("info.number")}</p>
                    <p className={styles.infoNumber}>19-10/002</p>
                </div>
                <div className={styles.row}>
                    <p className={styles.infoHeader}>{t("info.number")}</p>
                    <p className={styles.infoNumber}>19-10/003</p>
                </div>
                <div className={styles.row}>
                    <p className={styles.infoHeader}>{t("info.number")}</p>
                    <p className={styles.infoNumber}>19-10/004</p>
                </div>
            </div>
        </div>
    )
}

export default FooterComponent