import { useContext, useEffect, useRef, useState } from "react";
import styles from "./PsswordTwoFa.module.css";
import { BackIcon , CloseIcon } from "../../../assets/svg/svg";
import { useTranslation } from "react-i18next";
import {  useFormik } from "formik";
import {GetAccessToken, passwordUpdateCheck, passwordUpdateSend } from "../../../Services/common";
import { UserContext } from "../../../Services/userContext";
import { useNotificationPopup } from "../../../Services/notificationPopupProvider";
import { Trans } from "react-i18next";
import PropTypes from "prop-types";
import OtpInputs from "../OtpInputs/OtpInputs";

const PsswordTwoFa = ({setTwoFaError, setShowPopup, setIsPasswordPopupOpen, currentPassword, newPassword }) => {
    const wrapperRef = useRef(null);
    const [fadeOut, setFadeOut] = useState(false);
    const [t] = useTranslation();
    const [isError, setIsError] = useState(false)
    const { userData } = useContext(UserContext);
    const { logout } = useContext(UserContext);
    const { showSnackNotificationPopup } = useNotificationPopup();
    const [seconds, setSeconds] = useState(60);
    const [secondsOut, setSecondsOut] = useState(false);
    const [showLoading, setShowLoading] = useState(false);
    const endTimeRef = useRef(null);
    const timerRef = useRef(null);

    function reSend() {
        const accessToken = GetAccessToken();
        if (accessToken) {
                passwordUpdateSend(accessToken)
                    .then((resp) => {
                        if (resp === false) {
                            showSnackNotificationPopup({status: "FAILED", text: "Phone send failed"});
                            return;
                        }
                        setSeconds(60);
                        setSecondsOut(false);
                        startTimer(60);
                    })
                    .catch((error) =>{
                        if(error.message === "UNAUTHORIZED"){
                            logout();
                        }else if(error.message === "ATTEMPTS_EXCEEDED"){
                            const yupErrors = {};
                            yupErrors.oldPassword = t("attempts.exceeded");
                            yupErrors.password = t("attempts.exceeded");
                            yupErrors.passwordRepeat = t("attempts.exceeded");
                            setTwoFaError(yupErrors);
                            setFadeOut(true);
                            setTimeout(() => {
                                setShowPopup(false);
                            }, 500);
                            setIsPasswordPopupOpen(true);
                        }else{
                            showSnackNotificationPopup({status: "FAILED", text: error.message});
                        }
                    })
        } else {
            logout();
        }
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
    // useEffect(() => {
    //     inputRef.current.focus();
    // }, []);

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

    function handleSubmit(code) {
        setShowLoading(true);
        passwordUpdateCheck(currentPassword, newPassword, code)
            .then((resp) => {
                if (resp === false) {
                    showSnackNotificationPopup({status: "FAILED", text: "Password Update failed"});
                    return;
                }
                setFadeOut(true);
                showSnackNotificationPopup({status: "COMPLETED",  text: t("password.updated.succesfuly")});
                setTimeout(() => {
                    setShowPopup(false);
                }, 500);                    
            })
            .catch((error) => {
                if(error.message === "UNAUTHORIZED"){
                    logout()
                }else if(error.message === "OTP_CODE_NOT_VALID"){
                    setIsError(true)
                }else if(error.message === "NOT_CORRECT"){
                    const yupErrors = {};
                    yupErrors.oldPassword = t("password.incorrect");
                    setTwoFaError(yupErrors);
                    setFadeOut(true);
                    setTimeout(() => {
                        setShowPopup(false);
                    }, 500);
                    setIsPasswordPopupOpen(true);
                }else{
                    showSnackNotificationPopup({status: "FAILED", text: error.message});
                }
            })
            .finally(() => {
                setShowLoading(false);
            })
    }
    const {setFieldValue } = formik;


    return (
        <div onClick={(event) => hidePopup(event, false)} ref={wrapperRef} className={styles.popupComponent}>
            <div className={styles.popupContainer + (fadeOut ? " " + styles.fadeOut : "")}>   
                <div className={styles.headerDiv}>
                    <div className={styles.headerLeft}>
                        <div onClick={(event) => { hidePopup(event, true); setIsPasswordPopupOpen(true);}} className={styles.backIcon}><BackIcon/></div>
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
                            <OtpInputs submitFuncion={handleSubmit} isError={isError} setIsError={setIsError} showLoading={showLoading} formik={formik} setFieldValue={setFieldValue}/>
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

export default PsswordTwoFa;

PsswordTwoFa.propTypes = {
    setTwoFaError: PropTypes.func.isRequired, // Function to set 2FA-related errors
    setShowPopup: PropTypes.func.isRequired, // Function to control popup visibility
    setIsTwoFaAccepted: PropTypes.func.isRequired, // Function to set the 2FA acceptance state
    setIsPasswordPopupOpen: PropTypes.func.isRequired, // Function to toggle password popup visibility
    currentPassword: PropTypes.string.isRequired, // The user's current password
    newPassword: PropTypes.string.isRequired, // The user's new password
};