import { useState } from "react";
import styles from "./WarningPopup.module.css";
import { WarningCircleIcon } from "../../../assets/svg/svg";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

const WarningPopup = ({setShowPopup, submit, warningHeader ,warningText, buttonSubmit, buttonCancel}) => {
    const [t] = useTranslation()
    const [fadeOut, setFadeOut] = useState(false);

    function hidePopup() {
            setFadeOut(true);
            setTimeout(() => {
                setShowPopup(false);
            }, 200);
    }

    return (
        <div
            className={styles.popupComponent}
        >
            <div
                className={
                    styles.popupContainer +
                    (fadeOut ? " " + styles.fadeOut : "")
                }
            >
                <div className={styles.innerContainer}>
                    <WarningCircleIcon />
                    <h1 className={styles.header}>{t(warningHeader)} </h1>
                    <p className={styles.text}>{t(warningText)}</p>
                    <div className={styles.submit} onClick={submit}>{t(buttonSubmit)}</div>
                    <div className={styles.close} onClick={hidePopup}>{t(buttonCancel)}</div>
                </div>
            </div>
        </div>
    );
};

export default WarningPopup;

WarningPopup.propTypes = {
    setShowPopup: PropTypes.func.isRequired,
    submit: PropTypes.func.isRequired,
    warningHeader: PropTypes.string.isRequired,
    warningText: PropTypes.string.isRequired,
    buttonSubmit: PropTypes.string.isRequired,
    buttonCancel: PropTypes.string.isRequired,
};