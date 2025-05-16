import { createContext, useState, useEffect, useRef } from 'react';
import { GetAccessToken, isLogedIn, RefreshToken, SetAccessToken, SetRefreshToken } from './common';
import { useLocation, useNavigate } from 'react-router-dom';
// import { useNotificationPopup } from './notificationPopupProvider';
import PropTypes from 'prop-types';

const UserContext = createContext();
let sse;

const UserProvider = ({ children }) => {
  // const { showNotificationPopup, showSnackNotificationPopup } = useNotificationPopup();
  const [userData, setUserData] = useState();
  const [wallet, setWallet] = useState();
  const [changeUser, setChangeUser] = useState();
  const history = useNavigate()

  useEffect(() => {
    if (isLogedIn()) {
      // getWallet(currencySymbols).then((resp) => {
      //   if (resp === false) {
      //     showSnackNotificationPopup({status: "FAILED", text: "Wallet fetch failed"});
      //     return;
      //   }

      //   setWallet(prevWallet => ({
      //     ...prevWallet,
      //     ...resp,  
      //   }));

      //   getCard()
      //     .then((resp) => {
      //       if (resp === false) {
      //         showSnackNotificationPopup({status: "FAILED", text: "Card fetch failed"});
      //         return;
      //       }
      //       setWallet(prevWallet => ({
      //         ...prevWallet,
      //         ...resp
      //       }))
      //     })
      //     .catch((error) => {
      //       if(error.message === "UNAUTHORIZED"){
      //         logout();
      //       }else{
      //         showSnackNotificationPopup({status: "FAILED", text: error.message});
      //       }
      //     })

      // }).catch((error) => {
      //   if(error.message === "UNAUTHORIZED"){
      //     logout();
      //   }else{
      //     showSnackNotificationPopup({status: "FAILED", text: error.message});
      //   }
      // })      
      
      // connectSSE();

      // getMe()
      //   .then((resp) => {
      //     if (resp === false) {
      //       showSnackNotificationPopup({status: "FAILED", text: "Me fetch failed"});
      //       return;
      //     }
      //     if(resp.dixaToken){
      //       window._dixa_.invoke("setUserIdentity", { type: "verified", payload: { type: "jwe", token: resp.dixaToken } });
      //     }
      //     setUserData(resp);
      //   }).catch((error) => {
      //     if(error.message === "UNAUTHORIZED"){
      //       logout();
      //     }else{
      //       showSnackNotificationPopup({status: "FAILED", text: error.message});
      //     }
      //   })
    }else{
      logout()
    }
  }, [changeUser]);
  
  function logout() {
    SetRefreshToken(null);
    SetAccessToken(null);
    setChangeUser(false);
    setUserData(false);
    setWallet(null);
    if(sse){
      sse.close();
    }
    history('/login');
  }
  return (
    <UserContext.Provider value={{ userData, setUserData, logout, setChangeUser, wallet, setWallet }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};