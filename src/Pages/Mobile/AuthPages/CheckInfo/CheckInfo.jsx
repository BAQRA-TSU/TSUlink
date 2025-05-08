import { useEffect, useState } from "react";
import styles from "./CheckInfo.module.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { AvatarIcon, BackIcon } from "../../../../assets/svg/svg";
import WarningPopup from "../../../../Components/Mobile/WarningPopup/WarningPopup";



const CheckInfo = () => {
    const [t] = useTranslation()
    const location = useLocation();
    const history = useNavigate()
    const userData = location.state;
    const [showPopup, setShowPopup] = useState()
    const [dateOfBirth, setDateOfBirth] = useState()

    useEffect(() => {
        if (!userData) { 
            history('/register');
        } else {
            const date = new Date(userData.dateOfBirth);
            const MonthArray = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
            const month = date.getMonth()
            const monthName = MonthArray[month];
            setDateOfBirth(`${date.getDay()} ${monthName}, ${date.getFullYear()}`)
        }
    },[])

    function onSubmit() {
        history('/register/details', { state: { id: userData.id, country: userData.country } });
    }

    return ( userData &&
        <div className={styles.CheckInfoWrapper}>
            {showPopup && <WarningPopup warningHeader={"back.warning.header"} warningText={"back.warning.text"} buttonSubmit={"submit.back"} buttonCancel={"cancel"} showPopup={showPopup} setShowPopup={setShowPopup} submit={() => { history('/register') }} />}
            <div className={styles.headerContainer}>
                <div onClick={() => setShowPopup(true)} className={styles.backIcon}><BackIcon/></div>
                <span className={styles.aviatorLogo}></span>
            </div>
            <h1 className={styles.headerText}>{t("checkInfo.checkData")}</h1>
            <p className={styles.text}>{t("checkInfo.approve.info")}</p>
                <div className={styles.card}>
                    <AvatarIcon/>
                    <p className={styles.name}>{userData.firstName +  " " + userData.lastName}</p>
                    <p className={styles.personalId}>
                        {userData.personalId}
                    </p>
                    <div className={styles.cardLower}>
                        <p className={styles.cardLowerElement}>
                            {userData.citizenship}
                        </p>
                        <p className={styles.cardLowerElement}>
                            {dateOfBirth}
                        </p>
                    </div>
                </div>
            <div className={styles.submit} onClick={onSubmit} >{t('submit')}</div>
        </div>
    );
};

export default CheckInfo;
