import { useState } from 'react';
import styles from './ConfirmCookies.module.css'
import { CloseIcon } from '../../assets/svg/svg';
import { Trans, useTranslation } from 'react-i18next';
import Popup from '../Mobile/Popup/Popup'
import PropTypes from 'prop-types';

const ConfirmCookies = ({onClose}) => {
    const [t] = useTranslation();
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [switchSelected, setSwitchSelected] = useState(0);

    return (
        <>
            <div className={styles.background}>
                <div className={styles.confirmContainer}>
                    <div className={styles.headerDiv}>
                        <h1 className={styles.header}>{t("cookie.header")}</h1>
                        <div onClick={()=>onClose()}><CloseIcon/></div>  
                    </div>
                    <span className={styles.description}><Trans i18nKey="cookie.description"> <span onClick={() => {setIsPopupVisible(true)}} className={styles.cookieLink}></span>. </Trans> </span>
                    <button onClick={()=>onClose()} className={styles.accept}>{t("accept")}</button>
                </div>
            </div>
            {isPopupVisible && 
                <Popup header={t("cookie.header")} hidePopup={setIsPopupVisible}>
                    <div className={styles.cookiePopupContent}>
                        <div className={styles.cookieSwitchWrapper}>
                            <div className={styles.cookieSwitch + " " + (switchSelected === 0 ? styles.selected : "")} onClick={() => setSwitchSelected(0)}>{t("switch.general")}</div>
                            <div className={styles.cookieSwitch + " " + (switchSelected === 1 ? styles.selected : "")} onClick={() => setSwitchSelected(1)}>{t("switch.politics")}</div>
                        </div>
                        { switchSelected === 0 && 
                            <div className={styles.cookieDescription}>
                                <Trans i18nKey="general.description"> <div  className={styles.cookieDescriptionSection}></div>. </Trans> 
                            </div>
                        }
                        { switchSelected === 1 && 
                            <div className={styles.cookieDescription}>
                                <Trans i18nKey="politics.description"> <div  className={styles.cookieDescriptionSection}></div> </Trans> 
                            </div>
                        }
                        <button onClick={()=>onClose()} className={styles.accept}>{t("accept")}</button>
                    </div>
                </Popup>
            }
        </>

    );
};

export default ConfirmCookies;


ConfirmCookies.propTypes = {
    onClose: PropTypes.func.isRequired
};