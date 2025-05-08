import { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';
const NotificationPopupContext = createContext();

export const useNotificationPopup = () => {
    return useContext(NotificationPopupContext);
};

export const NotificationPopupProvider = ({ children }) => {
    const [visibility, setVisibility] = useState(false);
    const [snackVisibility, setSnackVisibility] = useState(false);
    const [notificationData, setNotificationData] = useState({});
    const [snackNotificationData, setSnackNotificationData] = useState({});

    const showNotificationPopup = (data) => {
        setNotificationData(data);
        setVisibility(true);
    };
    
    const hideNotificationPopup = () => {
        setVisibility(false);
    };
    
    const showSnackNotificationPopup = (data) => {
        setSnackNotificationData(data);
        setSnackVisibility(true);
    };

    const hideSnackNotificationPopup = () => {
        setSnackVisibility(false);
    };

    return (
        <NotificationPopupContext.Provider value={{ visibility, snackVisibility, notificationData, snackNotificationData , showNotificationPopup, showSnackNotificationPopup , hideNotificationPopup, hideSnackNotificationPopup }}>
            {children}
        </NotificationPopupContext.Provider>
    );
};

NotificationPopupProvider.propTypes = {
    children: PropTypes.node.isRequired,
};