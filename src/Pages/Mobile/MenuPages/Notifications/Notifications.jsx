import { useContext, useEffect, useState } from 'react';
import styles from "./Notifications.module.css";
import { useNavigate} from "react-router-dom";
import { BackIcon, BonusNotification, MailNoIcon, SystemNotification } from '../../../../assets/svg/svg';
import { useTranslation } from 'react-i18next';
import MobileHeaderLogo from '../../../../Components/Mobile/MobilHeaderLogo/MobileHeaderLogo';
import {getNotifications, openOneNotification, readNotifications} from '../../../../Services/common'
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import Loader from "../../../../assets/images/loader-setanta.json"
import { useNotificationPopup } from '../../../../Services/notificationPopupProvider';
import { UserContext } from '../../../../Services/userContext';

const Notifications = () => {
    const [notifications, setNotifications] = useState(false)
    const [isnotifications, setIsNotifications] = useState(false)
	const [notificationsLoading, setNotificationsLoading] = useState(true);
    const { showNotificationPopup } = useNotificationPopup();
    const [t, i18n] = useTranslation();
	const { userData } = useContext(UserContext);
    const { logout } = useContext(UserContext);
    const { showSnackNotificationPopup } = useNotificationPopup();
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let history = useNavigate();

    useEffect(() => {
        if(notifications){
            for (const [key, value] of Object.entries(notifications)) {
                if(value.length>0){
                    setIsNotifications(true)
                }
            }
        }
    },[notifications])

    useEffect(() => {
        if(userData){
            setNotificationsLoading(true);
            getNotifications()
                .then((resp) => {
                    if (resp === false) {
                        showSnackNotificationPopup({status: "FAILED", text: "Notificaiotn fetch failed"});
                        return;
                    }
                    setNotifications(resp);
                })
                .catch((error) => {
                    if(error.message === "UNAUTHORIZED"){
                        logout();
                    }else{
                        showSnackNotificationPopup({status: "FAILED", text: t(error.message)});
                    }
                })
                .finally(() => {
                    setNotificationsLoading(false);
                })
        }
    },[userData])

    function openNotification(status,id){
        openOneNotification(id)
            .then((resp) =>{
                if (resp === false) {
                    showSnackNotificationPopup({status: "FAILED", text: "Open notificaion failed"});
                    return;
                }
                showNotificationPopup(resp.data.content)
            })
            .catch((error) => {
                if(error.message === "UNAUTHORIZED"){
                    logout();
                }else{
                    showSnackNotificationPopup({status: "FAILED", text: t(error.message)});
                }
            })

        if(status === "SENT"){
            readNotifications(id)
                .then((resp) =>{
                    if (resp === false) {
                        showSnackNotificationPopup({status: "FAILED", text: "Read failed"});
                        return;
                    }
                    setNotificationsLoading(true);
                    getNotifications()
                        .then((resp) => {
                            if (resp === false) {
                                showSnackNotificationPopup({status: "FAILED", text: "Notification fetch failed"});
                                return;
                            }
                            setNotifications(resp);
                        })
                        .catch((error) => {
                            if(error.message === "UNAUTHORIZED"){
                                logout();
                            }else{
                                showSnackNotificationPopup({status: "FAILED", text: t(error.message)});
                            }
                        })
                        .finally(() => {
                            setNotificationsLoading(false);
                        })
                })
                .catch((error) => {
                    if(error.message === "UNAUTHORIZED"){
                        logout();
                    }else{
                        showSnackNotificationPopup({status: "FAILED", text: t(error.message)});
                    }
                })
        }
    }
        
    return (
        <div className={styles.notificationsWrapper}>
            <div className={styles.notificationsHeader}>
                <div onClick={() => { history('/menu') }}><BackIcon/></div>          
                <MobileHeaderLogo />
                <div className={styles.filler} />
            </div>
            <h1 className={styles.categoryTitle}>{t('notifications')}</h1>
            {/* <Switch actives={[true, false]} links={['/menu/notifications', '/menu/notifications/settings']} names={[t('notifications'),t('settings')]} /> */}
            <div className={styles.notificationsList}>
                {notifications && isnotifications ? 
                    Object.keys(notifications).map((key, index) => (
                        notifications[key].length > 0 && (
                            <div key={index} className={styles.notification}>
                                <div className={styles.categoryDescription}>{t(`notification.date.${key}`)}</div>
                                    {notifications[key].map((element,index) => (
                                        <div key={index} onClick={() => openNotification(element.status, element.id)} className={styles.categoryItem + " "+ (element.status === "SENT" ? styles.unread : "")}>
                                            <div className={styles.categoryIcon}>{element.content[i18n.language].type === "bonus" || element.content[i18n.language].type === "offer" ? <BonusNotification/> : <SystemNotification/> }</div>
                                            <div className={styles.itemInfo}>
                                                <div className={styles.itemTitle}>{element.content[i18n.language].header}</div>
                                                <div className={styles.itemDescription}>{element.content[i18n.language].message}</div>
                                            </div>
                                            {/* <div className={styles.time}>{element.layout.content[i18n.language].time}</div> */}
                                            <div className={styles.time}>{key === "today" || key === "yesterday" ? new Date(element.date).getHours().toString().padStart(2, '0') + ":" + new Date(element.date).getMinutes().toString().padStart(2, '0')  : new Date(element.date).getDate() + " " + months[new Date(element.date).getMonth()]}</div>
                                            {element.status === "SENT" && 
                                                <div className={styles.unreadIcon}></div>
                                            }
                                        </div>
                                    ))}
                            </div>
                        )
                    ))
                    :
                    <div className={styles.noNotificationDiv}>
                        {notificationsLoading ?
                            <DotLottieReact
                                data={Loader}
                                loop={true}
                                autoplay={true}
                                className={styles.loader}
                            />
                        :	
                            <>
                                <MailNoIcon />
                                <p>{t("no.notification")}</p>
                            </>
                        }
                    </div>
                }
                
            </div>
        </div>
    );
};

export default Notifications;
