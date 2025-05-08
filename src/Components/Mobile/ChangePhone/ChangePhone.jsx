import { useTranslation } from "react-i18next";
import styles from "./ChangePhone.module.css";
import { Form, FormikProvider, useFormik } from "formik";
import * as Yup from "yup";
import { isValidPhoneNumber } from "libphonenumber-js";
import { useContext, useEffect, useRef, useState } from "react";
import Input from "../Input/Input";
import { EyeIcon, EyeOffIcon } from "../../../assets/svg/svg";
import {phoneUpdateSend} from "../../../Services/common.jsx"
import PropTypes from 'prop-types';
import { useNotificationPopup } from "../../../Services/notificationPopupProvider.jsx";
import { UserContext } from "../../../Services/userContext.jsx";

const ChangePhone = ({setTwoFaError, twoFaError, setShowTwoFA,setIsPhonePopupOpen, setUserInput}) => {
    const { t } = useTranslation();
    const numberRef = useRef();
    const passwordRef = useRef();
    const [hidePssword, setHidePssword] = useState(true);
    const { showSnackNotificationPopup } = useNotificationPopup();
    const { logout } = useContext(UserContext);

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
        password: Yup.string().required(t("password.required")),
        personalId: Yup.string().required(t("id.required")),
        number: Yup.number().test("test-num",t("num.invalid"),validateNumber).required(t("num.required")),
    });

    const formik = useFormik({
        initialValues: {
            password: "",
            personalId: "",
            number: "",
            numberCode: "+995"
        },
        validationSchema: RegisterSchema,
        validateOnBlur: true,
        validateOnChange: true,
        validateOnMount: false,
        onSubmit: (data) => {  
            phoneUpdateSend(data.numberCode + data.number)
                .then((resp) => {
                    if (resp === false) {
                        showSnackNotificationPopup({status: "FAILED", text: "Phone send failed"});
                        return;
                    }
                    setIsPhonePopupOpen(false);
                    setShowTwoFA(true);
                    setUserInput({ password: data.password, personalId: data.personalId, number: data.number, numberCode: data.numberCode })
                })
                .catch((error) => {
                    if(error.message === "UNAUTHORIZED"){
                        logout();
                    } else if(error.message === "ATTEMPTS_EXCEEDED"){
                        const yupErrors = {};
                        yupErrors.number = t("attempts.exceeded");
                        setTwoFaError(yupErrors)
                    } else if(error.message === "ACCOUNT_ALREADY_EXISTS"){
                        const yupErrors = {};
                        yupErrors.number = t("number.exists");
                        setTwoFaError(yupErrors)
                    }else{
                        showSnackNotificationPopup({status: "FAILED", text: error.message});
                    }
                })
        },
    });

    useEffect(() => {
        if (twoFaError) {
            formik.setErrors(twoFaError);
        }
    },[twoFaError])

    function validateNumber() {
        if (!(document.activeElement === numberRef.current)) {
            if (formik.values.number && !isValidPhoneNumber(formik.values.numberCode + formik.values.number) ) { 
                return false;
            }
            return true;
        }
        return true;
    }

    const { errors, touched, setFieldValue ,  /*isSubmitting,*/ handleSubmit } = formik;


	return (
		<div className={styles.changePhoneWrapper}>
			<p className={styles.changePhoneHeader}>
				{t("change.phone.header")}
			</p>
			<FormikProvider value={formik}>
                <div className={styles.form}>
                    <Form onSubmit={handleSubmit}>                            
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
                                    isError={twoFaError? true : false}
                                />
                        </div>
                        <Input
                                className={styles.input}
                                type={"text"}
                                name={"personalId"}
                                value={formik.values.personalId}
                                onChange={(e) => {
                                    e.preventDefault();
                                    const { value } = e.target;
                                    const regex = /^[a-zA-Z0-9_-]*$/;
                                    if (regex.test(value.toString()) || value === "") {
                                        setFieldValue("personalId", value);
                                    }
                                }}
                                onBlur={formik.handleBlur}
                                id={"personalId"}
                                error={errors.personalId}
                                touched={touched.personalId}
                                floatingLabel={t("id")}
                                autoComplete={"off"}
                                isError={twoFaError? true : false}
                        />
                        <div className={styles.inputContainer}>
                            <Input
                                type={"password"}
                                name={"password"}
                                ref={passwordRef}
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                id={"password"}
                                error={errors.password}
                                touched={touched.password}
                                floatingLabel={t("password")}
                                autoComplete={"off"}
                                isError={twoFaError? true : false}
                            />
                                <span
                                    onClick={() => {
                                        showPassword(setHidePssword,hidePssword,passwordRef)
                                    }}
                                    className={styles.eyeIcon}
                                >{hidePssword ? <EyeOffIcon color={"var(--color-grey-500)"}/> : <EyeIcon color={"var(--color-grey-500)"}/>}</span>
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
export default ChangePhone;

ChangePhone.propTypes = {
    setTwoFaError: PropTypes.func.isRequired,
    twoFaError: PropTypes.object,
    setShowTwoFA: PropTypes.func.isRequired,
    setIsPhonePopupOpen: PropTypes.func.isRequired,
    setUserInput: PropTypes.func.isRequired,
};