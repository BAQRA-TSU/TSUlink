import styles from "./UpdateUser.module.css";
import { useEffect, useRef } from "react";
import { useFormik, Form, FormikProvider } from "formik";
import * as Yup from "yup";
import { isValidPhoneNumber } from "libphonenumber-js";
import { useTranslation } from "react-i18next";
import { NavLink, useNavigate } from "react-router-dom";

import { isLogedIn } from "../../../../Services/common";
import Input from "../../../../Components/Mobile/Input/Input";
import { BackIcon } from "../../../../assets/svg/svg";
import { PostRecoverySend } from "../../../../Services/service";
import { useNotificationPopup } from "../../../../Services/notificationPopupProvider";


const UpdateUser = () => {
    const history = useNavigate();
    const [t] = useTranslation();
    const numberRef = useRef();
  const { showSnackNotificationPopup } = useNotificationPopup();

  
    const RegisterSchema = Yup.object().shape({
        personalId: Yup.string().required(t("id.required")),
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
            console.log(isValidPhoneNumber(formik.values.numberCode + formik.values.number));
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
            personalId: "",
            numberCode: "+995"
        },
        validationSchema: RegisterSchema,
        validateOnBlur: true,
        validateOnChange: true,
        validateOnMount: false,
        onSubmit: (data) => {
            PostRecoverySend(data.numberCode + data.number, data.personalId)
                .then(() => {
                    showSnackNotificationPopup({status: "COMPLETED",  text: t("get.user.recover")});
                    history("/login")
                })
                .catch((error) => {
                    const yupErrors = {};
                    if(error.response && error.response.data.message === "ATTEMPTS_EXCEEDED"){
                        yupErrors.number = t("attempts.exceeded");
                    }else if(error.response.status === 404){
                        yupErrors.number = t("account.info.incorect.user");
                        yupErrors.personalId = t("account.info.incorect.user");
                    } else{
                        yupErrors.number = t(error.response.data.message);
                        yupErrors.personalId = t(error.response.data.message);
                    }
                    if (yupErrors != null) {
                        formik.setErrors(yupErrors);
                    }
                });
        },
    });

    const { errors, touched, setFieldValue ,  /*isSubmitting,*/ handleSubmit } = formik;

    return (
        <div className={styles.updatePsswordWrapper}>
            <div className={styles.headerContainer}>
                <NavLink to={"/login"} className={styles.backIcon}><BackIcon/></NavLink>
                <NavLink to={"/"} className={styles.aviatorLogo}></NavLink>
            </div>
            <h1 className={styles.updatePsswordHeader}>{t("user.recovery")}</h1>
            <p className={styles.text}>{t("get.user.recover")}</p>
            <FormikProvider value={formik}>
                <div className={styles.form}>
                    <Form onSubmit={handleSubmit}>                            
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
                                />
                            </div>
                        <button className={styles.submitButton} type="submit">
                            {t("recover.username")}
                        </button>
                    </Form>
                </div>
            </FormikProvider>
        </div>
    );
};

export default UpdateUser;
