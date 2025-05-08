import { useContext, useEffect, useState} from 'react';
import styles from "./PersonalInfo.module.css";
import { useNavigate} from "react-router-dom";
import { RightArrow, BackIcon, MailIcon, PhoneIcon} from '../../../../assets/svg/svg';
import { UserContext } from '../../../../Services/userContext';
import { useTranslation } from 'react-i18next';
import MobileHeaderLogo from '../../../../Components/Mobile/MobilHeaderLogo/MobileHeaderLogo';
import Popup from '../../../../Components/Mobile/Popup/Popup';
import ChangePhone from '../../../../Components/Mobile/ChangePhone/ChangePhone';
import PhoneTwoFa from '../../../../Components/Mobile/PhoneTwoFa/PhoneTwoFa';
import ChangeMail from '../../../../Components/Mobile/ChangeMail/ChangeMail';

const PersonalInfo = () => {
  const {t} = useTranslation()
  const [data, setData] = useState();
  const [isEmailPopupOpen, setIsEmailPopupOpen] = useState(false);
  const [isPhonePopupOpen, setIsPhonePopupOpen] = useState(false);
  const { userData, setUserData } = useContext(UserContext);
  const [showTwoFA, setShowTwoFA] = useState(false);
  const [userInput, setUserInput] = useState();
  const [twoFaError, setTwoFaError] = useState();
  const [dateOfBirth, setDateOfBirth] = useState();

  let history = useNavigate();

  useEffect(() => {
    if (userData) {
      setData(userData);
      const date = new Date("1996-01-01");
      const month = date.getMonth()
      const MonthArray = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
      const monthName = MonthArray[month];
      setDateOfBirth(`${date.getDay()} ${monthName}, ${date.getFullYear()}`)
    }
  }, [userData])
  useEffect(() => {
    if (isPhonePopupOpen === false) {
      setTwoFaError(undefined);
    }
  },[isPhonePopupOpen])

  return (
    <>
      {data && (
        <div className={styles.personalInfoWrapper}>
          <div className={styles.personalInfoHeader}>
            <div onClick={() => { history('/menu') }}><BackIcon /></div>
            <MobileHeaderLogo />
            <div className={styles.filler} />
          </div>
          <h1 className={styles.categoryTitle}>{t('personal.info')}</h1>
          <p className={styles.categoryDescription}>{t('contact.info')}</p>
          <div onClick={() => {setIsEmailPopupOpen(true)}} className={styles.categoryItem}>
            <div className={styles.categoryIcon}><MailIcon /></div>
            <div className={styles.itemInfo}>
              <div className={styles.itemTitle}>{data.secondaryEmail}</div>
              <div className={styles.itemDescription}>{t("email")}</div>
            </div>
            <RightArrow />
          </div>
          <div onClick={() => {setIsPhonePopupOpen(true)}} className={styles.categoryItem}>
            <div className={styles.categoryIcon}><PhoneIcon /></div>
            <div className={styles.itemInfo}>
              <div className={styles.itemTitle}>{data.phone}</div>
              <div className={styles.itemDescription}>{t("phone.number")}</div>
            </div>
            <RightArrow />
          </div>
          <p className={styles.categoryDescription}>{t('private.information')}</p>
          <div className={styles.personalInfoDiv}>
            <div className={styles.personalInfoItem}>
              <div className={styles.personalInfoItemTitle}>{t("username")}</div>
              <div className={styles.personalInfoItemData}>{data.username}</div>
            </div>
            <div className={styles.personalInfoItem}>
              <div className={styles.personalInfoItemTitle}>{t("name.fullName")}</div>
              <div className={styles.personalInfoItemData}>{data.firstName} {data.lastName}</div>
            </div>
            <div className={styles.personalInfoItem}>
              <div className={styles.personalInfoItemTitle}>{t("id")}</div>
              <div className={styles.personalInfoItemData}>{data.personalId}</div>
            </div>
            <div className={styles.personalInfoItem + " " + styles.lastPersonalInfoItem}>
              <div className={styles.personalInfoItemTitle}>{t("birth.date")}</div>
              <div className={styles.personalInfoItemData}>{dateOfBirth}</div>
            </div>
          </div>
          <div className={styles.notice}>{t("personal.info.notice")}</div>
        </div>
      )}
      {isEmailPopupOpen && (
        <Popup hidePopup={setIsEmailPopupOpen}>
          <ChangeMail setIsEmailPopupOpen={setIsEmailPopupOpen} userData={userData} setUserData={setUserData} />
        </Popup>
      )}
      {isPhonePopupOpen && (
        <Popup hidePopup={setIsPhonePopupOpen}>
          <ChangePhone setTwoFaError={setTwoFaError} twoFaError={twoFaError} setUserInput={setUserInput} setShowTwoFA={setShowTwoFA} setIsPhonePopupOpen={setIsPhonePopupOpen}/>
        </Popup>
      )}
      {showTwoFA && <PhoneTwoFa setTwoFaError={setTwoFaError} userData={userData} setUserData={setUserData} userInput={userInput} setIsPhonePopupOpen={setIsPhonePopupOpen} setShowPopup={setShowTwoFA} />}
    </>
  );
};

export default PersonalInfo;
