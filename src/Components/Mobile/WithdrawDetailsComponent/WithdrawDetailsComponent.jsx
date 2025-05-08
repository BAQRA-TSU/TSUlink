import styles from "./WithdrawDetailsComponent.module.css";
import { useTranslation } from "react-i18next";
import { BOGIcon, PayGeIcon, TBCIcon } from "../../../assets/svg/svg";
import { NavLink } from "react-router-dom";

const WithdrawDetailsComponent = () => {
    const [t] = useTranslation();

    return (
        <div className={styles.withdrawDetailsWrapper}>
            <div className={styles.detailComponent}>
                <span className={styles.logo}><TBCIcon/></span>
                <div className={styles.bottomDiv}>
                    <div className={styles.leftSide}>
                        <p>{t("one.time")}</p>
                        <p>{t("24.hr")}</p>
                    </div>
                    <div className={styles.rightSide}>
                        <span>50 000 ₾</span>
                        <span>250 000 ₾</span>
                    </div>
                </div>
            </div>
            <div className={styles.detailComponent}>
                <span className={styles.logo}><BOGIcon/></span>
                <div className={styles.bottomDiv}>
                    <div className={styles.leftSide}>
                        <p>{t("one.time")}</p>
                        <p>{t("24.hr")}</p>
                    </div>
                    <div className={styles.rightSide}>
                        <span>50 000 ₾</span>
                        <span>250 000 ₾</span>
                    </div>
                </div>
            </div>
            <div className={styles.detailComponent}>
                <div className={styles.detailHeaderDiv}>
                    <PayGeIcon/>
                    <NavLink to={"https://www.youtube.com/watch?v=dQw4w9WgXcQ"} target="_blank" className={styles.detailHeaderText}>{t("go.to.site")}</NavLink>
                </div>
                <div className={styles.bottomDiv}>
                    <div className={styles.leftSide}>
                        <p>{t("one.time")}</p>
                        <p>{t("24.hr")}</p>
                    </div>
                    <div className={styles.rightSide}>
                        <span>50 000 ₾</span>
                        <span>250 000 ₾</span>
                    </div>
                </div>
            </div>
            <div className={styles.detailComponent}>
                <span className={styles.emoney}></span>
                <div className={styles.bottomDiv}>
                    <div className={styles.leftSide}>
                        <p>{t("one.time")}</p>
                        <p>{t("24.hr")}</p>
                    </div>
                    <div className={styles.rightSide}>
                        <span>50 000 ₾</span>
                        <span>250 000 ₾</span>
                    </div>
                </div>
            </div>
            <div className={styles.detailComponent}>
                <p>{t("pay.machines")}</p>
                <div className={styles.bottomDiv}>
                    <div className={styles.leftSide}>
                        <p>{t("one.time")}</p>
                        <p>{t("24.hr")}</p>
                    </div>
                    <div className={styles.rightSide}>
                        <span>3 000 ₾</span>
                        <span>{t("unlimited")}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WithdrawDetailsComponent;
