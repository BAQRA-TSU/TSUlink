import { useState } from "react";
import styles from "./Providers.module.css";
import { useTranslation } from "react-i18next";
import { AmusenetLogo, DigitalLogo, PragmaticLogo } from "../../../assets/svg/svg";
import PropTypes from "prop-types";

const ProvidersComponent = ({hidePopup, providerSortTypes, sortByProvider }) => {
    const [selectedProviders, setSelectedProviders] = useState(providerSortTypes);
    const [t] = useTranslation();


    return (
        <>
            <div className={styles.providersWrapper}>
                <div className={styles.providerOuterDiv + " " + (selectedProviders.includes("EGT_AMUSNET") ? styles.selected: "")}>
                    <div onClick={() => {
                        if (selectedProviders.includes("EGT_AMUSNET")) {
                            setSelectedProviders(prevArray => prevArray.filter(element => element !== "EGT_AMUSNET"))

                        } else {
                            setSelectedProviders(prevArray => [...prevArray, "EGT_AMUSNET"])
                        }
                    }} className={styles.providerWrapper}>
                        <div className={styles.providerTopDiv}>
                            <input className={styles.checkbox} onChange={() => { }} checked={selectedProviders.includes("EGT_AMUSNET")} type="checkbox"></input>
                        </div>
                        <div className={styles.logo}><AmusenetLogo /></div>
                        <div className={styles.gamesAmount}>12 {t("game")}</div>
                    </div>
                    <div className={styles.background}></div> 
                </div>
                <div className={styles.providerOuterDiv + " " + (selectedProviders.includes("EGT_DIGITAL")? styles.selected: "")}>
                    <div onClick={()=>{
                        if (selectedProviders.includes("EGT_DIGITAL")) {
                            setSelectedProviders(prevArray => prevArray.filter(element => element !== "EGT_DIGITAL"))
                        } else {
                            setSelectedProviders(prevArray => [...prevArray, "EGT_DIGITAL"])

                        }
                    }} className={styles.providerWrapper}>
                        <div className={styles.providerTopDiv}>
                            <input className={styles.checkbox} onChange={() => { }} checked={selectedProviders.includes("EGT_DIGITAL")} type="checkbox"></input>
                        </div>
                        <div className={styles.logo}><DigitalLogo /></div>
                        <div className={styles.gamesAmount}>12 {t("game")}</div>
                    </div>
                    <div className={styles.background}></div> 
                </div>
                <div className={styles.providerOuterDiv + " " + (selectedProviders.includes("PRAGMATIC")? styles.selected: "")}>
                    <div onClick={()=>{
                        if (selectedProviders.includes("PRAGMATIC")) {
                            setSelectedProviders(prevArray => prevArray.filter(element => element !== "PRAGMATIC"))
                        } else {
                            setSelectedProviders(prevArray => [...prevArray, "PRAGMATIC"])

                        }
                    }} className={styles.providerWrapper}>
                        <div className={styles.providerTopDiv}>
                            <input className={styles.checkbox} onChange={() => { }} checked={selectedProviders.includes("PRAGMATIC")} type="checkbox"></input>
                        </div>
                        <div className={styles.logo}><PragmaticLogo /></div>
                        <div className={styles.gamesAmount}>12 {t("game")}</div>
                    </div>
                    <div className={styles.background}></div> 
                </div>
            </div>
            <div className={styles.submit} onClick={() => {
                sortByProvider(selectedProviders);
                hidePopup(false);
            }}>{t("save.changes")}</div>
        </>
    );
};

export default ProvidersComponent;


ProvidersComponent.propTypes = {
    hidePopup: PropTypes.func.isRequired, // Function to hide the popup
    providerSortTypes: PropTypes.arrayOf(PropTypes.string).isRequired, // Array of provider sort type strings
    sortByProvider: PropTypes.func.isRequired, // Function to sort items by selected providers
};