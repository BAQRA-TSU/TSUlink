import { useContext, useEffect, useState } from 'react';
import styles from './Upload.module.css'
import { useLocation } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import ID from '../../../../Components/Mobile/ID/ID';
import Passport from '../../../../Components/Mobile/Passport/Passport';
import Popup from '../../../../Components/Mobile/Popup/Popup';
import { imageSubmit, sendImage } from '../../../../Services/common';
import { useNotificationPopup } from '../../../../Services/notificationPopupProvider';
import { UserContext } from '../../../../Services/userContext';


const Upload = () => {
    // const history = useNavigate()
    const [t] = useTranslation()
    const location = useLocation();
    const [activeTab, setActiveTab] = useState(0);
    const [isPopupOpen, setIsPopupOpen] = useState();
    const [popupOpenedFor, setPopupOpenedFor] = useState();
    const translations = {"FRONT": "upload.front", "BACK": "upload.back", "SELFY": "upload.selfy", "PASSPORT": "upload.passport", "PASSPORT.SELFY": "upload.selfy"}
    const [frontImage, setFrontImage] = useState();
    const [frontImageUploaded, setFrontImageUploaded] = useState(false);
    const [backImage, setBackImage] = useState();
    const [backImageUploaded, setBackImageUploaded] = useState(false);
    const [selfyImage, setSelfyImage] = useState();
    const [selfyImageUploaded, setSelfyImageUploaded] = useState(false);
    const [passportImage, setPassportImage] = useState();
    const [passportImageUploaded, setPassportImageUploaded] = useState(false);
    const [passportSelfyImage, setPassportSelfyImage] = useState();
    const [passportSelfyImageUploaded, setPassportSelfyImageUploaded] = useState(false);
    const [isAllImageSubmited, setIsAllImageSubmited] = useState(false);
    const {sessionId, veriffData} = location.state;
    const [isButtonLoading, setIsButtonLoading] = useState(false);
    const { showSnackNotificationPopup } = useNotificationPopup();
    const [needUpload, setNeedUpload] = useState({fraud: false, document: false, biometric: false});
    const { logout } = useContext(UserContext);

    useEffect(() => {
        if(veriffData){
            veriffData.insights.forEach(element => {
                if(element.result !== "yes"){
                    setNeedUpload({...needUpload, [element.category]: true});
                }
            })
        }else{
            setNeedUpload({fraud: true, document: true, biometric: true});
        }
    },[])

    useEffect(() => {
        for (const [key, value] of Object.entries(needUpload)) {
            switch (key) {
                case "document":
                    if(value === false){
                        setFrontImageUploaded(true);
                        setBackImageUploaded(true);
                        setPassportImageUploaded(true)
                    }else{
                        setFrontImageUploaded(false);
                        setBackImageUploaded(false);
                        setPassportImageUploaded(false)
                    }
                    break;
                case "biometric":
                    if(value === false){
                        setSelfyImageUploaded(true);
                        setPassportSelfyImageUploaded(true);
                    }else{
                        setSelfyImageUploaded(false);
                        setPassportSelfyImageUploaded(false);
                    }
                    break;
                default:
                    break;
            }
        }
    },[needUpload])
    
    function uploadImg(event) {
        const reader = new FileReader();
        switch (popupOpenedFor) {
            case "FRONT":
                setIsButtonLoading(true);
                setFrontImageUploaded(false);
                reader.onloadend = () => {
                    sendImage(sessionId, reader.result, "document-front")
                        .then((resp) => {
                            if (resp === false) {
                                showSnackNotificationPopup({status: "FAILED", text: "Image upload failed"});
                                return;
                            }
                            setFrontImage(event.target.files[0]);
                            setFrontImageUploaded(true);
                        })
                        .catch((error) => { 
                            if(error.message === "UNAUTHORIZED"){
                                logout();
                            }else{
                                showSnackNotificationPopup({status: "FAILED", text: t(error.message)});
                            }
                        })  
                        .finally(() => {
                            setIsButtonLoading(false);
                        }) 
                };
                reader.readAsDataURL(event.target.files[0]);
                break;
            case "BACK":
                setBackImageUploaded(false);
                reader.onloadend = () => {
                    setIsButtonLoading(true);
                    sendImage(sessionId, reader.result, "document-back")
                        .then((resp) => {
                            if (resp === false) {
                                showSnackNotificationPopup({status: "FAILED", text: "Image upload failed"});
                                return;
                            }
                            setBackImage(event.target.files[0]);
                            setBackImageUploaded(true);
                        })
                        .catch((error) => { 
                            if(error.message === "UNAUTHORIZED"){
                                logout();
                            }else{
                                showSnackNotificationPopup({status: "FAILED", text: t(error.message)});
                            }
                        })   
                        .finally(() => {
                            setIsButtonLoading(false);
                        }) 
                };
                reader.readAsDataURL(event.target.files[0]);
                break;
            case "SELFY":
                setIsButtonLoading(true);
                setSelfyImageUploaded(false);
                reader.onloadend = () => {
                    sendImage(sessionId, reader.result, "face")
                        .then((resp) => {
                            if (resp === false) {
                                showSnackNotificationPopup({status: "FAILED", text: "Image upload failed"});
                                return;
                            }
                            setSelfyImage(event.target.files[0]);
                            setSelfyImageUploaded(true);
                        })
                        .catch((error) => { 
                            if(error.message === "UNAUTHORIZED"){
                                logout();
                            }else{
                                showSnackNotificationPopup({status: "FAILED", text: t(error.message)});
                            }
                        })  
                        .finally(() => {
                            setIsButtonLoading(false);
                        }) 
                };
                reader.readAsDataURL(event.target.files[0]);
                break;
            case "PASSPORT":
                setPassportImageUploaded(false)
                setIsButtonLoading(true);
                reader.onloadend = () => {
                    sendImage(sessionId, reader.result, "document-front")
                        .then((resp) => {
                            if (resp === false) {
                                showSnackNotificationPopup({status: "FAILED", text: "Image upload failed"});
                                return;
                            }
                            setPassportImage(event.target.files[0]);
                            setPassportImageUploaded(true);
                        })
                        .catch((error) => { 
                            if(error.message === "UNAUTHORIZED"){
                                logout();
                            }else{
                                showSnackNotificationPopup({status: "FAILED", text: t(error.message)});
                            }
                        })  
                        .finally(() => {
                            setIsButtonLoading(false);
                        }) 
                };
                reader.readAsDataURL(event.target.files[0]);
                break;
            case "PASSPORT.SELFY":
                setPassportSelfyImageUploaded(false)
                setIsButtonLoading(true);
                reader.onloadend = () => {
                    sendImage(sessionId, reader.result, "face")
                        .then((resp) => {
                            if (resp === false) {
                                showSnackNotificationPopup({status: "FAILED", text: "Image upload failed"});
                                return;
                            }
                            setPassportSelfyImage(event.target.files[0]);
                            setPassportSelfyImageUploaded(true);
                        })
                        .catch((error) => { 
                            if(error.message === "UNAUTHORIZED"){
                                logout();
                            }else{
                                showSnackNotificationPopup({status: "FAILED", text: t(error.message)});
                            }
                        })
                        .finally(() => {
                            setIsButtonLoading(false);
                        })
                };
                reader.readAsDataURL(event.target.files[0]);
                break;
            default:
                break;
        }
        setIsPopupOpen(false);
    }

    function clearImages() {
        setFrontImage(null);
        setBackImage(null);
        setSelfyImage(null);
        setPassportImage(null);
        setPassportSelfyImage(null);
        setFrontImageUploaded(false);
        setBackImageUploaded(false);
        setSelfyImageUploaded(false);
        setPassportImageUploaded(false);
    }

    useEffect(() => {
        if (activeTab === 0) {            
            if (frontImageUploaded && backImageUploaded && selfyImageUploaded) {
                setIsAllImageSubmited(true);
            } else {
                setIsAllImageSubmited(false)
            }
        } else {
            if (passportImageUploaded && passportSelfyImageUploaded) {
                setIsAllImageSubmited(true);
            } else {
                setIsAllImageSubmited(false);
            }
        }
    },[frontImageUploaded,backImageUploaded,selfyImageUploaded,passportImageUploaded,passportSelfyImageUploaded])

    function submit() {
        if (isAllImageSubmited) {
            setIsButtonLoading(true);
            imageSubmit(sessionId)
                .then((resp) => {
                    if (resp === false) {
                        showSnackNotificationPopup({status: "FAILED", text: "Image submit failed"});
                        return;
                    }
                })
                .catch((error) => { 
                    if(error.message === "UNAUTHORIZED"){
                        logout();
                    }else{
                        showSnackNotificationPopup({status: "FAILED", text: t('submit.failed')});
                    }
                })
                .finally(() => {
                    setIsButtonLoading(false);
                })
                
        }
    }

    return (
        <>
            <div className={styles.veriffContainer}>
                <div>
                    <h1 className={styles.veriffHeader}>{t("veriff.upload")}</h1>
                    <h1 className={styles.veriffHeaderText}>{t("veriff.upload.text")}</h1>
                    <header className={styles.switchContainer}>
                        <div onClick={() => { setActiveTab(0); clearImages() }} className={styles.switchContainerElement + (activeTab === 0 ? " " + styles.active : "")} >{t("id.card")}</div>
                        <div onClick={() => { setActiveTab(1); clearImages() }} className={styles.switchContainerElement + (activeTab === 1 ? " " + styles.active : "")} >{t("passport")}</div>
                    </header>
                    <div className={styles.activityContainer}>
                        {activeTab === 0?
                            <ID
                                needUpload = {needUpload}
                                frontImage={frontImage} backImage={backImage} selfyImage={selfyImage}
                                setFrontImage={setFrontImage} setBackImage={setBackImage} setSelfyImage={setSelfyImage}
                                setFrontImageUploaded={setFrontImageUploaded} setBackImageUploaded={setBackImageUploaded} setSelfyImageUploaded={setSelfyImageUploaded}
                                setIsPopupOpen={setIsPopupOpen} setPopupOpenedFor={setPopupOpenedFor}
                            /> :
                            <Passport
                                needUpload = {needUpload}
                                passportImage={passportImage} passportSelfyImage={passportSelfyImage}
                                setPassportImage={setPassportImage} setPassportSelfyImage={setPassportSelfyImage}   
                                setPassportImageUploaded={setPassportImageUploaded} setPassportSelfyImageUploaded={setPassportSelfyImageUploaded} 
                                setIsPopupOpen={setIsPopupOpen} setPopupOpenedFor={setPopupOpenedFor}
                            />}
                    </div>
                </div>
                <button onClick={submit} className={styles.submitButton + " " + (isAllImageSubmited ?  "" : styles.disabled) + " " + (isButtonLoading ? styles.loading : "")} type="submit">
                    {isButtonLoading?
                        <div className={styles.spinLoading}>
                            <div className={styles.spinLoadingOuterBlock}>
                                <div className={styles.spinLoadingBlock + " " + styles.one}></div>
                            </div>
                            <div className={styles.spinLoadingOuterBlock}>
                                <div className={styles.spinLoadingBlock + " " + styles.two}></div>
                            </div>
                            <div className={styles.spinLoadingOuterBlock}>
                                <div className={styles.spinLoadingBlock + " " + styles.three}></div>
                            </div>
                        </div>
                    :
                        t("continue")
                    }
                </button>
            </div>
            {isPopupOpen &&
                <Popup header={translations[popupOpenedFor]} hidePopup={setIsPopupOpen}>
                    <div className={styles.popupOptions}>
                        <label>
                            <div className={styles.popupOption}>
                                <p>{t("take.picture")}</p>
                                {popupOpenedFor === "SELFY" || popupOpenedFor === "PASSPORT.SELFY" ? 
                                    <input
                                        type="file"
                                        name="myImage"
                                        accept="image/*"
                                        capture="user"
                                        style={{display:'none'}}
                                        onChange={(event) => uploadImg(event)}
                                    />
                                    :
                                        <input
                                        type="file"
                                        name="myImage"
                                        accept="image/*"
                                        capture="environment"
                                        style={{display:'none'}}
                                        onChange={(event) => uploadImg(event)}
                                    />
                                }
                            </div>
                        </label>
                        <label>
                            <div className={styles.popupOption}>
                                <p>{t("upload.from.galery")}</p>
                                <input
                                    type="file"
                                    name="myImage"
                                    accept="image/*"
                                    style={{display:'none'}}
                                    onChange={(event) => uploadImg(event)}
                                />
                            </div>
                        </label>
                    </div>
                </Popup>
            }
        </>
    )
}

export default Upload;