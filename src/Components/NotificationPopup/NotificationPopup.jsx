import { useState, useContext, useRef } from 'react';
import styles from './NotificationPopup.module.css';
import { useTranslation } from 'react-i18next';
import { UserContext } from '../../Services/userContext';
import { useNotificationPopup } from '../../Services/notificationPopupProvider';
import { WarningCircleIcon } from '../../assets/svg/svg';

const NotificationPopup = () => {
    const [i18n] = useTranslation();
    const wrapperRef = useRef(null);
    const { userData } = useContext(UserContext);
    const { visibility, notificationData, hideNotificationPopup } = useNotificationPopup();
    const [fadeOut, setFadeOut] = useState(false);

    const hidePopupFunction = (element) => {
        if (element.target === wrapperRef.current) {
            setFadeOut(true);
            setTimeout(() => {
                hideNotificationPopup();
                setFadeOut(false) // Use context function to hide popup
            }, 500); // Match this duration with your CSS transition duration
        }
    };

    return (
        userData && visibility && notificationData && (
            <div onClick={(event) => hidePopupFunction(event)} ref={wrapperRef} className={styles.popupComponent + (fadeOut ? " " + styles.fadeOut : "")}>
                <div className={styles.popupContainer + (fadeOut ? " " + styles.fadeOut : "")}>
                    <div className={styles.contentContainer}>
                        {notificationData[i18n.language].fileUrl ?
                            <img className={styles.notificationImg} alt='Not Found' src={notificationData[i18n.language].fileUrl}/>
                        :
                            <WarningCircleIcon/>
                        }
                        <h1 className={styles.notificationHeader}>{notificationData[i18n.language]?.header || 'POPUP'}</h1>
                        <p className={styles.notificationText}>{notificationData[i18n.language]?.message.replace('{username}', userData.username || 'User')}</p>
                        {notificationData[i18n.language].button && (
                            <button className={styles.notificationButton} onClick={() => {window.open(notificationData[i18n.language].buttonLink, '_blank'); hidePopupFunction({ target: wrapperRef.current });}}>
                                {notificationData[i18n.language].buttonText}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        )
    );
};

export default NotificationPopup;