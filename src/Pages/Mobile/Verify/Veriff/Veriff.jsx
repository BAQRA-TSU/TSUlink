import { useContext, useEffect, useState } from 'react';
import styles from './Veriff.module.css';
import { createVeriffFrame, MESSAGES } from '@veriff/incontext-sdk';
import { PostVeirff } from '../../../../Services/service';
import { GetAccessToken, getVeirffSesion, isLogedIn, RefreshToken } from '../../../../Services/common';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../../../Services/userContext';
import { WebCamIcon, ChatIcon, PhotoIcon } from '../../../../assets/svg/svg';
import { useTranslation } from 'react-i18next';
import { useNotificationPopup } from '../../../../Services/notificationPopupProvider';

const Veriff = () => {
  const history = useNavigate();
  const [t] = useTranslation();
  // const [veriffFrame, setVeriffFrame] = useState()
  const [isSelected, setIsSelected] = useState('LIVE');
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const { setChangeUser } = useContext(UserContext);
  const { userData } = useContext(UserContext);
  const { logout } = useContext(UserContext);
  const { showSnackNotificationPopup } = useNotificationPopup();

  useEffect(() => {
    if (userData) {
      if (isLogedIn() && userData.verified) {
        history('/');
      }
    }
  }, [userData]);

  useEffect(() => {
    getVeirffSesion(false)
      .then((resp) => {
        if (resp === false) {
          showSnackNotificationPopup({ status: 'FAILED', text: 'Get verification failed' });
          return;
        }
        if (resp.data.status === 'resubmission_requested') {
          history('/verify/rejected', {
            state: { sessionId: resp.data.sessionId, veriffData: resp.data.veriffData.verification },
          });
        }
        if (resp.data.status === 'pending') {
          history('/verify/pending');
        }
      })
      .catch((error) => {
        if (error.message === 'UNAUTHORIZED') {
          logout();
        } else if (error.message === 'NO_SESSION') {
          return;
        } else {
          showSnackNotificationPopup({ status: 'FAILED', text: t(error.message) });
        }
      });
  }, []);

  function getVerrifUrl(tries = 0) {
    if (isLogedIn()) {
      const accessToken = GetAccessToken();
      if (accessToken) {
        setIsButtonLoading(true);
        PostVeirff(accessToken)
          .then((response) => {
            // setVeriffFrame(
            createVeriffFrame({
              url: response.data.verificationUrl,
              onEvent: function (msg) {
                switch (msg) {
                  case MESSAGES.STARTED:
                    console.log('VERIFF started');
                    break;
                  case MESSAGES.CANCELED:
                    console.log('VERIFF canceled');
                    break;
                  case MESSAGES.FINISHED:
                    console.log('VERIFF finished');
                    setTimeout(() => {
                      setChangeUser(true);
                    }, 1000);
                    break;
                  case MESSAGES.RELOAD_REQUEST:
                    console.log('VERIFF reload');
                    window.location.reload();
                    break;
                  default:
                    console.log('VERIFF default');
                    break;
                }
              },
              onReload: () => {
                window.location.reload();
              },
            });
            // )
          })
          .catch(() => {
            RefreshToken().then((resp) => {
              if (!resp) {
                logout();
              } else {
                if (tries < 4) {
                  getVerrifUrl(tries + 1);
                } else {
                  logout();
                }
              }
            });
          })
          .finally(() => {
            setIsButtonLoading(false);
          });
      } else {
        logout();
      }
    } else {
      logout();
    }
  }

  function getSessionId(tries = 0) {
    if (isLogedIn()) {
      const accessToken = GetAccessToken();
      if (accessToken) {
        setIsButtonLoading(true);
        PostVeirff(accessToken)
          .then((response) => {
            history('/verify/upload', { state: { sessionId: response.data.sessionId, isContinue: false } });
          })
          .catch(() => {
            RefreshToken().then((resp) => {
              if (!resp) {
                logout();
              } else {
                if (tries < 4) {
                  getSessionId(tries + 1);
                } else {
                  logout();
                }
              }
            });
          })
          .finally(() => {
            setIsButtonLoading(false);
          });
      } else {
        logout();
      }
    } else {
      logout();
    }
  }

  function submit() {
    switch (isSelected) {
      case 'LIVE':
        getVerrifUrl();
        break;
      case 'CHAT':
        window._dixa_.invoke('setWidgetOpen', true);
        break;
      case 'UPLOAD':
        getSessionId();
        break;
      default:
        break;
    }
  }

  return (
    <div className={styles.veriffContainer}>
      <h1 className={styles.veriffHeader}>{t('verify.header')}</h1>
      <div className={styles.cardsContainer}>
        <div
          onClick={() => {
            setIsSelected('LIVE');
          }}
          className={styles.card + ' ' + (isSelected === 'LIVE' ? styles.selected : '')}
        >
          <div className={styles.header}>
            <div className={styles.headerLeft}>
              <WebCamIcon />
              {t('veriff.live')}
            </div>
            <div className={styles.select + ' ' + (isSelected === 'LIVE' ? styles.selected : '')}></div>
          </div>
          <ul className={styles.body}>
            <li className={styles.bulletPoints}>{t('veriff.select.document')}</li>
            <li className={styles.bulletPoints}>{t('veriff.upload.image')}</li>
            <li className={styles.bulletPoints}>{t('veriff.take.selfie')}</li>
          </ul>
        </div>
        <div
          onClick={() => {
            setIsSelected('UPLOAD');
          }}
          className={styles.card + ' ' + (isSelected === 'UPLOAD' ? styles.selected : '')}
        >
          <div className={styles.header}>
            <div className={styles.headerLeft}>
              <PhotoIcon />
              {t('veriff.upload')}
            </div>
            <div className={styles.select + ' ' + (isSelected === 'UPLOAD' ? styles.selected : '')}></div>
          </div>
          <ul className={styles.body}>
            <li className={styles.bulletPoints}>{t('veriff.upload.image')}</li>
            <li className={styles.bulletPoints}>{t('veriff.upload.selfie.document')}</li>
          </ul>
        </div>
        <div
          onClick={() => {
            setIsSelected('CHAT');
          }}
          className={styles.card + ' ' + (isSelected === 'CHAT' ? styles.selected : '')}
        >
          <div className={styles.header}>
            <div className={styles.headerLeft}>
              <ChatIcon />
              {t('veriff.chat')}
            </div>
            <div className={styles.select + ' ' + (isSelected === 'CHAT' ? styles.selected : '')}></div>
          </div>
          <ul className={styles.body}>
            <li className={styles.bulletPoints}>{t('veriff.upload.image')}</li>
            <li className={styles.bulletPoints}>{t('veriff.upload.selfie.document')}</li>
          </ul>
        </div>
      </div>
      <button
        onClick={submit}
        className={styles.submitButton + ' ' + (isButtonLoading ? styles.disabled : '')}
        type="submit"
      >
        {isButtonLoading ? (
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
  );
};

export default Veriff;
