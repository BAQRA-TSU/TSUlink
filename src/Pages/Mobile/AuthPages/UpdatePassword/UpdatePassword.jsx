import styles from "./UpdatePassword.module.css";
import { useEffect, useRef, useState } from "react";
import { useFormik, Form, FormikProvider } from "formik";
import * as Yup from "yup";
import { isValidPhoneNumber } from "libphonenumber-js";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { isLogedIn } from "../../../../Services/common";
import Input from "../../../../Components/Mobile/Input/Input";
import { BackIcon } from "../../../../assets/svg/svg";
import { PostSendResetCode } from "../../../../Services/service";


const UpdatePassword = () => {
    const history = useNavigate();
    const [t] = useTranslation();
    const numberRef = useRef();
    const location = useLocation();
    let yupError = location.state;
    const [isNumberError, setIsNumberError] = useState(yupError && Object.keys(yupError).includes("number") ? true : false)
  
    const RegisterSchema = Yup.object().shape({
        username: Yup.string().min(6,t('must.be.longer.then.6')).max(30,t('must.be.shorter.then.30')).required(t('username.required')),
        number: Yup.number().test("test-num",t("num.invalid"),validateNumber).required(t("num.required")),
    });
    // const [signIn] = useMutation(SIGN_IN_MUTATION);

    useEffect(() => {
        if (isLogedIn()) {
            history("/");
        }
    }, [history]);

    
    function validateNumber() {
        if (!(document.activeElement === numberRef.current)) {
            if (formik.values.number && !isValidPhoneNumber(formik.values.numberCode + formik.values.number) ) { 
                return false;
            }
            return true;
        }
        return true;
    }

    const formik = useFormik({
        initialValues: {
            number: "",
            username: "",
            numberCode: "+995"
        },
        validationSchema: RegisterSchema,
        validateOnBlur: true,
        validateOnChange: true,
        validateOnMount: false,
        onSubmit: (data) => {
            PostSendResetCode(data.numberCode + data.number, data.username)
                .then((resp) => {
                    if (resp.data.accountExists) {
                        history("/password-reset/new-password", {state: data})
                    }
                })
                .catch((error) => {
                    const yupErrors = {};
                    if(error.response && error.response.data.message === "ATTEMPTS_EXCEEDED"){
                        yupErrors.number = t("attempts.exceeded");
                    }else if(error.response.status === 404){
                        yupErrors.username = t("account.info.incorect.password");
                        yupErrors.number = t("account.info.incorect.password");
                    } else{
                        yupErrors.number = t(error.response.data.message);
                        yupErrors.username = t(error.response.data.message);
                    }
                    if (yupErrors != null) {
                        formik.setErrors(yupErrors);
                    }
                })
            // SetItemToLocalStorage('accessToken', "1234test")
            ;
            // signIn({ variables: { username: data.username, personalId: data.personalId } })
            //   .then((data) => {
            //     const { accessToken } = data.data.signIn;
            //     SetItemToLocalStorage('accessToken', accessToken);
            //     history("/providers")
            //   })
            //   .catch((error) => {
            //     if (error.message === "exists") {
            //       const yupErrors = {};
            //       yupErrors.username = "incorrect username or personalId";
            //       yupErrors.personalId = "incorrect username or personalId";
            //       formik.setErrors(yupErrors)
            //     } else {
            //       console.log(error)
            //     }
            //   });
        },
    });


    useEffect(() => {
        if (isNumberError) {
            formik.setErrors(yupError);
            window.history.replaceState({}, '')
        }
    },[])

    useEffect(() => { 
        if (formik.values.number) {
            setIsNumberError(false)
        }
    }, [formik.values])

    const { errors, touched, setFieldValue ,  /*isSubmitting,*/ handleSubmit } = formik;

    return (
        <div className={styles.updatePsswordWrapper}>
            <div className={styles.headerContainer}>
                <NavLink to={"/login"} className={styles.backIcon}><BackIcon/></NavLink>
                <NavLink to={"/"} className={styles.aviatorLogo}></NavLink>
            </div>
            <h1 className={styles.updatePsswordHeader}>{t("password.recovery")}</h1>
            <p className={styles.text}>{t("get.code.recover")}</p>
            <FormikProvider value={formik}>
                <div className={styles.form}>
                    <Form onSubmit={handleSubmit}>                            
                            <Input
                                className={styles.input}
                                type={"text"}
                                name={"username"}
                                value={formik.values.username}
                                onChange={e => {
                                    e.preventDefault()
                                    const { value } = e.target;
                                    const regex = /^[a-zA-Z][a-zA-Z0-9_]*$/;
                                    if ( regex.test(value.toString()) || value === "" ) {
                                      setFieldValue("username", value);
                                    }
                                }}
                                onBlur={formik.handleBlur}
                                id={"username"}
                                error={errors.username}
                                touched={touched.username}
                                floatingLabel={t("username")}
                                autoComplete={"off"}
                            />

                            <div className={styles.numberInputContainer}>
                                <div className={styles.codeDiv}>
                                    <select
                                        className={styles.codeInput}
                                        value={formik.values.numberCode}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        name="numberCode"
                                        id="numberCode"
                                    >
                                        <option value="+995" label="+995">+995</option>
                                        <option value="+90" label="+90">+90</option>
                                        <option value="+374" label="+374">+374</option>
                                        <option value="+49" label="+49">+49</option>
                                    </select>
                                </div>
                                <Input
                                    type="text"
                                    id="number"
                                    name="number"
                                    value={formik.values.number}
                                    onChange={e => {
                                        e.preventDefault()
                                        const { value } = e.target;
                                        const regex = /^(0*[1-9][0-9]*(\[0-9]*)?|0*\[0-9]*[1-9][0-9]*)$/;
                                        if ( regex.test(value.toString()) || value === "" ) {
                                        setFieldValue("number", value);
                                        }
                                    }}
                                    onBlur={formik.handleBlur}
                                    className={styles.input}
                                    error={errors.number}
                                    ref={numberRef}
                                    touched={touched.number}
                                    floatingLabel={t("phone.number")}
                                    autoComplete={"off"}
                                    isError={isNumberError}
                                />
                            </div>
                        <button className={styles.submitButton} type="submit">
                            {t("recive.code")}
                        </button>
                    </Form>
                </div>
            </FormikProvider>
        </div>
    );
};

export default UpdatePassword;
