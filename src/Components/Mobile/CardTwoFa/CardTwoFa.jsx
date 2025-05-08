import { useContext, useEffect, useRef, useState } from "react";
import styles from "./CardTwoFa.module.css";
import { CloseIcon } from "../../../assets/svg/svg";
import { Trans, useTranslation } from "react-i18next";
import {  useFormik } from "formik";
import { addCardSend, GetAccessToken, RefreshToken } from "../../../Services/common";
import { UserContext } from "../../../Services/userContext";
import { PostAddNewCard } from "../../../Services/service";
import { useNotificationPopup } from "../../../Services/notificationPopupProvider";
import PropTypes from 'prop-types';
import OtpInputs from "../OtpInputs/OtpInputs";


const CardTwoFa = ({setShowPopup, acceptTwoFa, depositAmount}) => {
    const wrapperRef = useRef(null);
    const [fadeOut, setFadeOut] = useState(false);
    const [t] = useTranslation();
    const [isError, setIsError] = useState(false)
    const { userData } = useContext(UserContext);
    const { logout } = useContext(UserContext);
    const [seconds, setSeconds] = useState(60);
    const [secondsOut, setSecondsOut] = useState(false);
    const { showSnackNotificationPopup } = useNotificationPopup();
    const [showLoading, setShowLoading] = useState(false);
    const endTimeRef = useRef(null);
    const timerRef = useRef(null);

    function reSend() {
        addCardSend(userData.id).then((resp) => {
            if (resp === false) {
                showSnackNotificationPopup({status: "FAILED", text: "Phone send failed"});
                return;
            }
            setSeconds(60);
            setSecondsOut(false);
            startTimer(60);
          }).catch((error) => {
            switch (error.message) {
                case "UNAUTHORIZED":
                    logout();
                    break;
                case "ATTEMPTS_EXCEEDED":
                    hidePopup("",true);
                    showSnackNotificationPopup({status: "FAILED", text: "ATTEMPTS_EXCEEDED"});
                    break;
                case "BLOCKED":
                    hidePopup("",true);
                    showSnackNotificationPopup({status: "FAILED", text: "Transaction failed"});
                    break;
                default:
                    showSnackNotificationPopup({status: "FAILED", text: error.message});
                    break;
            }
        })
    }
 

    useEffect(() => {
        startTimer(60);
    }, []);

    function startTimer(sec) {
        endTimeRef.current = Date.now() + sec * 1000;
        timerRef.current = requestAnimationFrame(updateCountdown);
        return () => cancelAnimationFrame(timerRef.current);
    }

    const updateCountdown = () => {
        const now = Date.now();
        const timeRemaining = Math.max(0, Math.ceil((endTimeRef.current - now) / 1000)); // Time left in seconds
        setSeconds(timeRemaining);

        if (timeRemaining > 0) {
            timerRef.current = requestAnimationFrame(updateCountdown);
        } else {
            setSecondsOut(true);
            cancelAnimationFrame(timerRef.current); // Stop updating when the countdown ends
        }
    };

    function hidePopup(element, isIcon) {
        if (element.target === wrapperRef.current || isIcon) {
            setFadeOut(true);
            setTimeout(() => {
                setShowPopup(false);
            }, 500);
        }
    }

    // function inputChange(event) {
    //     const { name, value } = event.target;
    //     console.log(value);

    //     // Handle autofill or multiple digits case
    //     if (value.length === 4) {
    //         const digits = value.split("").slice(0, 4); // Take only the first 4 digits
    //         digits.forEach((digit, index) => {
    //             if(/^\d$/.test(digit)){
    //                 const fieldName = `number${index + 1}`;
    //                 setFieldValue(fieldName, digit); // Set each digit to the corresponding field
    //             }
    //         });

    //         // Focus the last input
    //         const lastInput = document.getElementsByName(`number${digits.length}`)[0];
    //         if (lastInput) lastInput.focus();
    //         return;
    //     }
        

    //     // Handle single-digit entry
    //     if (/^\d$/.test(value)) {
    //         setFieldValue(name, value); // Update current input value
    //         setIsError(false);
    //         // Move focus to the next input if it exists
    //         const parent = event.target.parentElement;
    //         if (parent.nextElementSibling) {
    //             parent.nextElementSibling.children[0].focus();
    //         }
    //     }
    // }

    const formik = useFormik({
        initialValues: {
        },
    });

    function addNewCard(otp) {
        const accessToken = GetAccessToken();
        if (accessToken) {
                setShowLoading(true);
                PostAddNewCard(accessToken, "BOG", otp, depositAmount, true)
                    .then((resp) => {
                        hidePopup("",true);
                        acceptTwoFa(resp.data.orderId);
                        // setLink(resp.data.redirectUrl)
                        // window.open(resp.data.redirectUrl,'_blank')
                    })
                    .catch((error) => {
                        if (error.response && error.response.status === 403) {
                            RefreshToken()
                                .then((resp) => {
                                    if (!resp) {
                                        logout();
                                    } else {
                                        addNewCard(otp);
                                    }
                                })
                        }else if(error.response && error.response.status === 405){
                            showSnackNotificationPopup({status: "FAILED", text: "Transaction failed"});
                            acceptTwoFa("ERROR")
                            hidePopup();
                        }else if (error.response && error.response.data.message === "CHECK_OTP_FAILED"){
                            setIsError(true)
                        }
                    })
                    .finally(() => {
                        setShowLoading(false);
                    })
        } else {
            logout()
        }
    }

    // function handleSubmit(code) {
        // setTimeout(() => {
            // setShowPopup(false);
            // const code = formik.values.number1 + formik.values.number2 + formik.values.number3 + formik.values.number4;
            // acceptTwoFa(code);
        // }, 500);
        // addNewCard(code)
    // }
    const {setFieldValue } = formik;


    return (
        <div onClick={(event) => hidePopup(event, false)} ref={wrapperRef} className={styles.popupComponent}>
            <div className={styles.popupContainer + (fadeOut ? " " + styles.fadeOut : "")}>   
                <div className={styles.headerDiv}>
                    <div className={styles.headerLeft}>
                        <h5 className={styles.headerText}>{t("SMS.code")}</h5>
                    </div>
                    <span
                        onClick={(event) => hidePopup(event, true)}
                        className={
                            styles.popupContainerIcon
                        }
                    ><CloseIcon/></span>
                </div>
                <div className={styles.form}>
                        <p className={styles.text}>{t("enter.code.from.mobile")} {userData.phone}</p>
                            <OtpInputs submitFuncion={addNewCard} isError={isError} setIsError={setIsError} showLoading={showLoading} formik={formik} setFieldValue={setFieldValue}/>

                            {/* <div className={styles.inputs}>
                                {[1, 2, 3, 4].map((num) => (
                                    <div key={num} className={styles.codeInputContainer}>
                                        <input
                                            autoComplete={"one-time-code"} // Browser hint for OTP autofill
                                            className={
                                                styles.inputElement +
                                                (isError ? " " + styles.inputError : "")
                                            }
                                            name={`number${num}`}
                                            value={formik.values[`number${num}`] || ""}
                                            onChange={inputChange} // Handles value changes
                                            onKeyDown={(event) => {
                                                if (event.keyCode === 8) {
                                                    setFieldValue(event.target.name, "")
                                                    if(event.target.value === ""){
                                                        if (event.target.parentElement.previousElementSibling) {
                                                            event.target.parentElement.previousElementSibling.children[0].focus()
                                                        }
                                                    }
                                                }
                                            }}
                                            type="text"
                                            inputMode="numeric" // For mobile-friendly numeric keyboard
                                        />
                                        <div
                                            className={
                                                styles.background +
                                                (isError ? " " + styles.inputError : "")
                                            }
                                        ></div>
                                    </div>
                                ))}
                            </div> */}
                            {secondsOut ? 
                                <div onClick={() => reSend()} className={styles.resend + " " + styles.active}>{t("resend.code")}</div>  
                                : 
                                <div className={styles.resend}><Trans i18nKey="resend.timer">გააგზავნე ხელახლა <p className={styles.bold}> {{ seconds }} წმ </p></Trans></div>
                            }
                    </div>

                {/* <button type="submit" onClick={() => handleSubmit()} className={styles.submitButton}>
                    {t("continue")}
                </button> */}
            </div>
        </div>
    );
};

export default CardTwoFa;

CardTwoFa.propTypes = {
    setShowPopup: PropTypes.func.isRequired,        // Function to show/hide the popup
    acceptTwoFa: PropTypes.func.isRequired,         // Function to handle the acceptance of the 2FA
    depositAmount: PropTypes.number.isRequired,    // The deposit amount, should be a number
};