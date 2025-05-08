
import { useState } from "react";
import styles from "./rules.module.css";
import { useTranslation } from "react-i18next";
import {
    DownArrow,
    UpArrow,
} from "../../../../../assets/svg/svg";

const Rules = () => {
    ;
    const [t] = useTranslation();
    const [openSections, setOpenSections] = useState({
        introduction: false,
        age: false,
        law: false,
    });

    function accordeon(params, section) {
        setOpenSections((prevState) => ({
            ...prevState,
            [section]: !prevState[section],
        }));
        var panel = params.target.parentElement.nextElementSibling;
        if (panel.style.display === "flex") {
            panel.style.display = "none";
            params.target.style.borderBottomLeftRadius = 16 + "px";
            params.target.style.borderBottomRightRadius = 16 + "px";
        } else {
            panel.style.display = "flex";
            params.target.style.borderBottomLeftRadius = 0;
            params.target.style.borderBottomRightRadius = 0;
        }
    }

    return (
        <div className={styles.rulesContainer}>
            <h1 className={styles.containerHeader}>
                {t("loyalty.rules.header")}
            </h1>
            <div className={styles.rulesNavigation}>
                <span>{t('loyalty.rules.general')}</span>
                <span>{t('loyalty.rules.benefits')}</span>
                <span>{t('loyalty.rules.levels')}</span>
            </div>
            <div className={styles.rulesContent}>
                <div className={styles.buttonDiv}>
                    <button
                        onClick={(e) => accordeon(e, "introduction")}
                        className={styles.accordion}
                    >
                        {t("rules.introduction.header")}
                    </button>
                    <div className={styles.arrow}>
                        {openSections.introduction ? <UpArrow /> : <DownArrow />}
                    </div>
                </div>
                <div className={styles.panel}>
                    {t("rules.introduction.description")}
                </div>

                <div className={styles.buttonDiv}>
                    <button
                        onClick={(e) => accordeon(e, "age")}
                        className={styles.accordion}
                    >
                        {t("rules.age.header")}
                    </button>
                    <div className={styles.arrow}>
                        {openSections.age ? <UpArrow /> : <DownArrow />}
                    </div>
                </div>
                <div className={styles.panel}>{t("rules.age.description")}</div>

                <div className={styles.buttonDiv}>
                    <button
                        onClick={(e) => accordeon(e, "law")}
                        className={styles.accordion}
                    >
                        {t("rules.law.header")}
                    </button>
                    <div className={styles.arrow}>
                        {openSections.law ? <UpArrow /> : <DownArrow />}
                    </div>
                </div>
                <div className={styles.panel}>{t("rules.law.description")}</div>
            </div>
        </div>
    );
};

export default Rules;
