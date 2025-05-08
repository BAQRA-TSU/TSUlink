import { useContext, useEffect } from 'react';
import ActivityComponent from '../../../Components/Mobile/Activity/Activity';
import styles from './Activity.module.css';
import { UserContext } from '../../../Services/userContext';
import { isLogedIn } from '../../../Services/common';
import { useNavigate } from 'react-router-dom';

const ActivityPage = () => {
  const { userData } = useContext(UserContext);
  const history = useNavigate();

  useEffect(() => {
    if (userData) {
      if (isLogedIn() && !userData.verified) {
        history('/verify');
      }
    }
  }, [userData]);
  return (
    <div className={styles.activityContainer}>
      <ActivityComponent />
    </div>
  );
};

export default ActivityPage;
