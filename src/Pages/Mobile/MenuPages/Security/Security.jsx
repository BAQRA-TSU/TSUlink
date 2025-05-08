import { useContext, useEffect, useState} from 'react';
import styles from "./Security.module.css";
import { useNavigate} from "react-router-dom";
import {  PersonalInfoIcon, RightArrow, BackIcon, PasswordIcon } from '../../../../assets/svg/svg';
import { useTranslation } from 'react-i18next';
import MobileHeaderLogo from '../../../../Components/Mobile/MobilHeaderLogo/MobileHeaderLogo';
import Popup from '../../../../Components/Mobile/Popup/Popup';
import ChangePassword from '../../../../Components/Mobile/ChangePassword/ChangePassword';
import { UserContext } from '../../../../Services/userContext';
import PsswordTwoFa from '../../../../Components/Mobile/PsswordTwoFa/PsswordTwoFa';
import { editUserInfo } from '../../../../Services/common';
import { useNotificationPopup } from '../../../../Services/notificationPopupProvider';

const Security = () => {
  const [isOtpChecked, setIsOtpChecked] = useState(false);
  // const [isWithdrawOtpChecked, setIsWithdrawOtpChecked] = useState(false);
  const [isPasswordPopupOpen, setIsPasswordPopupOpen] = useState(false);
  const { userData, setUserData } = useContext(UserContext);
  // const [isTwoFaAccepted, setIsTwoFaAccepted] = useState(false);
  const [userInput, setUserInput] = useState();
  const [showTwoFA, setShowTwoFA] = useState(false);
  const [twoFaError, setTwoFaError] = useState();
  const { showSnackNotificationPopup } = useNotificationPopup();
  const { logout } = useContext(UserContext);
  const {t} = useTranslation()
  let history = useNavigate();

  useEffect(() => {
    if(userData){
      setIsOtpChecked(userData.twoFactor)
    }
  },[userData]) 
  
  function changeOtp(isChecked) {
    editUserInfo("twoFactor", isChecked)
      .then((resp) => {
        if (resp === false) {
          showSnackNotificationPopup({status: "FAILED", text: "Edit failed"});
          return;
        }
        setUserData({ ...userData, twoFactor: isChecked })
        setIsOtpChecked(isChecked);
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
    <>
      <div className={styles.securityWrapper}>
          <div className={styles.securityHeader}>
                <div onClick={() => { history('/menu') }}><BackIcon/></div>          
              <MobileHeaderLogo />
              <div className={styles.filler} />
          </div>
          <h1 className={styles.categoryTitle}>{t('change.password')}</h1>
          <div onClick={() => {setIsPasswordPopupOpen(true)}} className={styles.categoryItem}>
              <div className={styles.categoryIcon}><PasswordIcon/></div>
              <div className={styles.itemInfo}>
                  <div className={styles.itemTitle}>{t("changing.password")}</div>
                  <div className={styles.itemDescription}>{t("create.new.password")}</div>
              </div>
              <RightArrow/>
          </div>
          <h1 className={styles.categoryTitle}>{t('security')}</h1>
          <p className={styles.categoryDescription}>{t('security.description')}</p>
          <div onClick={() => changeOtp(!isOtpChecked)} className={styles.categoryItem}>
              <div className={styles.categoryIcon}><PersonalInfoIcon/></div>
              <div className={styles.itemInfo}>
                  <div className={styles.itemTitle}>{t("while.logging.in")}</div>
                  <div className={styles.itemDescription}>{t("security.will.get.sms.login")}</div>
              </div>
                <label className={styles.switch}>
                    <input type="checkbox" checked={isOtpChecked} />
                    <span className={styles.slider}></span>
              </label>
            </div>
            {/* <div onClick={() => setIsWithdrawOtpChecked(!isWithdrawOtpChecked)}  className={styles.categoryItem}>
              <div className={styles.categoryIcon}><UpIcon/></div>
              <div className={styles.itemInfo}>
                  <div className={styles.itemTitle}>{t("while.withdrawal")}</div>
                  <div className={styles.itemDescription}>{t("security.will.get.sms.withdrawal")}</div>
              </div>
              <label className={styles.switch}>
                    <input type="checkbox" checked={isWithdrawOtpChecked} />
                    <span className={styles.slider}></span>
              </label>
            </div> */}
      </div>
      {isPasswordPopupOpen && (
        <Popup header={"change.password"} hidePopup={setIsPasswordPopupOpen}>
          <ChangePassword setTwoFaError={setTwoFaError} twoFaError={twoFaError} setUserInput={setUserInput} setShowTwoFA={setShowTwoFA} setIsPasswordPopupOpen={setIsPasswordPopupOpen}/>
        </Popup>
      )}
      { showTwoFA && <PsswordTwoFa setTwoFaError={setTwoFaError} currentPassword={userInput.currentPassword} newPassword={userInput.newPassword} setIsPasswordPopupOpen={setIsPasswordPopupOpen} setShowPopup={setShowTwoFA} /> }
    </>
  );
};

export default Security;
