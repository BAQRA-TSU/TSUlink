import { useState, useEffect } from 'react';
import styles from './NotificationSnack.module.css';
import { useTranslation } from 'react-i18next';
import { useNotificationPopup } from '../../../Services/notificationPopupProvider';

const NotificationSnack = () => {
    const [t] = useTranslation();
    
    const { snackVisibility, snackNotificationData, hideSnackNotificationPopup } = useNotificationPopup();
    const [fadeOut, setFadeOut] = useState(false);

    const hidePopupFunction = () => {
        setFadeOut(true);
        setTimeout(() => {
            setFadeOut(false)
            hideSnackNotificationPopup(); // Use context function to hide popup
        }, 500); // Match this duration with your CSS transition duration
    };

    useEffect(() => {
        if (snackVisibility) {
            setFadeOut(false);
            // hideSnackNotificationPopup();
        } // Reset fade-out when popup reappears
        setTimeout(() => {
            if(snackVisibility){
                hidePopupFunction()
            }
        }, 2000)
    }, [snackVisibility]);

    return (
        snackVisibility && snackNotificationData && (
            <div className={styles.popupComponent + (fadeOut ? " " + styles.fadeOut : "")}>
                <div className={styles.popupContainer + " " +  styles[snackNotificationData.status] }>
                        {t(snackNotificationData.text)}
                </div>
            </div>
        )
    );
};

export default NotificationSnack;