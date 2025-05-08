import { useContext, useEffect, useState } from 'react';
import styles from "./NotificationsSettings.module.css";
import { useNavigate} from "react-router-dom";
import { BackIcon, FlagEn, FlagGeo, FlagRus, RightArrow } from '../../../../assets/svg/svg';
import { useTranslation } from 'react-i18next';
import MobileHeaderLogo from '../../../../Components/Mobile/MobilHeaderLogo/MobileHeaderLogo';
import { editUserInfo } from '../../../../Services/common';
import { UserContext } from '../../../../Services/userContext';
import { useNotificationPopup } from '../../../../Services/notificationPopupProvider';

const NotificationsSettings = () => {
    const {t} = useTranslation()
    let history = useNavigate();
    const [isMarketingChecked, setIsMarketingChecked] = useState(false);
    const [lang, setLang] = useState("en");
    const { userData, setUserData } = useContext(UserContext);
    const { showSnackNotificationPopup } = useNotificationPopup();
    const { logout } = useContext(UserContext);

    useEffect(() => {
        if (userData) {
            setLang(userData.lang)
            setIsMarketingChecked(userData.smsNotification)
        }
    },[userData])

    function langChange(lang) {
        editUserInfo("lang", lang)
            .then((resp) => {
                if (resp === false) {
                    showSnackNotificationPopup({status: "FAILED", text: "Edit failed"});
                    return;
                }
                setUserData({ ...userData, lang: lang })
                setLang(lang);
            })
            .catch((error) => {
                if(error.message === "UNAUTHORIZED"){
                    logout();
                }else{
                    showSnackNotificationPopup({status: "FAILED", text: error.message});
                }
            })
    } 

    function adsChange(isOn) {
        editUserInfo("smsNotification", isOn)
            .then((resp) => {
                if (resp === false) {
                    showSnackNotificationPopup({status: "FAILED", text: "Edit failed"});
                    return;
                }
                setUserData({ ...userData, smsNotification: isOn })
                setIsMarketingChecked(isOn)
            })
            .catch((error) => {
                if(error.message === "UNAUTHORIZED"){
                    logout();
                }else{
                    showSnackNotificationPopup({status: "FAILED", text: error.message});
                }
            })
    } 
        
    return (
        <div className={styles.notificationsWrapper}>
            <div className={styles.notificationsHeader}>
                <div onClick={() => { history('/menu') }}><BackIcon/></div>          
                <MobileHeaderLogo />
                <div className={styles.filler} />
            </div>
            <h1 className={styles.categoryTitle}>{t('configurations')}</h1>
            <div onClick={() => adsChange(!isMarketingChecked)}  className={styles.categoryItem}>
                <div className={styles.itemInfo}>
                    <div className={styles.itemTitle}>{t("marketing.notifications.header")}</div>
                    <div className={styles.itemDescription}>{t("marketing.notifications.description")}</div>
                </div>
                <label className={styles.switch}>
                    <input type="checkbox" checked={isMarketingChecked} />
                    <span onClick={() => adsChange(!isMarketingChecked)} className={styles.slider}></span>
                </label>
            </div>
            <div className={styles.categoryItem + " " + styles.language}>
                <p className={styles.itemTitle}>{t('communication.language')}</p>
                <p className={styles.itemDescription}>{t('communication.description')}</p>
                <div className={styles.languageContainer}>
                        <div className={styles.flagDiv}>
                        {lang === "en" ? <FlagEn/> :""}
                        {lang === "ru" ? <FlagRus/> :""}
                        {lang === "ka" ? <FlagGeo/> :""}
                        </div>
                        <span className={styles.rightArrow}><RightArrow/></span>
                        <select onChange={(el) => {langChange(el.target.value)}} value={lang} className={styles.categoryItemLang} name="language" id="language">
                                    <option value="en" label="English"></option>
                                    <option value="ka" label="ქართული"></option>
                                    <option value="ru" label="русский"></option>
                        </select>
                </div>
            </div>
        </div>
    );
};

export default NotificationsSettings;
