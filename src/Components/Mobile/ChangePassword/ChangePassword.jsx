import { useTranslation } from "react-i18next";
import styles from "./ChagnePassword.module.css";
import { Form, FormikProvider, useFormik } from "formik";
import * as Yup from "yup";
import { useContext, useEffect, useRef, useState } from "react";
import Input from "../Input/Input";
import { EyeIcon, EyeOffIcon } from "../../../assets/svg/svg";
import { GetAccessToken, passwordUpdateSend } from "../../../Services/common";
import { UserContext } from "../../../Services/userContext";
import { useNotificationPopup } from "../../../Services/notificationPopupProvider";
import PropTypes from 'prop-types';

const ChangePassword = ({twoFaError, setShowTwoFA,setIsPasswordPopupOpen, setUserInput}) => {
	const { t } = useTranslation();
    const oldPasswordRef = useRef();
    const passwordRef = useRef();
    const passwordRepeatRef = useRef();
    const [hidePssword, setHidePssword] = useState(true);
    const [hideOldPssword, setHideOldPssword] = useState(true);
    const [hidePsswordRepeat, setHidePsswordRepeat] = useState(true);
    const [isSpecValid, setIsSpecValid] = useState(false);
    const [isUppercaseValid, setUppercaseValid] = useState(false);
    const [isNumValid, setIsNumValid] = useState(false);
    const [isMinValid, setIsMinValid] = useState(false);
    const { logout } = useContext(UserContext);
    const { showSnackNotificationPopup } = useNotificationPopup();

    function showPassword(state, isShow, ref) {
        if (!isShow) {
            state(true);
            ref.current.type = "password";
        } else {
            state(false);
            ref.current.type = "text";
        }
    }

    const RegisterSchema = Yup.object().shape({
        oldPassword: Yup.string().required(t('old.repeat.required')),
        password: Yup.string().required(t('password.required')),
        passwordRepeat: Yup.string().equals([Yup.ref('password')],t('passwords.not.match')).required(t('password.repeat.required')),
    });

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

    const formik = useFormik({
        initialValues: {
            oldPassword: "",
            password: "",
            passwordRepeat: ""
        },
        validationSchema: RegisterSchema,
        validateOnBlur: true,
        validateOnChange: true,
        validateOnMount: false,
        onSubmit: (data) => {  
            const accessToken = GetAccessToken();
            if (accessToken) {
                if (isMinValid && isSpecValid && isUppercaseValid && isNumValid) {
                    passwordUpdateSend(accessToken)
                        .then((resp) => {
                            if (resp === false) {
                                showSnackNotificationPopup({status: "FAILED", text: "Phone send failed"});
                                return;
                            }
                            setIsPasswordPopupOpen(false);
                            setShowTwoFA(true);
                            setUserInput({ currentPassword: data.oldPassword, newPassword: data.password })
                        })
                        .catch((error) =>{
                            if(error.message === "UNAUTHORIZED"){
                                logout();
                            }else if(error.message === "ATTEMPTS_EXCEEDED"){
                                const yupErrors = {};
                                yupErrors.oldPassword = t("attempts.exceeded");
                                yupErrors.password = t("attempts.exceeded");
                                yupErrors.passwordRepeat = t("attempts.exceeded");
                                formik.setErrors(yupErrors);
                            }else{
                                showSnackNotificationPopup({status: "FAILED", text: error.message});
                            }
                        })
                }else{
                    const yupErrors = {};
                    yupErrors.password = t('password.not.strong');
                    yupErrors.passwordRepeat = t('password.not.strong');
                    formik.setErrors(yupErrors);
                }
            } else {
                logout();
			}
        },
    });

    useEffect(() => {
        if (twoFaError) {
            formik.setErrors(twoFaError);
        }
    },[twoFaError])

    const { errors, touched, setFieldValue ,  /*isSubmitting,*/ handleSubmit } = formik;


	return (
		<div className={styles.changePhoneWrapper}>
			<FormikProvider value={formik}>
                <div className={styles.form}>
                    <Form onSubmit={handleSubmit}>  
                        <div className={styles.inputContainer}>
                            <Input
                                type={"password"}
                                name={"oldPassword"}
                                ref={oldPasswordRef}
                                value={formik.values.oldPassword}
                                onChange={e => {
                                    e.preventDefault()
                                    const { value } = e.target;
                                    var regex = /^\S*$/;
                                    if ( regex.test(value.toString()) || value === "" ) {
                                      setFieldValue("oldPassword", value);
                                    }
                                }}
                                onBlur={formik.handleBlur}
                                id={"oldPassword"}
                                error={errors.oldPassword}
                                isError={twoFaError? true : false}
                                touched={touched.oldPassword}
                                floatingLabel={t("old.password")}
                            />
                                <span
                                    onClick={() => {
                                        showPassword(setHideOldPssword,hideOldPssword,oldPasswordRef)
                                    }}
                                    className={styles.eyeIcon}
                                >{hideOldPssword ? <EyeOffIcon color={"var(--color-grey-500)"}/>  : <EyeIcon color={"var(--color-grey-500)"}/>}</span>
                        </div>
                        <p>{t("enter.new.password")}</p>
                        <div className={styles.inputContainer}>
                            <Input
                                type={"password"}
                                name={"password"}
                                ref={passwordRef}
                                hidePassword={hidePssword}
                                value={formik.values.password}
                                onChange={e => {
                                    e.preventDefault()
                                    const { value } = e.target;
                                    var regex = /^\S*$/;
                                    if ( regex.test(value.toString()) || value === "" ) {
                                      setFieldValue("password", value);
                                    }
                                }}
                                onBlur={formik.handleBlur}
                                id={"password"}
                                error={errors.password}
                                
                                touched={touched.password}
                                floatingLabel={t("password")}
                            />
                                <span
                                    onClick={() => {
                                        showPassword(setHidePssword,hidePssword,passwordRef)
                                    }}
                                    className={styles.eyeIcon}
                                >{hidePssword ? <EyeOffIcon color={"var(--color-grey-500)"}/>: <EyeIcon color={"var(--color-grey-500)"}/> }</span>
                        </div>
                        <div className={styles.inputContainer}>
                            <Input
                                type={"password"}
                                name={"passwordRepeat"}
                                ref={passwordRepeatRef}
                                value={formik.values.passwordRepeat}
                                onChange={e => {
                                    e.preventDefault()
                                    const { value } = e.target;
                                    var regex = /^\S*$/;
                                    if ( regex.test(value.toString()) || value === "" ) {
                                      setFieldValue("passwordRepeat", value);
                                    }
                                }}
                                onBlur={formik.handleBlur}
                                id={"passwordRepeat"}
                                error={errors.passwordRepeat}
                                touched={touched.passwordRepeat}
                                floatingLabel={t("repeat.password")}
                                autoComplete={"off"}
                            />
                                <span
                                    onClick={() => {
                                        showPassword(setHidePsswordRepeat,hidePsswordRepeat,passwordRepeatRef)
                                    }}
                                    className={styles.eyeIcon}
                                >{hidePsswordRepeat ? <EyeOffIcon color={"var(--color-grey-500)"}/>: <EyeIcon color={"var(--color-grey-500)"}/> }</span>
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
export default ChangePassword;

ChangePassword.propTypes = {
    twoFaError: PropTypes.object,              // Expected to be an object
    setShowTwoFA: PropTypes.func.isRequired,    // Expected to be a function, required
    setIsPasswordPopupOpen: PropTypes.func.isRequired, // Expected to be a function, required
    setUserInput: PropTypes.func.isRequired,    // Expected to be a function, required
  };