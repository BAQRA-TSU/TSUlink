import styles from './Register.module.css';
import { useContext, useEffect, useRef, useState } from 'react';
import { useFormik, Form, FormikProvider } from 'formik';
import * as Yup from 'yup';

import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { isLogedIn, SetAccessToken, SetRefreshToken } from '../../../../Services/common';
import Input from '../../../../Components/Mobile/Input/Input';
import { BackIcon, EyeIcon, EyeOffIcon, NotValidIcon, ValidIcon } from '../../../../assets/svg/svg';
import { PostRegister } from '../../../../Services/service';
import { UserContext } from '../../../../Services/userContext';
import { Trans, useTranslation } from 'react-i18next';
import WarningPopup from '../../../../Components/Mobile/WarningPopup/WarningPopup';
import { useNotificationPopup } from '../../../../Services/notificationPopupProvider';
import Popup from '../../../../Components/Mobile/Popup/Popup';
import Switch from '../../../../Components/Mobile/Switch/Switch';

const Register = () => {
  const [t, i18n] = useTranslation();
  const history = useNavigate();
  const location = useLocation();
  const passwordRef = useRef();
  const passwordRepeatRef = useRef();
  const [showPopup, setShowPopup] = useState();
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
      ref.current.type = 'password';
    } else {
      state(false);
      ref.current.type = 'text';
    }
  }

  useEffect(() => {
    if (!location.state) {
      history('/register');
    }
  }, []);
  const id = location.state ? location.state.id : '';
  const country = location.state ? location.state.country : '';
  let registerSchema;
  if (country == 'GE') {
    registerSchema = Yup.object().shape({
      username: Yup.string()
        .min(6, t('must.be.longer.then.6'))
        .max(30, t('must.be.shorter.then.30'))
        .required(t('username.required')),
      password: Yup.string().required(t('password.required')),
      passwordRepeat: Yup.string()
        .equals([Yup.ref('password')], t('passwords.not.match'))
        .required(t('password.repeat.required')),
    });
  } else {
    registerSchema = Yup.object().shape({
      username: Yup.string()
        .min(6, t('must.be.longer.then.6'))
        .max(30, t('must.be.shorter.then.30'))
        .required(t('username.required')),
      password: Yup.string().required(t('password.required')),
      passwordRepeat: Yup.string()
        .equals([Yup.ref('password')], t('passwords.not.match'))
        .required(t('password.repeat.required')),
    });
  }

  // const [signIn] = useMutation(SIGN_IN_MUTATION);

  useEffect(() => {
    if (isLogedIn()) {
      history('/');
    }
  }, [history]);

  useEffect(() => {
    const passwordElement = passwordRef.current;
    const handleEvent = (event) => {
      const val = event.target.value;
      val.length >= 8 ? setIsMinValid(true) : setIsMinValid(false);
      val.match(/[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~ ]/) !== null ? setIsSpecValid(true) : setIsSpecValid(false);
      val.match(/[A-Z]/) !== null && val.match(/[a-z]/) !== null ? setUppercaseValid(true) : setUppercaseValid(false);
      val.match(/\d+/) !== null ? setIsNumValid(true) : setIsNumValid(false);
    };
    passwordElement.addEventListener('keyup', handleEvent);
    return () => passwordElement.removeEventListener('keyup', handleEvent);
  }, []);

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      passwordRepeat: '',
    },
    validationSchema: registerSchema,
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: (data) => {
      if (isMinValid && isSpecValid && isUppercaseValid && isNumValid) {
        if (checkRef2.current.checked) {
          console.log(data);
          PostRegister(data.username, data.password)
            .then((resp) => {
              const { access_token, refresh_token } = resp.data;
              showSnackNotificationPopup({ status: 'COMPLETED', text: t('account.created') });
              SetRefreshToken(refresh_token);
              SetAccessToken(access_token);
              setChangeUser(true);
              setWallet(null);
              history('/');
            })
            .catch((error) => {
              const yupErrors = {};
              switch (error.response && error.response.status) {
                case 400:
                  yupErrors.password = t('password.not.strong');
                  break;
                case 409:
                  yupErrors.username = t('username.exists');
                  break;
                case 401:
                  showSnackNotificationPopup({ status: 'FAILED', text: t('account.session.expired') });
                  history('/register');
                  break;
                default:
                  break;
              }
              if (yupErrors != null) {
                formik.setErrors(yupErrors);
              }
            })
            .finally(() => {
              setSubmitting(false);
            });
        } else {
          setSubmitting(false);
          if (!checkRef2.current.checked) {
            checkRef2.current.style.border = '1.5px solid rgba(220, 61, 67, 1)';
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

  const { errors, touched, setFieldValue, isSubmitting, setSubmitting, handleSubmit } = formik;

  return (
    <>
      <div className={styles.registerWrapper}>
        <div className={styles.headerContainer}>
          <span className={styles.aviatorLogo}>TSUlink</span>
        </div>
        <div className={styles.switch}>
          <Switch
            names={[t('signIn'), t('create.account')]}
            links={['/login', '/register']}
            actives={[false, true]}
          ></Switch>
        </div>
        <FormikProvider validateOnBlur value={formik}>
          <div className={styles.form}>
            <Form onSubmit={handleSubmit}>
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
                onBlur={formik.handleBlur}
                id={'username'}
                error={errors.username}
                touched={touched.username}
                floatingLabel={t('username')}
                autoComplete={'off'}
              />
              <div className={styles.inputContainer}>
                <Input
                  type={'password'}
                  name={'password'}
                  ref={passwordRef}
                  value={formik.values.password}
                  onChange={(e) => {
                    e.preventDefault();
                    const { value } = e.target;
                    var regex = /^\S*$/;
                    if (regex.test(value.toString()) || value === '') {
                      setFieldValue('password', value);
                    }
                  }}
                  onBlur={formik.handleBlur}
                  id={'password'}
                  error={errors.password}
                  touched={touched.password}
                  floatingLabel={t('password')}
                  autoComplete={'off'}
                />
                <span
                  onClick={() => {
                    showPassword(setHidePssword, hidePssword, passwordRef);
                  }}
                  className={styles.eyeIcon}
                >
                  {hidePssword ? (
                    <EyeOffIcon color={'var(--color-grey-500)'} />
                  ) : (
                    <EyeIcon color={'var(--color-grey-500)'} />
                  )}
                </span>
              </div>
              <div className={styles.validationContainer}>
                <div className={styles.validation}>
                  <span className={styles.validationIcon}>{isMinValid ? <ValidIcon /> : <NotValidIcon />}</span>
                  <p className={styles.validationText}>{t('password.min.8.char')} </p>
                </div>
                <div className={styles.validation}>
                  <span className={styles.validationIcon}>{isUppercaseValid ? <ValidIcon /> : <NotValidIcon />}</span>
                  <p className={styles.validationText}>{t('password.eng.char')}</p>
                </div>
                <div className={styles.validation}>
                  <span className={styles.validationIcon}>{isNumValid ? <ValidIcon /> : <NotValidIcon />}</span>
                  <p className={styles.validationText}>{t('password.must.num')}</p>
                </div>
                <div className={styles.validation}>
                  <span className={styles.validationIcon}>{isSpecValid ? <ValidIcon /> : <NotValidIcon />}</span>
                  <p className={styles.validationText}>{t('password.must.special.symbol')}</p>
                </div>
              </div>

              <div className={styles.inputContainer}>
                <Input
                  type={'password'}
                  name={'passwordRepeat'}
                  ref={passwordRepeatRef}
                  value={formik.values.passwordRepeat}
                  onChange={(e) => {
                    e.preventDefault();
                    const { value } = e.target;
                    var regex = /^\S*$/;
                    if (regex.test(value.toString()) || value === '') {
                      setFieldValue('passwordRepeat', value);
                    }
                  }}
                  onBlur={formik.handleBlur}
                  id={'passwordRepeat'}
                  error={errors.passwordRepeat}
                  touched={touched.passwordRepeat}
                  floatingLabel={t('repeat.password')}
                  autoComplete={'off'}
                />
                <span
                  onClick={() => {
                    showPassword(setHidePsswordRepeat, hidePsswordRepeat, passwordRepeatRef);
                  }}
                  className={styles.eyeIcon}
                >
                  {hidePsswordRepeat ? (
                    <EyeOffIcon color={'var(--color-grey-500)'} />
                  ) : (
                    <EyeIcon color={'var(--color-grey-500)'} />
                  )}
                </span>
              </div>
              <div className={styles.footer}>
                <button type="submit" className={styles.submitButton + (isSubmitting ? ' ' + styles.disabled : '')}>
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
                    t('continue')
                  )}
                </button>
              </div>
            </Form>
          </div>
        </FormikProvider>
      </div>
    </>
  );
};

export default Register;
