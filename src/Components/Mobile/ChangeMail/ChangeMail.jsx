import { useTranslation } from "react-i18next";
import styles from "./ChangeMail.module.css";
import { Form, FormikProvider, useFormik } from "formik";
import * as Yup from "yup";
import Input from "../Input/Input";
import { editUserInfo } from "../../../Services/common";
import PropTypes from 'prop-types';
import { useNotificationPopup } from "../../../Services/notificationPopupProvider";
import { UserContext } from "../../../Services/userContext";
import { useContext } from "react";

const ChangeMail = ({setIsEmailPopupOpen,setUserData, userData}) => {
	const { t } = useTranslation();
    const { showSnackNotificationPopup } = useNotificationPopup();
    const { logout } = useContext(UserContext);

    const RegisterSchema = Yup.object().shape({
        email: Yup.string().matches(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          ,t('email.invalid')).required(t('email.required')).max(63,t('must.be.shorter.then.63')).email(t('email.invalid')),
    });

    const formik = useFormik({
        initialValues: {
            email: "",
        },
        validationSchema: RegisterSchema,
        validateOnBlur: true,
        validateOnChange: true,
        validateOnMount: false,
        onSubmit: (data) => {  
            editUserInfo("secondaryEmail", data.email)
                .then((resp) => {
                    if (resp === false) {
                        showSnackNotificationPopup({status: "FAILED", text: "Edit failed"});
                        return;
                    }
                    setUserData({ ...userData, secondaryEmail: data.email })
                    setIsEmailPopupOpen(false);
                })
                .catch((error) => {
                    if(error.message === "UNAUTHORIZED"){
                        logout();
                    }else{
                        showSnackNotificationPopup({status: "FAILED", text: error.message});
                    }
                })
        },
    });

    const { errors, touched,  /*isSubmitting,*/ handleSubmit } = formik;


	return (
        <div className={styles.changeEmailWrapper}>
            <p className={styles.changeEmailHeader}>{t("change.email.header")}</p>
			<FormikProvider value={formik}>
                <div className={styles.form}>
                    <Form onSubmit={handleSubmit}>                            
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
                        <button className={styles.submitButton} type="submit">
                            {t("change.email.button")}
                        </button>
                    </Form>
                </div>
            </FormikProvider>
        </div>
	);
};
export default ChangeMail;

ChangeMail.propTypes = {
    setIsEmailPopupOpen: PropTypes.func.isRequired,  // Function to close the popup
    setUserData: PropTypes.func.isRequired,         // Function to update user data
    userData: PropTypes.object.isRequired           // The user data object, required
};