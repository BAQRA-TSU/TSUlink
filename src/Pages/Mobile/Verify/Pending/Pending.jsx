import { useContext, useEffect } from 'react';
import styles from './Pending.module.css';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../../../Services/userContext';
import { VerifPendingIconBig } from '../../../../assets/svg/svg';
import { useTranslation } from 'react-i18next';

const Pending = () => {
  const history = useNavigate();
  const [t] = useTranslation();
  const { userData } = useContext(UserContext);

  useEffect(() => {
    if (userData && userData.verified) {
      history('/');
    }
  }, [userData]);

  return (
    <div className={styles.veriffContainer}>
      <span className={styles.pendingIcon}>
        <VerifPendingIconBig />
      </span>
      <h1 className={styles.veriffHeader}>{t('veriff.is.pending.header')}</h1>
      <p className={styles.veriffDescription}>{t('veriff.is.pending.description')}</p>
    </div>
  );
};

export default Pending;
