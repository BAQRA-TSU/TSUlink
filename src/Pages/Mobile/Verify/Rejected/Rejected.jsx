import { useContext, useEffect, useState } from 'react';
import styles from './Rejected.module.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { UserContext } from '../../../../Services/userContext';
import { UnverifiedIconBig } from '../../../../assets/svg/svg';
import { useTranslation } from 'react-i18next';
import { getVeirffSesion } from '../../../../Services/common';
import { useNotificationPopup } from '../../../../Services/notificationPopupProvider';

const Rejected = () => {
  const history = useNavigate();
  const [t] = useTranslation();
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const { userData } = useContext(UserContext);
  const location = useLocation();
  const { sessionId, veriffData } = location.state;
  const { logout } = useContext(UserContext);
  const { showSnackNotificationPopup } = useNotificationPopup();

  useEffect(() => {
    if (userData && userData.verified) {
      history('/');
    }
  }, [userData]);

  function getSessionId() {
    if (veriffData === undefined) {
      setIsButtonLoading(true);
      getVeirffSesion(false)
        .then((resp) => {
          if (resp === false) {
            showSnackNotificationPopup({ status: 'FAILED', text: 'Get verification failed' });
            return;
          }
          if (resp.data.status === 'resubmission_requested') {
            history('/verify/upload', {
              state: { sessionId: resp.data.sessionId, veriffData: resp.data.veriffData.verification },
            });
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
        })
        .finally(() => {
          setIsButtonLoading(false);
        });
    } else {
      history('/verify/upload', { state: { sessionId: sessionId, isContinue: true, veriffData: veriffData } });
    }
  }

  function newSesion() {
    getVeirffSesion(true)
      .then((resp) => {
        if (resp === false) {
          showSnackNotificationPopup({ status: 'FAILED', text: 'Session clear failed' });
          return;
        }
        history('/verify');
      })
      .catch((error) => {
        if (error.message === 'UNAUTHORIZED') {
          logout();
        } else if (error.message === 'NO_SESSION') {
          history('/verify');
        } else {
          showSnackNotificationPopup({ status: 'FAILED', text: t(error.message) });
        }
      });
  }

  return (
    <div className={styles.veriffContainer}>
      <span className={styles.pendingIcon}>
        <UnverifiedIconBig />
      </span>
      <h1 className={styles.veriffHeader}>{t('veriff.rejected.header')}</h1>
      <p className={styles.veriffDescription}>{t('veriff.rejected.description')}</p>
      <button className={styles.button + ' ' + (isButtonLoading ? styles.disabled : '')} onClick={getSessionId}>
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
      <button className={styles.button + ' ' + styles.restart} onClick={newSesion}>
        {t('start.again')}
      </button>
    </div>
  );
};

export default Rejected;
