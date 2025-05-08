// import { useRef, useState } from "react";
// import styles from "./RegisterPopup.module.css";
// import { CloseIcon } from "../../../assets/svg/svg";

// const RegisterPopup = (props) => {
//     const wrapperRef = useRef(null);
//     const [fadeOut, setFadeOut] = useState(false);

//     function hidePopup(element, isIcon) {
//         if (element.target === wrapperRef.current || isIcon) {
//             setFadeOut(true);
//             setTimeout(() => {
//                 props.setShowPopup(false);
//             }, 500);
//         }
//     }

//     return (
//         <div
//             onClick={(event) => hidePopup(event, false)}
//             ref={wrapperRef}
//             className={styles.popupComponent}
//         >
//             <div
//                 className={
//                     styles.popupContainer +
//                     (fadeOut ? " " + styles.fadeOut : "")
//                 }
//             >
//                 <span
//                     onClick={(event) => hidePopup(event, true)}
//                     className={
//                         styles.popupContainerIcon
//                     }
//                 ><CloseIcon/></span>
//                 <div className={styles.card}>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default RegisterPopup;
