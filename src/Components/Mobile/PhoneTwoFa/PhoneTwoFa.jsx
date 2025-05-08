import { useContext, useEffect, useRef, useState } from "react";
import styles from "./PhoneTwoFa.module.css";
import { BackIcon , CloseIcon } from "../../../assets/svg/svg";
import { Trans, useTranslation } from "react-i18next";
import { useFormik } from "formik";
import { phoneUpdateCheck, phoneUpdateSend } from "../../../Services/common";
import PropTypes from "prop-types";
import { useNotificationPopup } from "../../../Services/notificationPopupProvider";
import { UserContext } from "../../../Services/userContext";
import OtpInputs from "../OtpInputs/OtpInputs";

const PhoneTwoFa = ({ setTwoFaError, userData, setUserData, setShowPopup, setIsPhonePopupOpen, userInput }) => {
    const wrapperRef = useRef(null);
    const [fadeOut, setFadeOut] = useState(false);
    const [t] = useTranslation();
    const [isError, setIsError] = useState(false)
    const [seconds, setSeconds] = useState(60);
    const [secondsOut, setSecondsOut] = useState(false);
    const { showSnackNotificationPopup } = useNotificationPopup();
    const { logout } = useContext(UserContext);
    const [showLoading, setShowLoading] = useState(false);
    const endTimeRef = useRef(null);
    const timerRef = useRef(null);

    function reSend() {
        phoneUpdateSend(userInput.numberCode + userInput.number)
                .then((resp) => {
                    if (resp === false) {
                        showSnackNotificationPopup({status: "FAILED", text: "Phone send failed"});
                        return;
                    }
                    setSeconds(60);
                    setSecondsOut(false);
                    startTimer(60);
                })
                .catch((error) => {
                    if(error.message === "UNAUTHORIZED"){
                        logout();
                    }else if(error.message === "ATTEMPTS_EXCEEDED"){
                        const yupErrors = {};
                        yupErrors.number = t("attempts.exceeded");
                        setTwoFaError(yupErrors)
                        setFadeOut(true);
                            setTimeout(() => {
                                setShowPopup(false);
                            }, 500);
                            setIsPhonePopupOpen(true);
                    }else{
                        showSnackNotificationPopup({status: "FAILED", text: error.message});
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

    // function inputChange(input) {
    //     const regex = /^[0-9]$/;
    //     input.preventDefault();
    //     input.stopPropagation();
    //     if (input.keyCode === 8 && input.target.value === "") {
    //         if (input.target.parentElement.previousElementSibling) {
    //             input.target.parentElement.previousElementSibling.children[0].focus()
    //             return;
    //         }
    //     } else if (input.keyCode === 8) {
    //         setFieldValue(input.target.name, "")
    //         return;
    //     }

    //     if (regex.test(input.key.toString())) {
    //         setFieldValue(input.target.name, input.key)
    //         if (isError) {
    //             setIsError(false);
    //         }
    //         if (input.target.parentElement.nextElementSibling) {
    //             input.target.parentElement.nextElementSibling.children[0].focus()
    //         }
    //     }
    // }

    const formik = useFormik({
        initialValues: {
        },
    });

    function handleSubmit(code) {
        setShowLoading(true);
        phoneUpdateCheck(userInput.numberCode + userInput.number, code, String(userInput.personalId), userInput.password)
            .then((resp) => {
                if (resp === false) {
                    showSnackNotificationPopup({status: "FAILED", text: "Phone Update failed"});
                    return;
                }
                setUserData({ ...userData, phone: resp.phone})
                setFadeOut(true);
                setTimeout(() => {
                    setShowPopup(false);
                }, 500);
            })
            .catch((error) => {
                if(error.message === "UNAUTHORIZED"){
                    logout()
                }else if(error.message === "OTP_CODE_NOT_VALID"){
                    setIsError(true)
                }else{
                    const yupErrors = {};
                    yupErrors.personalId = t("account.update.error");
                    yupErrors.number = t("account.update.error");
                    yupErrors.password = t("account.update.error");
                    setTwoFaError(yupErrors);
                    setFadeOut(true);
                    setTimeout(() => {
                        setShowPopup(false);
                    }, 500);
                    setIsPhonePopupOpen(true);
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
                        <div onClick={(event) => { hidePopup(event, true); setIsPhonePopupOpen(true);}} className={styles.backIcon}><BackIcon/></div>
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
                        <p className={styles.text}>{t("enter.code.from.mobile")} {userInput.numberCode + userInput.number}</p>
                            <OtpInputs submitFuncion={handleSubmit} isError={isError} setIsError={setIsError} showLoading={showLoading} formik={formik} setFieldValue={setFieldValue}/>
                            {/* <div className={styles.inputs}>
                                <div className={styles.codeInputContainer}>
                                    <input autoComplete={"off"} className={styles.inputElement + (isError ?  " " + styles.inputError : "")} name="number1" value={formik.values.number1} onKeyDown={(input) => { inputChange(input) }} type="number" maxLength="1"></input>
                                    <div className={styles.background + (isError ?  " " + styles.inputError : "")}></div>
                                </div>
                                <div className={styles.codeInputContainer}>
                                    <input autoComplete={"off"} className={styles.inputElement + (isError ?  " " + styles.inputError : "")} name="number2" value={formik.values.number2}  onKeyDown={(input) => {inputChange(input)}} type="number" maxLength="1"></input>
                                    <div className={styles.background + (isError ?  " " + styles.inputError : "")}></div>
                                </div>
                                <div className={styles.codeInputContainer}>
                                    <input autoComplete={"off"} className={styles.inputElement + (isError ?  " " + styles.inputError : "")}  name="number3" value={formik.values.number3} onKeyDown={(input) => {inputChange(input)}} type="number" maxLength="1"></input>
                                    <div className={styles.background + (isError ?  " " + styles.inputError : "")}></div>
                                </div>
                                <div className={styles.codeInputContainer}>
                                    <input autoComplete={"off"} className={styles.inputElement + (isError ?  " " + styles.inputError : "")}  name="number4" value={formik.values.number4} onKeyDown={(input) => {inputChange(input)}} type="number" maxLength="1"></input>
                                    <div className={styles.background + (isError ?  " " + styles.inputError : "")}></div>
                                </div>
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

export default PhoneTwoFa;

PhoneTwoFa.propTypes = {
    setTwoFaError: PropTypes.func.isRequired, // Function to set Two-Factor Authentication error
    userData: PropTypes.object.isRequired,   // User data object
    setUserData: PropTypes.func.isRequired,  // Function to update user data
    setShowPopup: PropTypes.func.isRequired, // Function to toggle the popup visibility
    setIsPhonePopupOpen: PropTypes.func.isRequired, // Function to toggle phone popup visibility
    userInput: PropTypes.shape({
      numberCode: PropTypes.string.isRequired, // User's phone number country code
      number: PropTypes.string.isRequired,     // User's phone number
      personalId: PropTypes.string,            // User's personal ID (optional)
      password: PropTypes.string               // User's password (optional)
    }).isRequired
  };