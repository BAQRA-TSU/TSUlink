import styles from "./Details.module.css";
import { useContext, useEffect, useRef, useState } from "react";
import { useFormik, Form, FormikProvider } from "formik";
import * as Yup from "yup";

import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { isLogedIn, SetAccessToken, SetRefreshToken } from "../../../../Services/common";
import Input from "../../../../Components/Mobile/Input/Input";
import { BackIcon, EyeIcon, EyeOffIcon, NotValidIcon, ValidIcon } from "../../../../assets/svg/svg";
import { PostRegister } from "../../../../Services/service";
import { UserContext } from "../../../../Services/userContext";
import { Trans, useTranslation } from "react-i18next";
import WarningPopup from "../../../../Components/Mobile/WarningPopup/WarningPopup";
import { useNotificationPopup } from "../../../../Services/notificationPopupProvider";
import Popup from "../../../../Components/Mobile/Popup/Popup";

const Details = () => {
    const [t, i18n] = useTranslation();
    const history = useNavigate();
    const location = useLocation();
    const passwordRef = useRef();
    const passwordRepeatRef = useRef();
    const [showPopup, setShowPopup] = useState()
    const [hidePssword, setHidePssword] = useState(true);
    const [hidePsswordRepeat, setHidePsswordRepeat] = useState(true);
    const [isSpecValid, setIsSpecValid] = useState(false);
    const [isUppercaseValid, setUppercaseValid] = useState(false);
    const [isNumValid, setIsNumValid] = useState(false);
    const [isMinValid, setIsMinValid] = useState(false);
    const [isTermsVisible, setIsTermsVisible] = useState(false);
    const { setChangeUser } = useContext(UserContext);
    const { setWallet } = useContext(UserContext);
    const { showSnackNotificationPopup } = useNotificationPopup();
    const checkRef1 = useRef();
    const checkRef2 = useRef();

    function showPassword(state, isShow, ref) {
        if (!isShow) {
            state(true);
            ref.current.type = "password";
        } else {
            state(false);
            ref.current.type = "text";
        }
    }

    useEffect(() => {
        if (!location.state) {
            history("/register");
        }
    },[])
    const id = location.state ? location.state.id : '';
    const country = location.state ? location.state.country : '';
    let registerSchema;
    if(country == "GE"){
        registerSchema = Yup.object().shape({
            username: Yup.string().min(6,t('must.be.longer.then.6')).max(30,t('must.be.shorter.then.30')).required(t('username.required')),
            email: Yup.string().matches(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
              ,t('email.invalid')).required(t('email.required')).max(63,t('must.be.shorter.then.63')).email(t('email.invalid')),
            password: Yup.string().required(t('password.required')),
            passwordRepeat: Yup.string().equals([Yup.ref('password')],t('passwords.not.match')).required(t('password.repeat.required')),
        });
    }else{
        registerSchema = Yup.object().shape({
            firstName: Yup.string().required(t('firstName.required')),
            lastName: Yup.string().required(t('lastName.required')),
            username: Yup.string().min(6,t('must.be.longer.then.6')).max(30,t('must.be.shorter.then.30')).required(t('username.required')),
            email: Yup.string().matches(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
              ,t('email.invalid')).required(t('email.required')).max(63,t('must.be.shorter.then.63')).email(t('email.invalid')),
            password: Yup.string().required(t('password.required')),
            passwordRepeat: Yup.string().equals([Yup.ref('password')],t('passwords.not.match')).required(t('password.repeat.required')),
        });
    }
    
    // const [signIn] = useMutation(SIGN_IN_MUTATION);

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

    const formik = useFormik({
        initialValues: {
            firstName: "",
            lastName: "",
            username: "",
            password: "",
            email: "",
            passwordRepeat: ""
        },
        validationSchema: registerSchema,
        validateOnBlur: true,
        validateOnChange: true,
        onSubmit: (data) => {
            if (isMinValid && isSpecValid && isUppercaseValid && isNumValid) {
                if (checkRef2.current.checked) {
                    console.log(data);
                    PostRegister(id, data.username, data.password, data.email, checkRef1.current.checked, i18n.language, (data.firstName && data.firstName) , (data.lastName && data.lastName) )
                        .then((resp) => {
                            const { access_token, refresh_token} = resp.data;
                            showSnackNotificationPopup({status: "COMPLETED",  text: t("account.created")});
                            SetRefreshToken(refresh_token);
                            SetAccessToken(access_token);
                            setChangeUser(true);
                            setWallet(null);
                            history("/")
                        })
                        .catch((error) => {
                            const yupErrors = {};
                            switch (error.response && error.response.status) {
                                case 400:
                                    yupErrors.password = t('password.not.strong');
                                    break;
                                case 409:
                                    yupErrors.username = t('username.exists');
                                    break
                                case 401:
                                    showSnackNotificationPopup({status: "FAILED",  text: t("account.session.expired")});
                                    history("/register");
                                    break
                                default:
                                    break;
                            }
                            if (yupErrors != null) {
                                formik.setErrors(yupErrors);
                            }
                        })
                        .finally(() => {
                            setSubmitting(false);
                        })
                } else {
                    setSubmitting(false);
                    if (!checkRef2.current.checked) {
                        checkRef2.current.style.border = "1.5px solid rgba(220, 61, 67, 1)"; 
                    }
                }
            } else {
                setSubmitting(false);
                const yupErrors = {};
                yupErrors.password = t('password.not.strong');
                yupErrors.passwordRepeat = t('password.not.strong');
                formik.setErrors(yupErrors);
            }
        },
    });

    // useEffect(() => { 
    //     setIsAllFilled(true)
    //     for (let index = 0; index < Object.values(formik.values).length; index++) {
    //         const element = Object.values(formik.values)[index];
    //         if (element.length === 0) {
    //             setIsAllFilled(false);
    //         }
    //     }

    // }, [formik.values])

    const { errors, touched, setFieldValue , isSubmitting, setSubmitting, handleSubmit } = formik;

    return (
        <>
            <div className={styles.detailsWrapper}>
                {showPopup && <WarningPopup warningHeader={"back.warning.header"} warningText={"back.warning.text"} buttonSubmit={"submit.back"} buttonCancel={"cancel"} showPopup={showPopup} setShowPopup={setShowPopup} submit={() => { history('/register') }} />}
                <div className={styles.headerContainer}>
                    <div onClick={() => setShowPopup(true)} className={styles.backIcon}><BackIcon/></div>
                    <span className={styles.aviatorLogo}></span>
                </div>
                <h1 className={styles.detailsHeader}>{t("account.details")}</h1>
                {/* <p className={styles.text}>შეიყვანე კოდი რომელიც გამოგიგზავნეთ, თქვენს მითითებულ ტელეფონის ნომერზე 5995*****31</p> */}
                <FormikProvider  validateOnBlur value={formik}>
                    <div className={styles.form}>
                        <Form onSubmit={handleSubmit}>
                            {country !== "GE" &&
                                <>
                                    <Input
                                        className={styles.input}
                                        type={"text"}
                                        name={"firstName"}
                                        value={formik.values.firstName}
                                        onChange={e => {
                                            e.preventDefault()
                                            const { value } = e.target;
                                            const regex = /^[a-zA-Z][a-zA-Z0-9_]*$/;
                                            if ( regex.test(value.toString()) || value === "" ) {
                                            setFieldValue("firstName", value);
                                            }
                                        }}
                                        onBlur={formik.handleBlur}
                                        id={"firstName"}
                                        error={errors.firstName}
                                        touched={touched.firstName}
                                        floatingLabel={t("name.firstName")}
                                        autoComplete={"off"}
                                    />
                                    <Input
                                        className={styles.input}
                                        type={"text"}
                                        name={"lastName"}
                                        value={formik.values.lastName}
                                        onChange={e => {
                                            e.preventDefault()
                                            const { value } = e.target;
                                            const regex = /^[a-zA-Z][a-zA-Z0-9_]*$/;
                                            if ( regex.test(value.toString()) || value === "" ) {
                                            setFieldValue("lastName", value);
                                            }
                                        }}
                                        onBlur={formik.handleBlur}
                                        id={"lastName"}
                                        error={errors.lastName}
                                        touched={touched.lastName}
                                        floatingLabel={t("name.lastName")}
                                        autoComplete={"off"}
                                    />
                                </>
                            }
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
                            <Input
                                className={styles.input}
                                type={"email"}
                                name={"email"}
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                id={"email"}
                                error={errors.email}
                                touched={touched.email}
                                floatingLabel={t("email")} 
                                autoComplete={"off"}
                            />
                            <div className={styles.inputContainer}>
                                <Input
                                    type={"password"}
                                    name={"password"}
                                    ref={passwordRef}
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
                                    autoComplete={"off"}
                                />
                                    <span
                                        onClick={() => {
                                            showPassword(setHidePssword,hidePssword,passwordRef)
                                        }}
                                        className={styles.eyeIcon}
                                    >{hidePssword ? <EyeOffIcon color={"var(--color-grey-500)"}/> : <EyeIcon color={"var(--color-grey-500)"}/>}</span>
                            </div>
                            <div className={styles.validationContainer}>
                                <div className={styles.validation}>
                                    <span className={styles.validationIcon }>{ isMinValid? <ValidIcon/> : <NotValidIcon/>}</span>
                                    <p className={styles.validationText}>{t("password.min.8.char")} </p>
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
                                    >{hidePsswordRepeat ? <EyeOffIcon color={"var(--color-grey-500)"}/> : <EyeIcon color={"var(--color-grey-500)"}/>}</span>
                            </div>
                            <div className={styles.footer}>
                                <div className={styles.footerTextDiv}>
                                    <div className={styles.footerText}>
                                        <Trans i18nKey="accept.marketing">ვეთანხმები მივიღო “ავიატოორ ბეთის”-სგან განახლებები და <NavLink className={styles.footerLink}>მარკეტინგული შეტყობიბები</NavLink></Trans>
                                    </div>
                                    <input ref={checkRef1} className={styles.checkbox} defaultChecked={true} type="checkbox"></input>
                                </div>
                                <div className={styles.footerTextDiv}>
                                    <div className={styles.footerText}>
                                    <Trans i18nKey="accept.rules">რეგისტრაციით ეთანხმები შპს “ავიატორ ბეთის” გამოყენების <span onClick={() => setIsTermsVisible(true)} className={styles.footerLink}>წესებსა და პირობებს </span> </Trans>
                                    </div>
                                    <input ref={checkRef2} className={styles.checkbox} type="checkbox"></input>
                                </div>
                                <button type="submit" className={styles.submitButton  + (isSubmitting ? " " + styles.disabled : "")}>
                                    {isSubmitting? 
                                        <div className={styles.spinLoading}>
                                            <div className={styles.spinLoadingOuterBlock}>
                                                <div className={styles.spinLoadingBlock + " " + styles.one}></div>
                                            </div>
                                            <div className={styles.spinLoadingOuterBlock}>
                                                <div className={styles.spinLoadingBlock + " " + styles.two}></div>
                                            </div>
                                            <div className={styles.spinLoadingOuterBlock}>
                                                <div className={styles.spinLoadingBlock + " " + styles.three}></div>
                                            </div>
                                        </div>
                                    :
                                        t("continue")
                                    }
                                </button>
                            </div>
                        </Form>
                    </div>
                </FormikProvider>
            </div>
            {isTermsVisible &&
                <Popup header={"terms.privacy.conditions"} hidePopup={setIsTermsVisible}>
                    {
                    <>
                        <div className={styles.content}
                            dangerouslySetInnerHTML={{ __html: t("register.terms.conditions") }}
                        />
                        <div className={styles.contentSecurity}
                            dangerouslySetInnerHTML={{ __html: t("security.confidentiality.text") }}
                        />
                    </>
                //    t("register.terms.conditions")
                   }
                </Popup>
            }
        </>
    );
};

export default Details;
