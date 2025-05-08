import styles from "./Code.module.css";
import { useEffect, useRef, useState} from "react";
import { useFormik, Form, FormikProvider } from "formik";
import * as Yup from "yup";
import { Trans, useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

import { isLogedIn } from "../../../../Services/common";
import { BackIcon } from "../../../../assets/svg/svg";
import { PostPhoneCheck, PostSendCode } from "../../../../Services/service";
import WarningPopup from "../../../../Components/Mobile/WarningPopup/WarningPopup";
import OtpInputs from "../../../../Components/Mobile/OtpInputs/OtpInputs";


const Code = () => {
    const [t] = useTranslation()
    const history = useNavigate();
    const location = useLocation();
    const [showPopup, setShowPopup] = useState();
    const [isError, setIsError] = useState(false);
    const [showLoading, setShowLoading] = useState(false);
    const endTimeRef = useRef(null);
    const timerRef = useRef(null);

    useEffect(() => {
        if (!location.state) {
            history("/register");
        }
        window.history.replaceState({}, '')
    },[])
    const userData = location.state;
    // const [inputInfo, setInputInfo] = useState(null);
    // const [showPopup, setShowPopup] = useState(false);

    const RegisterSchema = Yup.object().shape({
        number: Yup.number().required("Number is required"),
    });
    // const [signIn] = useMutation(SIGN_IN_MUTATION);

    useEffect(() => {
        if (isLogedIn()) {
            history("/");
        }
    }, [history]);

    const [seconds, setSeconds] = useState(60);
    const [secondsOut, setSecondsOut] = useState(false);
    function reSend() {
        PostSendCode(userData.numberCode + userData.number)
            .then(() => {
                setSeconds(60);
                setSecondsOut(false);
                startTimer(60);
            })
            .catch((error) => {
                if(error.response && error.response.data.message === "ATTEMPTS_EXCEEDED") {
                    const yupErrors = {};
                    yupErrors.number = t("attempts.exceeded");
                    history("/register", {state:yupErrors});
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

    function submitCode(code) {
        setShowLoading(true);
        PostPhoneCheck(userData.numberCode + userData.number, code,userData.country === 'GE'? Number(userData.birthYear) :`${Number(userData.birthYear)}-${Number(userData.birthMonth)+1}-${userData.birthDay}`, userData.country, String(userData.personalId))
                    .then((resp) => {
                        if(userData.country === 'GE' ){
                            history("/register/checkInfo", {state: {...resp.data, country: userData.country}});
                        }else{
                            history("/register/details", {state:{...resp.data, country: userData.country}});
                        }
                    })
                    .catch((error) => {
                        if (error.response && error.response.status === 409) {
                            const yupErrors = {};
                            yupErrors.personalId = t("id.exists");
                            history("/register", {state:yupErrors});
                        }
                        if (error.response && error.response.data.message === "ATTEMPTS_EXCEEDED") {
                            const yupErrors = {};
                            yupErrors.number = t("attempts.exceeded");
                            history("/register", {state:yupErrors});
                        }
                        if (error.response && error.response.data.message === "OTP_CODE_NOT_VALID") {
                            setIsError(true)
                        }
                    })
                    .finally(() => {
                        setShowLoading(false);
                    })
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
    //     } else if(input.keyCode === 8){
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
    //         formik.values[input.target.name] = input.key;
    //         if(formik.values.number1 != "" && formik.values.number2 != "" && formik.values.number3 != "" && formik.values.number4 != ""){
    //             //isValid
    //             input.target.blur();
    //             // setInputInfo({personalId: "01001023498", country: "Georgia", birthYear: "2003"});
    //             // setShowPopup(true);
    //             const code = formik.values.number1 + formik.values.number2 + formik.values.number3 + input.key
    //             // history("/register/checkInfo");
                
    //             // formRef.current.dispatchEvent(new Event("submit"));
    //             // console.log(formRef);
    //         }
    //     }
            
    // }

    const formik = useFormik({
        initialValues: {
            number1: "",
            number2: "",
            number3: "",
            number4: "",
        },
        validationSchema: RegisterSchema,
        onSubmit: () => {
        },
    });


    const { /*isSubmitting,*/ setFieldValue } = formik;

    return (
        <div className={styles.numberWrapper}>
            {showPopup && <WarningPopup warningHeader={"back.warning.header"} warningText={"back.warning.text"} buttonSubmit={"submit.back"} buttonCancel={"cancel"} showPopup={showPopup} setShowPopup={setShowPopup} submit={() => { history('/register') }} />}
            <div className={styles.headerContainer}>
                <div onClick={() => setShowPopup(true)} className={styles.backIcon}><BackIcon/></div>
                <span className={styles.aviatorLogo}></span>
            </div>
            <h1 className={styles.numberHeader}>{t("enter.code")}</h1>
            <p className={styles.text}>{t("enter.code.from.mobile")} {userData? userData.numberCode + userData.number: ""}</p>
            <FormikProvider  value={formik}>
                <div className={styles.form}>
                    <Form>
                        <OtpInputs submitFuncion={submitCode} isError={isError} setIsError={setIsError} showLoading={showLoading} formik={formik} setFieldValue={setFieldValue}/>
                        {/* <div className={styles.inputs}>
                            <div className={styles.inputContainer}>
                                <input autoComplete={"one-time-code"} className={styles.inputElement + (isError ?  " " + styles.inputError : "")} name="number1" value={formik.values.number1} onKeyDown={(input) => { inputChange(input) }} type="number" maxLength="1"></input>
                                <div className={styles.background + (isError ?  " " + styles.inputError : "")}></div>
                            </div>
                            <div className={styles.inputContainer}>
                                <input autoComplete={"one-time-code"} className={styles.inputElement + (isError ?  " " + styles.inputError : "")} name="number2" value={formik.values.number2} onKeyDown={(input) => { inputChange(input) }} type="number" maxLength="1"></input>
                                <div className={styles.background + (isError ?  " " + styles.inputError : "")}></div>
                            </div>
                            <div className={styles.inputContainer}>
                                <input autoComplete={"one-time-code"} className={styles.inputElement + (isError ? " " + styles.inputError : "")} name="number3" value={formik.values.number3} onKeyDown={(input) => { inputChange(input) }} type="number" maxLength="1"></input>
                                <div className={styles.background + (isError ?  " " + styles.inputError : "")}></div>
                            </div>
                            <div className={styles.inputContainer}>
                                <input autoComplete={"one-time-code"} className={styles.inputElement + (isError ?  " " + styles.inputError : "")}  name="number4" value={formik.values.number4} onKeyDown={(input) => { inputChange(input) }} type="number" maxLength="1"></input>
                                <div className={styles.background + (isError ?  " " + styles.inputError : "")}></div>
                            </div>
                        </div> */}
                    </Form>
                </div>
            </FormikProvider>
            {secondsOut ? 
            <div onClick={() => reSend()} className={styles.resend + " " + styles.active}>{t("resend.code")}</div>  
            : 
                <div className={styles.resend}><Trans i18nKey="resend.timer">გააგზავნე ხელახლა <p className={styles.bold}> {{ seconds }} წმ </p></Trans></div>
            }
            {/* {showPopup && (
                <RegisterPopup showPopup={showPopup} setShowPopup={setShowPopup} inputInfo={inputInfo}/>
            )} */}
        </div>
    );
};

export default Code;
