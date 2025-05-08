import { isLogedIn } from "./common";
import { Outlet, Navigate } from 'react-router-dom';

const PrivateRoute = () => {
  return (
      isLogedIn() ?  <Outlet/>  : <Navigate to="/login" replace />
  );
};

export default PrivateRoute;
