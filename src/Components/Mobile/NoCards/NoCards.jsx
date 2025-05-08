import styles from "./NoCards.module.css";
import { useTranslation } from "react-i18next";
import PropTypes from 'prop-types';


const NoCards = ({setIsDepositPopupOpen, setIsWarningVisible,setIsDraggable}) => { 
    const [t] = useTranslation();

    function handleSubmit() {
        setIsWarningVisible(true)
        setIsDepositPopupOpen(false)
        setIsDraggable(true)
    }

    return (
        <div className={styles.noCardsWrapper}>
            <span className={styles.noCardsImg}></span>
            <h1 className={styles.noCardHeader}>{t("need.to.add.card.header")}</h1>
            <p className={styles.noCardText}>{t("need.to.add.card.text")}</p>
            <button type="submit" onClick={() => handleSubmit()} className={styles.submitButton}>
                    {t("continue")}
            </button>
        </div>
    )
}
export default NoCards;

NoCards.propTypes = {
  setIsDepositPopupOpen: PropTypes.func.isRequired, // Function to toggle deposit popup visibility
  setIsWarningVisible: PropTypes.func.isRequired,  // Function to toggle warning visibility
  setIsDraggable: PropTypes.func.isRequired        // Function to toggle draggable state
};