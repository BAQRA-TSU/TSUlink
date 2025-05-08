import { useEffect, useRef, useState } from 'react';
import styles from './Popup.module.css'
// import { IsMobileBrowser } from '../../../Services/common';
import { CloseIcon } from '../../../assets/svg/svg';
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";


const Popup = ({hidePopup, header, children}) => {
    const wrapperRef = useRef(null);
    const [fadeOut, setFadeOut] = useState(false)
    // const [mouseY, setMouseY] = useState(0);
    // const [isDragging, setIsDragging] = useState(0);
    const [t] = useTranslation();

    function hidePopupFunction(element) {
        if (element.target === wrapperRef.current) {
            setFadeOut(true);
            setTimeout(() => { 
                hidePopup(false);
            }, 500)
        }
    }

    useEffect(() => {
        
        const handleSwipe = (e) => { 
            if (e.detail.dir === "down") {
                setFadeOut(true);
                setTimeout(() => { 
                    hidePopup(false);
                }, 500)
            }
        }

        document.addEventListener('swiped-down', handleSwipe);
        return () => {
            document.removeEventListener('swiped-down', handleSwipe);
        };
    },[])  

    return (
        <div onClick={(event) => hidePopupFunction(event)} ref={wrapperRef} className={styles.popupComponent + (fadeOut? " " + styles.fadeOut : "")}>
            <div className={styles.popupContainer + (fadeOut ? " " + styles.fadeOut : "")}>
                <div className={styles.headerComponent + " " + (header === "" ? styles.hidden :"")}>
                    <div className={styles.header}>
                    <h1 className={styles.headerText}>{t(header)}</h1>
                    <div onClick={() => { hidePopupFunction({ target: wrapperRef.current }); }}><CloseIcon/></div>
                    </div>
                </div>
                <div className={styles.contentContainer}>
                    {children}
                </div>
            </div>
        </div>
    );
}

export default Popup;

Popup.propTypes = {
    hidePopup: PropTypes.func.isRequired, // Function to hide the popup
    header: PropTypes.string, // The header text to display at the top of the popup
    children: PropTypes.node, // Dynamic content passed as children to the popup
};