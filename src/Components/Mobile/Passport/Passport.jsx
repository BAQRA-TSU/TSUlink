import { useTranslation } from 'react-i18next';
import { PasportIcon, RefreshIcon, SelfyIcon, TrashIcon} from '../../../assets/svg/svg';
import styles from './Passport.module.css'
import PropTypes from 'prop-types';

const Passport = ({needUpload, setIsPopupOpen, setPopupOpenedFor, passportImage, setPassportImage, passportSelfyImage, setPassportSelfyImage, setPassportImageUploaded, setPassportSelfyImageUploaded}) => {
    const [t] = useTranslation()

    return (
        <div className={styles.PassportWrapper}>
            { needUpload.document &&
                <div className={styles.divWrapper}>
                    <div onClick={() => { if (!passportImage) { setIsPopupOpen(true); setPopupOpenedFor("PASSPORT") } }}  className={styles.card + " " + (passportImage ? styles.added: "")}>
                        {!passportImage && 
                            <div className={styles.cardIcon}>
                                <PasportIcon/>
                            </div>
                        }
                        {!passportImage && 
                            <p className={styles.text}>{t("upload.passport")}</p>
                        }
                        {passportImage && 
                            <div className={styles.imageWrapper}>
                                <span className={styles.imageBackground1}></span>
                                <img
                                alt="Not Found"
                                className={styles.image}
                                src={URL.createObjectURL(passportImage)}
                                />
                                <span className={styles.imageBackground2}></span>
                            </div>
                        }
                        {passportImage && 
                            <div className={styles.controlsWrapper}>
                                <span onClick={() => { setIsPopupOpen(true); setPopupOpenedFor("SELFY")}} className={styles.controlIcons}><RefreshIcon/></span>
                                <span className={styles.controlIcons} onClick={() => {setPassportImage(null); setPassportImageUploaded(false)}}><TrashIcon/></span>
                            </div>
                        }
                    </div>
                </div>
            }
            { needUpload.biometric &&
                <div className={styles.divWrapper}>
                    <div onClick={() => { if (!passportSelfyImage) { setIsPopupOpen(true); setPopupOpenedFor("PASSPORT.SELFY") } }}  className={styles.card + " " + (passportSelfyImage ? styles.added: "")}>
                        {!passportSelfyImage && 
                            <div className={styles.cardIcon}>
                                <SelfyIcon/>
                            </div>
                        }
                        {!passportSelfyImage && 
                            <p className={styles.text}>{t("upload.selfy")}</p>
                        }
                        {passportSelfyImage && 
                            <div className={styles.selfyWrapper}>
                                <span className={styles.selfyBackground1}></span>
                                <img
                                alt="Not Found"
                                className={styles.selfyImage}
                                src={URL.createObjectURL(passportSelfyImage)}
                                />
                                <span className={styles.selfyBackground2}></span>
                            </div>
                        }
                        {passportSelfyImage && 
                            <div className={styles.controlsWrapper}>
                                <span onClick={() => { setIsPopupOpen(true); setPopupOpenedFor("PASSPORT.SELFY")}} className={styles.controlIcons}><RefreshIcon/></span>
                                <span className={styles.controlIcons} onClick={() => {setPassportSelfyImage(null); setPassportSelfyImageUploaded(false)}}><TrashIcon/></span>
                            </div>
                        }
                    </div>
                </div>
            }
        </div>
    );
}

export default Passport;

Passport.propTypes = {
  needUpload: PropTypes.shape({
    document: PropTypes.bool.isRequired,   // Indicates if document upload is needed
    biometric: PropTypes.bool.isRequired  // Indicates if biometric upload is needed
  }).isRequired,
  setIsPopupOpen: PropTypes.func.isRequired,           // Function to toggle the popup visibility
  setPopupOpenedFor: PropTypes.func.isRequired,        // Function to set the type of popup
  passportImage: PropTypes.instanceOf(File),           // File object for the passport image (nullable)
  setPassportImage: PropTypes.func.isRequired,         // Function to set the passport image
  passportSelfyImage: PropTypes.instanceOf(File),      // File object for the selfie image (nullable)
  setPassportSelfyImage: PropTypes.func.isRequired,    // Function to set the selfie image
  setPassportImageUploaded: PropTypes.func.isRequired, // Function to update passport image upload status
  setPassportSelfyImageUploaded: PropTypes.func.isRequired // Function to update selfie image upload status
};