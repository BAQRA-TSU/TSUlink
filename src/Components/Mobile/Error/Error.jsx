import { useTranslation } from 'react-i18next';
import styles from './Error.module.css'
import { CloseRed } from '../../../assets/svg/svg';

const Error = () => {
    const [t] = useTranslation();

    return (
        <div className={styles.errorComponent}>
        <div className={styles.topComponent}>
            <div className={styles.closeRed}>
                <CloseRed/>
            </div>
            <div className={styles.textsDiv}>
                <h1 className={styles.errorHeader}>{t("general.error.header")}</h1>
                <p className={styles.description}>{t("general.error.description")}</p>
            </div> 
        </div>
            <button onClick={() => window.location.reload()} className={styles.button}>{t("try.again")}</button>
      </div>
    )
}

export default Error