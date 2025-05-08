import styles from "./Register.module.css";
import { useEffect, useRef, useState } from "react";
import { useFormik, Form, FormikProvider } from "formik";
import * as Yup from "yup";
import { isValidPhoneNumber }  from 'libphonenumber-js'
import { useTranslation } from "react-i18next";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

import { isLogedIn } from "../../../../Services/common";
import Switch from "../../../../Components/Mobile/Switch/Switch";
import Input from "../../../../Components/Mobile/Input/Input";
import { CloseCircleIcon } from "../../../../assets/svg/svg";
import { PostSendCode } from "../../../../Services/service";
import MobileHeaderLogo from "../../../../Components/Mobile/MobilHeaderLogo/MobileHeaderLogo";

const Register = () => {
    const [t] = useTranslation();
    const history = useNavigate();
    const location = useLocation();
    let yupError = location.state;
    const [yearList, setYearList] = useState([]);
    const [monthList, setMonthList] = useState([]);
    const [dayList, setDayList] = useState([]);
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const yearNow = new Date().getFullYear();
    const errorRef = useRef();
    const personalIdRef = useRef();
    const mothRef = useRef();
    const numberRef = useRef();
    const [isNumberError, setIsNumberError] = useState(yupError && Object.keys(yupError).includes("number") ? true : false)
    const [isIdError, setIsIdError] = useState(yupError && Object.keys(yupError).includes("personalId") ? true : false)
    const [isError, setIsError] = useState();
    
    const RegisterSchema = Yup.object().shape({
        country: Yup.string().required(t("country.required")),
        personalId: Yup.string().test("test-num", t("id.min.char"), (val) => {return validateId(val)}).required(t("id.required")),
        birthYear: Yup.number().required(t("birth.required")),
        // birthMonth: Yup.string().required(t("birth.required")),
        // birthDay: Yup.number().required(t("birth.required")),
        number: Yup.number().test("test-num",t("num.invalid"),validateNumber).required(t("num.required")),
    });

    useEffect(() => {
        if (isLogedIn()) {
            history("/");
        }
    }, [history]);

    const formik = useFormik({
        initialValues: {
            country: "GE",
            personalId: "",
            birthYear: "",
            birthMonth: "",
            birthDay: "",
            number: "",
            numberCode: "+995"
        },
        validationSchema: RegisterSchema,
        validateOnBlur: true,
        validateOnChange: true,
        validateOnMount: false,
        onSubmit: (data) => {
            PostSendCode(data.numberCode + data.number)
                .then((resp) => {
                    if (!resp.data.accountExists) {
                        history('/register/code',{state:data});
                    }
                })
                .catch((error) => {
                    const yupErrors = {};
                    if(error.response && error.response.data.message === "ATTEMPTS_EXCEEDED") {
                        yupErrors.number = t("attempts.exceeded");
                    }
                    if(error.response && error.response.status === 409){
                        yupErrors.number = t("number.exists");
                    }
                    if (yupErrors != null) {
                        formik.setErrors(yupErrors);
                    }
                })
        },
    });

    const { errors, touched, setFieldValue,/*isSubmitting,*/ handleSubmit } = formik;

    function AdjustDays(e) {
        e.preventDefault()
        const { value } = e.target;
        setFieldValue("birthMonth", value);
        setFieldValue("birthDay", 1);
        var year = formik.values.birthYear;
        var month = parseInt(value) + 1;
        var days = new Date(year, month, 0).getDate();
        setDayList([]);
        for (let index = 1; index <= days; index++) {
            setDayList(prevDayList => ([
                ...prevDayList,
                <option key={index} value={index}>{index}</option>
            ]));
        }
    }
    function validateId(val) {
        if (val) {
            if (formik.values.country === "GE") {
                if (val.length >= 11) {
                    return true;
                }
                return false
            }
        }
        return true
    }

    function validateNumber() {
        if (!(document.activeElement === numberRef.current)) {
            if (formik.values.number && !isValidPhoneNumber(formik.values.numberCode + formik.values.number) ) { 
                return false;
            }
            return true;
        }
        return true;
    }
    
    useEffect(() => {
        if (isIdError || isNumberError) {
            setIsError(true);
            formik.setErrors(yupError);
            errorRef.current.innerHTML = Object.values(yupError)[0];
            window.history.replaceState({}, '')
        }
    },[])

    useEffect(() => { 
        if (formik.values.personalId || formik.values.number) {
            setIsError(false);
            setIsIdError(false);
            setIsNumberError(false)
        }
    }, [formik.values])

    useEffect(() => {
        if (formik.values.country === "GE") {
            setYearList([]);
            for (let index = yearNow-25; index > yearNow - 100; index--) {
                setYearList(prevYearList => ([
                    ...prevYearList,
                    <option key={index} value={index}>{index}</option>
                ]));
            }
        } else {
            setYearList([]);
            setMonthList([]);
            setDayList([]);
            setFieldValue("birthDay", 1);
            setFieldValue("birthMonth", 0);
            setFieldValue("birthYear", yearNow);
            formik.values.personalId = ""
            formik.setTouched({...formik.touched, ["personalId"]: false });
            for (let index = yearNow-18; index > yearNow - 100; index--) {
                setYearList(prevYearList => ([
                    ...prevYearList,
                    <option key={index} value={index}>{index}</option>
                ]));
            }
            for (let index = 0; index < monthNames.length; index++) {
                setMonthList(prevMonthList => ([
                    ...prevMonthList,
                    <option key={index} value={index}>{monthNames[index]}</option>
                ]));
            }
            var year = yearNow;
            var month = parseInt(0) + 1;
            var days = new Date(year, month, 0).getDate();
            for (let index = 1; index <= days; index++) {
                setDayList(prevDayList => ([
                    ...prevDayList,
                    <option key={index} value={index}>{index}</option>
                ]));
            }
        }
    }, [formik.values.country])

    return (
        <div className={styles.registerWrapper}>
            <div className={styles.headerContainer}>
                <MobileHeaderLogo/>
                <NavLink to={"/"}><CloseCircleIcon/></NavLink>
            </div>
            <Switch
                names={[t("signIn"), t("create.account")]}
                links={["/login", "/register"]}
                actives={[false, true]}
            ></Switch>
            <FormikProvider value={formik}>
                <div className={styles.form}>
                    <Form onSubmit={handleSubmit}>
                        <div className={styles.inputContainer}>
                            {/* <select></select> */}
                            <select
                                className={styles.input + (errors.country && touched.country ? " " + styles.inputError : "")}
                                value={formik.values.country}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                list="countris"
                                name="country"
                                id="country"
                                autoComplete="off"
                            >
                                <option value="GE" label="Georgia">Georgia</option>
                                <option value="AM" label="Armenia">Armenia</option>
                                <option value="US" label="United States">United States</option>
                                <option value="KP" label="North Korea">North Korea</option>
                                {/* <option value="TUR" label="Turkey">Turkey</option> */}
                                {/* <option value="TUR" label="Turkey">Turkey</option>
                                <option value="DEU" label="German">Germany</option> */}
                            </select>
                            <p className={styles.error}>
                                {errors.country &&
                                    touched.country &&
                                    errors.country}
                            </p>
                            <span className={styles.floatingLabel}>
                                Country
                            </span>
                        </div>
                        {formik.values.country === "GE" ? 
                            <div className={styles.inputContainer}>
                                <select
                                    className={styles.input + " " + styles.birthYear + (errors.birthYear && touched.birthYear ? " " + styles.inputError : "")}
                                    value={formik.values.birthYear}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    type="number"
                                    name="birthYear"
                                    id="birthYear"
                                    autoComplete="off"> <option value="">{t("birth.year")}</option> {yearList}</select>
                                <div className={styles.background + (errors.birthYear && touched.birthYear? " " + styles.inputError: "" )}></div>
                                <p className={styles.error}>
                                    {errors.birthYear &&
                                        touched.birthYear &&
                                        errors.birthYear}
                                </p>
                            </div>
                        :
                            <div className={styles.birthDate}>
                                <div className={styles.inputContainer}>
                                    <select
                                        className={styles.input + " " + styles.birthYear + " " + styles.nonResident + (errors.birthYear && touched.birthYear ? " " + styles.inputError : "")}
                                        value={formik.values.birthYear}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        type="number"
                                        name="birthYear"
                                        id="birthYear"
                                        autoComplete="off"> {yearList}</select>
                                    <div className={styles.background+ " " + styles.nonResident + (errors.birthYear && touched.birthYear? " " + styles.inputError: "" )}></div>
                                    <p className={styles.error}>
                                        {errors.birthYear &&
                                            touched.birthYear &&
                                            errors.birthYear}
                                    </p>
                                </div>
                                <div className={styles.inputContainer}>
                                    <select
                                        ref={mothRef}
                                        className={styles.input + " " + styles.birthYear + " " + styles.nonResident + (errors.birthMonth && touched.birthMonth ? " " + styles.inputError : "")}
                                        value={formik.values.birthMonth}
                                        onChange={e => AdjustDays(e)}
                                        onBlur={formik.handleBlur}
                                        type="number"
                                        name="birthMonth"
                                        id="birthMonth"
                                        autoComplete="off"> {monthList}</select>
                                    <div className={styles.background+ " " + styles.nonResident + (errors.birthMonth && touched.birthMonth? " " + styles.inputError: "" )}></div>
                                    <p className={styles.error}>
                                        {errors.birthMonth &&
                                            touched.birthMonth &&
                                            errors.birthMonth}
                                    </p>
                                </div>
                                <div className={styles.inputContainer}>
                                    <select
                                        className={styles.input + " " + styles.birthYear + " " + styles.nonResident + (errors.birthDay && touched.birthDay ? " " + styles.inputError : "")}
                                        value={formik.values.birthDay}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        type="number"
                                        name="birthDay"
                                        id="birthDay"
                                        autoComplete="off"> {dayList}</select>
                                    <div className={styles.background+ " " + styles.nonResident + (errors.birthDay && touched.birthDay? " " + styles.inputError: "" )}></div>
                                    <p className={styles.error}>
                                        {errors.birthDay &&
                                            touched.birthDay &&
                                            errors.birthDay}
                                    </p>
                                </div>
                            </div>
                        }
                        <Input
                            type="text"
                            id="personalId"
                            name="personalId"
                            maxlength={formik.values.country === "GE"? 11 : ""}
                            value={formik.values.personalId}
                            onChange={formik.values.country === "GE" ? e => {
                                e.preventDefault();
                                const { value } = e.target;
                                const regex = /^(0*[0-9][0-9]*(\[0-9]*)?|0*\[0-9]*[1-9][0-9]*)$/;
                                if ( regex.test(value.toString()) || value === "" ) {
                                  setFieldValue("personalId", value);
                                }
                            } : e => {
                                e.preventDefault();
                                const { value } = e.target;
                                const regex = /^[a-zA-Z0-9_-]*$/;
                                if ( regex.test(value.toString()) || value === "" ) {
                                  setFieldValue("personalId", value);
                                }
                            } }
                            ref={personalIdRef}
                            onBlur={formik.handleBlur}
                            className={styles.input}
                            error={errors.personalId}
                            touched={touched.personalId}
                            floatingLabel={formik.values.country === "GE" ? t("id"): t("passport.number")}
                            autoComplete={"off"}
                            isError={isIdError}
                        />
                        <div className={styles.inputs}>
                            <div className={styles.codeDiv}>
                                <select
                                    className={styles.codeInput}
                                    value={formik.values.numberCode}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    name="numberCode"
                                    id="numberCode"
                                    autoComplete="off"
                                >
                                    <option value="+995" label="+995">+995</option>
                                    <option value="+90" label="+90">+90</option>
                                    <option value="+374" label="+374">+374</option>
                                    <option value="+49" label="+49">+49</option>
                                </select>
                                {/* <input onChange={(input) => codeChange(input)} className={styles.codeInput} type="number"></input> */}
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
                            <select style={{display: "none"}}></select>
                        </div>
                        <button className={styles.registerButton /*+ " " +(isAllFilled? "": styles.disabled)*/} type="submit">
                            {t("create.account")}
                        </button>
                    </Form>
                </div>
            </FormikProvider>
            <div ref={errorRef} className={styles.outerErrorDiv + " " +  (isError? styles.active : "") }></div>
        </div>
    );
};

export default Register;
