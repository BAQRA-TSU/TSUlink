import { useState } from "react";
import styles from "./Activity.module.css";
import FavoritesComponent from "../Favorites/Favorites";
import RecentComponent from "../Recent/Recent";
import { useTranslation } from "react-i18next";

const ActivityComponent = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [t] = useTranslation();


    return (
        <div className={styles.activityWrapper}>
            <header className={styles.switchContainer}>
                <div onClick={() => setActiveTab(0)} className={styles.switchContainerElement + (activeTab === 0 ? " " + styles.active : "")} >{t("activity.recent")}</div>
                <div onClick={() => setActiveTab(1)} className={styles.switchContainerElement + (activeTab === 1 ? " " + styles.active : "")} >{t("activity.favorites")}</div>
            </header>

            <div className={styles.activityContainer}>
                {activeTab === 0? <RecentComponent/> : <FavoritesComponent/>}
            </div>
        </div>
    );
};

export default ActivityComponent;
