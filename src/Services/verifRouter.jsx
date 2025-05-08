import { useContext, useEffect, useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { UserContext } from './userContext';

const VeriffRouter = () => {
  const [showVeriff, setShowVeriff] = useState(false);
  const [isWithdrawBlock, setIsWithdrawBlock] = useState(false);
  const { userData } = useContext(UserContext);

  useEffect(() => {
    // if (setShowVeriff) {
    if (userData) {
      setShowVeriff(!userData.verified);
    }

    if (userData && userData.withdrawalOnlyBlock === true) {
      setIsWithdrawBlock(true);
    }
    // }
  }, [userData]);

  return !showVeriff ? (
    isWithdrawBlock ? (
      <Navigate to="/withdrawal" replace />
    ) : (
      <Outlet />
    )
  ) : (
    <Navigate to="/" replace />
  );
};

export default VeriffRouter;
