import styles from './Login.module.css';
import { useContext, useEffect, useRef, useState } from 'react';
import { useFormik, Form, FormikProvider } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import Input from '../../../Components/Input/Input';
import { isLogedIn, postSignin, SetAccessToken, SetRefreshToken } from '../../../Services/common';
import Switch from '../../../Components/Switch/Switch';
import { EyeIcon, EyeOffIcon } from '../../../assets/svg/svg';
import { UserContext } from '../../../Services/userContext';
import { useNotificationPopup } from '../../../Services/notificationPopupProvider';

const Login = () => {
  const [t] = useTranslation();
  const { setChangeUser } = useContext(UserContext);
  const [isShow, setIsShow] = useState(false);
  const history = useNavigate();
  const passwordRef = useRef();
  const { setWallet } = useContext(UserContext);
  const { setUserData } = useContext(UserContext);
  const { showSnackNotificationPopup } = useNotificationPopup();

  const LoginSchema = Yup.object().shape({
    username: Yup.string().required(t('username.required')),
    password: Yup.string().required(t('password.required')),
  });

  useEffect(() => {
    if (isLogedIn()) {
      history('/');
    }
  }, []);

  function showPassword() {
    if (!isShow) {
      setIsShow(true);
      passwordRef.current.type = 'text';
    } else {
      setIsShow(false);
      passwordRef.current.type = 'password';
    }
  }

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: LoginSchema,
    onSubmit: (data) => {
      postSignin(data.username, data.password)
        .then((resp) => {
          if (resp === false) {
            showSnackNotificationPopup({ status: 'FAILED', text: 'Sign in failed' });
            return;
          }
          const { access_token, refresh_token } = resp;
          SetRefreshToken(refresh_token);
          SetAccessToken(access_token);
          setUserData(false);
          setWallet(null);
          setChangeUser(true);
          history('/');
        })
        .catch((error) => {
          if (error.message === 'ATTEMPTS_EXCEEDED') {
            showSnackNotificationPopup({ status: 'FAILED', text: 'ATTEMPTS_EXCEEDED' });
          }
          const yupErrors = {};
          yupErrors.username = t(error.message);
          yupErrors.password = t(error.message);
          formik.setErrors(yupErrors);
        })
        .finally(() => {
          setSubmitting(false);
        });
    },
  });

  const { errors, touched, /*isSubmitting,*/ isSubmitting, setFieldValue, setSubmitting, handleSubmit } = formik;

  return (
    <div className={styles.loginWrapper}>
      <div className={styles.headerContainer}>
        <span className={styles.aviatorLogo}>TSUlink</span>
      </div>
      <div className={styles.switch}>
        <Switch
          names={[t('signIn'), t('create.account')]}
          links={['/login', '/register']}
          actives={[true, false]}
        ></Switch>
      </div>
      <FormikProvider value={formik}>
        <div className={styles.login}>
          <Form autoComplete="on" onSubmit={handleSubmit}>
            <Input
              className={styles.input}
              type={'text'}
              name={'username'}
              value={formik.values.username}
              onChange={(e) => {
                e.preventDefault();
                const { value } = e.target;
                const regex = /^[a-zA-Z][a-zA-Z0-9_]*$/;
                if (regex.test(value.toString()) || value === '') {
                  setFieldValue('username', value);
                }
              }}
              id={'username'}
              error={errors.username}
              touched={touched.username}
              floatingLabel={t('username')}
              autoComplete={'username'}
            />
            <div className={styles.inputContainer}>
              <Input
                type={'password'}
                name={'password'}
                ref={passwordRef}
                value={formik.values.password}
                onChange={formik.handleChange}
                id={'password'}
                error={errors.password}
                touched={touched.password}
                floatingLabel={t('password')}
                autoComplete={'current-password'}
              />
              <span
                onClick={() => {
                  showPassword();
                }}
                className={styles.eyeIcon}
              >
                {isShow ? <EyeIcon /> : <EyeOffIcon />}
              </span>
            </div>
            <button className={styles.loginButton + (isSubmitting ? ' ' + styles.disabled : '')} type="submit">
              {isSubmitting ? (
                <div className={styles.spinLoading}>
                  <div className={styles.spinLoadingOuterBlock}>
                    <div className={styles.spinLoadingBlock + ' ' + styles.one}></div>
                  </div>
                  <div className={styles.spinLoadingOuterBlock}>
                    <div className={styles.spinLoadingBlock + ' ' + styles.two}></div>
                  </div>
                  <div className={styles.spinLoadingOuterBlock}>
                    <div className={styles.spinLoadingBlock + ' ' + styles.three}></div>
                  </div>
                </div>
              ) : (
                t('signIn')
              )}
            </button>
          </Form>
        </div>
      </FormikProvider>
    </div>
  );
};

export default Login;
