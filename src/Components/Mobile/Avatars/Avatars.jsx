import { useEffect, useState } from "react";
import styles from "./Avatars.module.css";
import { useTranslation } from "react-i18next";
import PropTypes from 'prop-types';

const AvatarsComponent = ({hidePopup, selectedAvatar, selectAvatar }) => {
    const [t] = useTranslation();
    const [localSelectedAvatar, setLocalSelectedAvatar] = useState(selectedAvatar)
    const [avatarListFirstRow, setAvatarListFirstRow] = useState();
    const [avatarListSecondRow, setAvatarListSecondRow] = useState();

    useEffect(() => {
        let avatarListFirstRow = [];
        for (var c = 0; c < 4; c++) {
            avatarListFirstRow[c] = 0;
        }
        avatarListFirstRow = avatarListFirstRow.map((_, index) => {
            return <img key={0+index} alt="avatar" className={styles.avatarImage + " " + (localSelectedAvatar === index + 1 ? styles.selected : "")} onClick={() => setLocalSelectedAvatar(index + 1)} src={`./avatars/avatar${index + 1}.png`}></img>
        })

        let avatarListSecondRow = [];
        for (var c1 = 4; c1 < 8; c1++) {
            avatarListSecondRow[c1] = 0;
        }
        avatarListSecondRow = avatarListSecondRow.map((_, index) => {
            return <img key={1+index} alt="avatar" className={styles.avatarImage + " " + (localSelectedAvatar === index + 1 ? styles.selected : "")} onClick={() => setLocalSelectedAvatar(index + 1)} src={`./avatars/avatar${index + 1}.png`}></img>
        })
        setAvatarListFirstRow(avatarListFirstRow);
        setAvatarListSecondRow(avatarListSecondRow);
    },[localSelectedAvatar])
   
    //     .fill(0).map((_, index) => {
    //     return (
    //        
    //     )
    // })

    return (
        <div className={styles.avatarContainer}>
            <div className={styles.avatarWrapper}>
                <div className={styles.row}>{avatarListFirstRow}</div>
                <div className={styles.row}>{avatarListSecondRow}</div>
            </div>
            <div className={styles.submit} onClick={() => {
                hidePopup(false);
                selectAvatar(localSelectedAvatar)
            }}>{t("confirm")}</div>
        </div>
    );
};

export default AvatarsComponent;


AvatarsComponent.propTypes = {
    hidePopup: PropTypes.func.isRequired,
    selectedAvatar: PropTypes.number.isRequired,
    selectAvatar: PropTypes.func.isRequired,
};