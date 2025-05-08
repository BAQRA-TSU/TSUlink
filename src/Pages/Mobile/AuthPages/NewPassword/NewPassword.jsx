import styles from "./NewPassword.module.css";
import { useEffect, useRef, useState } from "react";
import { useFormik, Form, FormikProvider } from "formik";
import * as Yup from "yup";
import { Trans, useTranslation } from "react-i18next";
import { NavLink, useNavigate, useLocation } from "react-router-dom";

import { isLogedIn} from "../../../../Services/common";
import { PostResetPhoneCheck, PostSendResetCode } from "../../../../Services/service";
import Input from "../../../../Components/Mobile/Input/Input";
import { BackIcon, EyeIcon, EyeOffIcon, NotValidIcon, ValidIcon } from "../../../../assets/svg/svg";
import { useNotificationPopup } from "../../../../Services/notificationPopupProvider";

const NewPassword = () => {
    const [t] = useTranslation();
    const history = useNavigate();
    const passwordRef = useRef();
    const location = useLocation()
    const passwordRepeatRef = useRef();
    const [isMinValid, setIsMinValid] = useState(false);
    const [hidePssword, setHidePssword] = useState(true);
    const [hidePsswordRepeat, setHidePsswordRepeat] = useState(true);
    const [isSpecValid, setIsSpecValid] = useState(false);
    const [isNumValid, setIsNumValid] = useState(false);
    const [isUppercaseValid, setUppercaseValid] = useState(false);
    const [isError, setIsError] = useState(false)
    const userData = location.state;
    const { showSnackNotificationPopup } = useNotificationPopup();
    const [seconds, setSeconds] = useState(60);
    const [secondsOut, setSecondsOut] = useState(false);
    const endTimeRef = useRef(null);
    const timerRef = useRef(null);

    function reSend() {
        PostSendResetCode(userData.numberCode + userData.number, userData.username)
                .then(() => {
                        setSeconds(60);
                        setSecondsOut(false);
                        startTimer(60);
                })
                .catch((error) => {
                    const yupErrors = {};
                    if(error.response && error.response.data.message === "ATTEMPTS_EXCEEDED"){
                        showSnackNotificationPopup({status: "FAILED",  text: t("ATTEMPTS_EXCEEDED")});
                        const yupErrors = {};
                        yupErrors.number = t("attempts.exceeded");
                        history("/password-reset", { state: yupErrors });

                    } else{
                        yupErrors.number = t(error.response.data.message);
                        yupErrors.username = t(error.response.data.message);
                    }
                    if (yupErrors != null) {
                        formik.setErrors(yupErrors);
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

    function showPassword(state, isShow, ref) {
        if (!isShow) {
            state(true);
            ref.current.type = "password";
        } else {
            state(false);
            ref.current.type = "text";
        }
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

    // const formRef = useRef()

    const registerSchema = Yup.object().shape({
        password: Yup.string().required(t("password.required")),
        passwordRepeat: Yup.string().equals([Yup.ref('password')],t("passwords.not.match")).required(t("password.repeat.required")),
    });
    // const [signIn] = useMutation(SIGN_IN_MUTATION);

    useEffect(() => {
        if (!location.state) {
            history("/password-reset");
        }
        window.history.replaceState({}, '')
    },[])

    useEffect(() => {
        if (isLogedIn()) {
            history("/");
        }
    }, [history]);

    useEffect(() => {
        const passwordElement = passwordRef.current;
        const handleEvent = ( event ) => {
            const val = event.target.value;
            val.length >= 8 ? setIsMinValid(true) : setIsMinValid(false)
            val.match(/[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~ ]/) !== null ? setIsSpecValid(true) : setIsSpecValid(false)
            val.match(/[A-Z]/) !== null && val.match(/[a-z]/) !== null ? setUppercaseValid(true) : setUppercaseValid(false)
            val.match(/\d+/) !== null ? setIsNumValid(true) : setIsNumValid(false)

        };
        passwordElement.addEventListener( 'keyup', handleEvent );
        return () => passwordElement.removeEventListener( 'keyup', handleEvent )
    }, []);

    // function showPassword(ref) {
        // if (!isShow) {
        //     isShow = true;
        //     ref.current.type = "text";
        // } else {
        //     isShow = false;
        //     ref.current.type = "password";
        // }
    // }

    function inputChange(event) {
        const { name, value } = event.target

        // Handle autofill or multiple digits case
        if (value.length === 4) {
            const digits = value.split("").slice(0, 4); // Take only the first 4 digits
            digits.forEach((digit, index) => {
                if(/^\d$/.test(digit)){
                    const fieldName = `number${index + 1}`;
                    setFieldValue(fieldName, digit); // Set each digit to the corresponding field
                }
            });

            // Focus the last input
            const lastInput = document.getElementsByName(`number${digits.length}`)[0];
            if (lastInput) lastInput.focus();
            return;
        }
        

        // Handle single-digit entry
        if (/^\d$/.test(value)) {
            setFieldValue(name, value); // Update current input value
            setIsError(false);
            // Move focus to the next input if it exists
            const parent = event.target.parentElement;
            if (parent.nextElementSibling) {
                parent.nextElementSibling.children[0].focus();
            }
        }
    }

    const formik = useFormik({
        initialValues: {
            password: "",
            passwordRepeat: "",
        },
        validationSchema: registerSchema,
        onSubmit: () => {
            if (isMinValid && isSpecValid && isUppercaseValid && isNumValid) {
                const code = formik.values.number1 + formik.values.number2 + formik.values.number3 + formik.values.number4
                if(!code || code.length < 4){
                    setIsError(true);
                    return;
                }
                PostResetPhoneCheck(formik.values.password, code, userData.numberCode + userData.number)
                    .then(() => {
                        history("/login");
                        showSnackNotificationPopup({status: "COMPLETED",  text: t("password.updated.succesfuly")});
                    })
                    .catch((error) => {
                        if (error.response && error.response.data.message === "ATTEMPTS_EXCEEDED") {
                            const yupErrors = {};
                            yupErrors.number = t("attempts.exceeded");
                            history("/password-reset", { state: yupErrors });
                        }
                        if (error.response && error.response.data.message === "OTP_CODE_NOT_VALID") {
                            setIsError(true)
                        }
                    })
            } else {
                const yupErrors = {};
                yupErrors.password = t('password.not.strong');
                yupErrors.passwordRepeat = t('password.not.strong');
                formik.setErrors(yupErrors);
            }
        },
    });

    const { errors, touched, setFieldValue, /*isSubmitting,*/ handleSubmit } = formik;

    return (
        <div className={styles.newPasswordWrapper}>
            <div className={styles.headerContainer}>
                <NavLink to={"/password-reset"} className={styles.backIcon}> <BackIcon/> </NavLink>
                <NavLink to={"/"} className={styles.aviatorLogo}></NavLink>
            </div>
            <h1 className={styles.newPasswordHeader}>{t("create.new.password")}</h1>
            <p className={styles.text}>{t("create.new.password.for.acc")}</p>
            <FormikProvider  validateOnBlur value={formik}>
                <div>
                    <Form className={styles.form} onSubmit={handleSubmit}>
                       
                        <div className={styles.inputContainer}>
                            <Input
                                type={"password"}
                                name={"password"}
                                ref={passwordRef}
                                hidePassword={hidePssword}
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                id={"password"}
                                error={errors.password}
                                touched={touched.password}
                                floatingLabel={t("password")}
                            />
                                <span
                                    onClick={() => {
                                        showPassword(setHidePssword, hidePssword, passwordRef)
                                    }}
                                    className={styles.eyeIcon}
                                >{hidePssword ? <EyeOffIcon color={"var(--color-grey-500)"}/> : <EyeIcon color={"var(--color-grey-500)"}/>}</span>
                        </div>
                        <div className={styles.validationContainer}>
                            <div className={styles.validation}>
                                <span className={styles.validationIcon }>{ isMinValid? <ValidIcon/> : <NotValidIcon/>}</span>
                                <p className={styles.validationText}>{t("password.min.8.char")}</p>
                            </div>
                            <div className={styles.validation}>
                                <span className={styles.validationIcon }>{ isUppercaseValid? <ValidIcon/> : <NotValidIcon/>}</span>
                                <p className={styles.validationText}>{t("password.eng.char")}</p>
                            </div>
                            <div className={styles.validation}>
                                <span className={styles.validationIcon}>{ isNumValid? <ValidIcon/> : <NotValidIcon/>}</span>
                                <p className={styles.validationText}>{t("password.must.num")}</p>
                            </div>
                            <div className={styles.validation}>
                                <span className={styles.validationIcon}>{ isSpecValid? <ValidIcon/> : <NotValidIcon/>}</span>
                                <p className={styles.validationText}>{t("password.must.special.symbol")}</p>
                            </div>
                        </div>
                        
                        <div className={styles.inputContainer}>
                            <Input
                                type={"password"}
                                name={"passwordRepeat"}
                                ref={passwordRepeatRef}
                                // hidePassword={hidePsswordRepeat}
                                value={formik.values.passwordRepeat}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                id={"passwordRepeat"}
                                error={errors.passwordRepeat}
                                touched={touched.passwordRepeat}
                                floatingLabel={t("password")}
                            />
                                <span
                                    onClick={() => {
                                        showPassword(setHidePsswordRepeat, hidePsswordRepeat, passwordRepeatRef)
                                    }}
                                    className={styles.eyeIcon}
                            >{hidePsswordRepeat ? <EyeOffIcon color={"var(--color-grey-500)"}/> : <EyeIcon color={"var(--color-grey-500)"} />}</span>
                        </div>

                        <p className={styles.text}>{t("enter.code.from.mobile")} {userData? userData.numberCode + userData.number: ""}</p>

                        <div className={styles.inputs}>
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
                        </div>
                        {secondsOut ? 
                                <div onClick={() => reSend()} className={styles.resend + " " + styles.active}>{t("resend.code")}</div>  
                                : 
                                <div className={styles.resend}><Trans i18nKey="resend.timer">გააგზავნე ხელახლა <p className={styles.bold}> {{ seconds }} წმ </p></Trans></div>
                            }
                        <button type="submit" className={styles.submitButton}>
                            {t("continue")}
                        </button>

                    </Form>
                </div>
            </FormikProvider>
        </div>
    );
};

export default NewPassword;
