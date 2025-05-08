import { useEffect, useState } from 'react';
import './App.css';
import './Colors.css';
import MobileRoutes from './Pages/Mobile/Layout/Routes/Router';
import MobileHeader from './Pages/Mobile/Layout/Header/Header';
import MobileFooter from './Pages/Mobile/Layout/Footer/Footer';
import ScrollToTop from './Components/ScrollToTop/scrollToTop';
import { useLocation } from 'react-router-dom';
import { isMobile } from 'react-device-detect';

export const App = () => {
  const [showHeader, setShowHeader] = useState(true);
  const location = useLocation();

  useEffect(() => {
    if (
      location.pathname === '/login' ||
      location.pathname.includes('/register') ||
      location.pathname.includes('/menu') ||
      location.pathname.includes('/footer') ||
      location.pathname.includes('/password-reset') ||
      location.pathname === '/game' ||
      location.pathname === '/send-user'
    ) {
      setShowHeader(false);
    } else {
      setShowHeader(true);
    }
    
  }, [location]);

  return (
    <>
      <>
        <ScrollToTop />
        <div className="main-container">
          {showHeader && <MobileHeader />}
          <MobileRoutes />
          {showHeader && <MobileFooter />}
        </div>
      </>
    </>
  );
};
