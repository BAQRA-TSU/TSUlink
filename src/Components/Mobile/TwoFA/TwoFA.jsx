import { useContext, useEffect, useRef, useState } from "react";
import styles from "./TwoFA.module.css";
import { CloseIcon } from "../../../assets/svg/svg";
import { Trans, useTranslation } from "react-i18next";
import { useFormik } from "formik";
import { postSignin, SetAccessToken, SetRefreshToken } from "../../../Services/common";
import { UserContext } from "../../../Services/userContext";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useNotificationPopup } from "../../../Services/notificationPopupProvider";
import OtpInputs from "../OtpInputs/OtpInputs";

const TwoFA = ({ setTwoFaError, setShowPopup, username, password, phone }) => {
    const wrapperRef = useRef(null);
    const [fadeOut, setFadeOut] = useState(false);
    const [t] = useTranslation();
    const [isError, setIsError] = useState(false);
    const [showLoading, setShowLoading] = useState(false);
    const { setChangeUser } = useContext(UserContext);
    const history = useNavigate();
    // const [seconds, setSeconds] = useState(60);
    const [secondsOut, setSecondsOut] = useState(false);
    const { setUserData } = useContext(UserContext);
    const { showSnackNotificationPopup } = useNotificationPopup();
    const { setWallet } = useContext(UserContext);
    const [seconds, setSeconds] = useState(60);
    const endTimeRef = useRef(null);
    const timerRef = useRef(null);

    function reSend() {
        postSignin(username, password)
            .then((resp) => {
                if (resp === false) {
                    showSnackNotificationPopup({status: "FAILED", text: "Sign in failed"});
                    return;
                }
                setSeconds(60);
                setSecondsOut(false);
                startTimer(60);
            })
            .catch((error) => {
                if(error.message === "ATTEMPTS_EXCEEDED"){
                    showSnackNotificationPopup({status: "FAILED", text: "ATTEMPTS_EXCEEDED"});
                }
                const yupErrors = {};
                yupErrors.username = t(error.message);
                yupErrors.password = t(error.message);
                setTwoFaError(yupErrors)
                setFadeOut(true);
                setTimeout(() => {
                    setShowPopup(false);
                }, 500);
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

    const formik = useFormik({
        initialValues: {
            number1: "",
            number2: "",
            number3: "",
            number4: "",
        },
    });

    const { setFieldValue } = formik;

    function hidePopup(event, isIcon) {
        if (event.target === wrapperRef.current || isIcon) {
            setFadeOut(true);
            setTimeout(() => {
                setShowPopup(false);
            }, 500);
        }
    }

    function singIn(code){
        setShowLoading(true);
        postSignin(username, password, code)
            .then((resp) => {
                if (resp === false) {
                    showSnackNotificationPopup({status: "FAILED", text: "Sign in failed"});
                    return;
                }
                const { access_token, refresh_token } = resp;
                SetRefreshToken(refresh_token);
                SetAccessToken(access_token);
                setUserData(false);
                setWallet(null);
                setChangeUser(true);
                setShowPopup(false);
                history("/");
            })
            .catch((error) => {
                if (error.message === "OTP_CODE_NOT_VALID") {
                    setIsError(true);
                }else if(error.message === "ATTEMPTS_EXCEEDED"){
                    showSnackNotificationPopup({status: "FAILED", text: "ATTEMPTS_EXCEEDED"});
                }else{
                    const yupErrors = {};
                    yupErrors.username = t(error.message);
                    yupErrors.password = t(error.message);
                    setTwoFaError(yupErrors)
                    setFadeOut(true);
                    setTimeout(() => {
                        setShowPopup(false);
                    }, 500);
                }
            })
            .finally(() => {
                setShowLoading(false)
            })
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
    //         } else {
    //             // Submit the full code when last input is filled
    //             const code =
    //                 formik.values.number1 +
    //                 formik.values.number2 +
    //                 formik.values.number3 +
    //                 value;
                
    //         }
    //     }
    // }

    return (
        <div
            onClick={(event) => hidePopup(event, false)}
            ref={wrapperRef}
            className={styles.popupComponent}
        >
            <div className={styles.popupContainer + (fadeOut ? " " + styles.fadeOut : "")}>
                <div className={styles.headerDiv}>
                    <div className={styles.headerLeft}>
                        <h5 className={styles.headerText}>{t("SMS.code")}</h5>
                    </div>
                    <span
                        onClick={(event) => hidePopup(event, true)}
                        className={styles.popupContainerIcon}
                    >
                        <CloseIcon />
                    </span>
                </div>
                <div className={styles.form}>
                    <p className={styles.text}>
                        {t("enter.code.from.mobile")} {phone}
                    </p>
                    <OtpInputs submitFuncion={singIn} isError={isError} setIsError={setIsError} showLoading={showLoading} formik={formik} setFieldValue={setFieldValue}/>
                    {/* <div className={styles.inputs}>
                        {[1, 2, 3, 4].map((num) => (
                            <div key={num} className={styles.codeInputContainer}>
                                <input
                                    autoComplete={"one-time-code"} // Browser hint for OTP autofill
                                    className={
                                        styles.inputElement +
                                        (isError ? " " + styles.inputError : "") +
                                        (showLoading ? " " + styles.loading : "")
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
            </div>
        </div>
    );
};

export default TwoFA;

TwoFA.propTypes = {
    setTwoFaError: PropTypes.func.isRequired, // Function to set TwoFA error state
    setShowPopup: PropTypes.func.isRequired,  // Function to toggle popup visibility
    username: PropTypes.string.isRequired,    // Username for authentication
    password: PropTypes.string.isRequired,    // Password for authentication
    phone: PropTypes.string.isRequired,       // Phone number for display or operations
};