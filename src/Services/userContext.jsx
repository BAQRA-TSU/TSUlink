import { createContext, useState, useEffect, useRef } from 'react';
import { GetAccessToken, getCard, getMe, GetSseUrl, getWallet,  isLogedIn, RefreshToken, SetAccessToken, SetRefreshToken } from './common';
import { useLocation, useNavigate } from 'react-router-dom';
import {EventSourcePolyfill} from 'event-source-polyfill'
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
  const location = useLocation();
  const locationRef = useRef(location);
  
  // function connectSSE(retried = false) {
  //   const accessToken = GetAccessToken();
    
  //   if (accessToken) {
      
  //     sse = new EventSourcePolyfill(GetSseUrl() + '/api/v1/sse/connect', {
  //       headers: {
  //         "Authorization": `Bearer ${accessToken}`
  //       }
  //     });

  //     sse.onerror = (error) => {
  //       if (error.status === 403) {
  //           RefreshToken().then((resp) => {
  //               if (resp) {
  //                   if (!retried) {
  //                       connectSSE(true);
  //                   } else {
  //                     logout();
  //                   }
  //               } else {
  //                 logout();
  //               }
  //           });
  //       }
  //     }
  //     sse.onopen = () => {
  //       console.log("Connected to the upstream SSE server.");
  //     };
      
  //     sse.onmessage = e => {
  //       // const newData = JSON.parse(e.data);
  //       // console.log(newData);
  //     };

  //     sse.addEventListener('TRANSACTION_STATUS', (event) => { 
  //       const newData = JSON.parse(event.data);
  //       showSnackNotificationPopup({status: newData.status, text: newData.status});
  //       setWallet(prevWallet => ({
  //         ...prevWallet,
  //         balance: newData.balance ?? prevWallet.balance,  
  //       }));
  //     });
      
  //     sse.addEventListener('ACCOUNT_DEACTIVATED', (event) => { 
  //       const newData = JSON.parse(event.data);
  //       console.log(newData);
  //       if(newData.status === "deactivated"){
  //         logout();
  //       }
  //     })

  //     sse.addEventListener('ACCOUNT_STATUS', (event) => { 
  //       const newData = JSON.parse(event.data);
  //       console.log(newData);
  //       if(newData.status === "full_block" || newData.status === "self_block" || newData.status === "temporary_block"){
  //         logout();
  //       }

  //       if(newData.status === "withdrawal_only_block"){
  //         setUserData(prevUserData => ({
  //           ...prevUserData,
  //           withdrawalOnlyBlock: true,  
  //         }));
  //         history('/withdrawal');
  //       }
  //       if(newData.status === "product_block" && locationRef.current.pathname.includes('/game')){
  //         history('/slots')
  //       }
  //     });

  //     sse.addEventListener('NOTIFICATION', (event) => { 
  //       const newData = JSON.parse(event.data);
  //       // showNotificationPopup(newData.content)
  //     });

  //     sse.addEventListener('ACCOUNT_VERIFY_STATUS', (event) => { 
  //       const newData = JSON.parse(event.data);
  //       if(newData.status == "verified"){
  //         setUserData(prevUserData => ({
  //             ...prevUserData,
  //             verified: true,  
  //         }));
  //         showSnackNotificationPopup({status: "COMPLETED", text: "verification.successfull"});
  //       }
  //       if(newData.status === "unverified"){
  //         history("/verify");
  //         showSnackNotificationPopup({status: "FAILED", text: "verification.rejected"});
  //       }
  //       if(newData.status === "session_updated"){
  //         history('/verify/rejected', {state:{sessionId: newData.sessionId}})
  //       }
  //       if(newData.status === "pending"){
  //         history("/verify/pending");
  //       }
  //     });

  //     sse.addEventListener('NOTIFICATION_COUNT', (event) => { 
  //       const newData = JSON.parse(event.data);
  //       setUserData(prevUserData => ({
  //         ...prevUserData,
  //         notificationCount: newData.count ?? 0,  
  //       }));
  //     });

      
  //   } else {
  //     logout();
  //   }
  // }

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