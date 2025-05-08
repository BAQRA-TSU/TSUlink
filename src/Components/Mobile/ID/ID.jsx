import { useTranslation } from 'react-i18next';
import { IDBackIcon, IDFrontIcon, RefreshIcon, SelfyIcon, TrashIcon} from '../../../assets/svg/svg';
import styles from './ID.module.css'
import PropTypes from 'prop-types';

const ID = ({needUpload, setIsPopupOpen ,setPopupOpenedFor, frontImage, backImage, selfyImage, setFrontImage, setBackImage, setSelfyImage, setFrontImageUploaded, setBackImageUploaded, setSelfyImageUploaded}) => {
    const [t] = useTranslation()


    return (
        <div className={styles.IDWrapper}>
            { needUpload.document &&
                <div className={styles.divWrapper}>
                    <div onClick={() => { if (!frontImage) { setIsPopupOpen(true); setPopupOpenedFor("FRONT") }  }} className={styles.card}>
                        {!frontImage && 
                            <div className={styles.cardIcon}>
                                <IDFrontIcon/>
                            </div>
                        }
                        <p className={styles.text}>{t("front.side")}</p>
                        {frontImage && 
                            <div className={styles.imageWrapper}>
                                <span className={styles.idBackground1}></span>
                                <img
                                alt="Not Found"
                                className={styles.documentImage}
                                src={URL.createObjectURL(frontImage)}
                                />
                                <span className={styles.idBackground2}></span>
                            </div>
                        }
                        {frontImage && 
                            <div className={styles.controlsWrapper}>
                                <span onClick={() => { setIsPopupOpen(true); setPopupOpenedFor("FRONT")}} className={styles.controlIcons}><RefreshIcon/></span>
                                <span className={styles.controlIcons} onClick={() => {setFrontImage(null); setFrontImageUploaded(false)}}><TrashIcon/></span>
                            </div>
                        }
                    </div>
                    <div onClick={() => { if (!backImage) { setIsPopupOpen(true); setPopupOpenedFor("BACK") } }} className={styles.card}>
                        {!backImage && 
                            <div className={styles.cardIcon}>
                                <IDBackIcon/>
                            </div>
                        }
                        <p className={styles.text}>{t("back.side")}</p>
                        {backImage && 
                            <div className={styles.imageWrapper}>
                                <span className={styles.idBackground1}></span>
                                <img
                                alt="Not Found"
                                className={styles.documentImage}
                                src={URL.createObjectURL(backImage)}
                                />
                                <span className={styles.idBackground2}></span>
                            </div>
                        }
                        {backImage && 
                            <div className={styles.controlsWrapper}>
                                <span onClick={() => { setIsPopupOpen(true); setPopupOpenedFor("BACK")}} className={styles.controlIcons}><RefreshIcon/></span>
                                <span className={styles.controlIcons} onClick={() => {setBackImage(null); setBackImageUploaded(false)}}><TrashIcon/></span>
                            </div>
                        }
                    </div>
                </div>
            }
            { needUpload.biometric &&
                <div className={styles.divWrapper}>
                    <div onClick={() => { if (!selfyImage) { setIsPopupOpen(true); setPopupOpenedFor("SELFY") } }}  className={styles.card + " " + (selfyImage ? styles.selfy: "")}>
                        {!selfyImage && 
                            <div className={styles.cardIcon}>
                                <SelfyIcon/>
                            </div>
                        }
                        {!selfyImage && 
                            <p className={styles.text}>{t("upload.selfy")}</p>
                        }
                        {selfyImage && 
                            <div className={styles.selfyWrapper}>
                                <span className={styles.selfyBackground1}></span>
                                <img
                                alt="Not Found"
                                className={styles.selfyImage}
                                src={URL.createObjectURL(selfyImage)}
                                />
                                <span className={styles.selfyBackground2}></span>
                            </div>
                        }
                        {selfyImage && 
                            <div className={styles.controlsWrapper}>
                                <span onClick={() => { setIsPopupOpen(true); setPopupOpenedFor("SELFY")}} className={styles.controlIcons}><RefreshIcon/></span>
                                <span className={styles.controlIcons} onClick={() => {setSelfyImage(null); setSelfyImageUploaded(false)}}><TrashIcon/></span>
                            </div>
                        }
                    </div>
                </div>
            }
        </div>
    );
}

export default ID

ID.propTypes = {
    needUpload: PropTypes.shape({
        document: PropTypes.bool.isRequired,    // Indicates if document upload is needed
        biometric: PropTypes.bool.isRequired   // Indicates if biometric upload is needed
    }).isRequired,
    setIsPopupOpen: PropTypes.func.isRequired, // Function to control popup visibility
    setPopupOpenedFor: PropTypes.func.isRequired, // Function to set which upload popup is opened
    frontImage: PropTypes.instanceOf(File),    // Front image file (if uploaded)
    backImage: PropTypes.instanceOf(File),     // Back image file (if uploaded)
    selfyImage: PropTypes.instanceOf(File),    // Selfie image file (if uploaded)
    setFrontImage: PropTypes.func.isRequired,  // Function to set front image
    setBackImage: PropTypes.func.isRequired,   // Function to set back image
    setSelfyImage: PropTypes.func.isRequired,  // Function to set selfie image
    setFrontImageUploaded: PropTypes.func.isRequired, // Function to set front image uploaded state
    setBackImageUploaded: PropTypes.func.isRequired,  // Function to set back image uploaded state
    setSelfyImageUploaded: PropTypes.func.isRequired  // Function to set selfie image uploaded state
};