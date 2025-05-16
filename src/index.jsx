// import 'bootstrap/dist/css/bootstrap.css';
// import { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App';
import ErrorBoundary from './Services/ErrorBoundary';
import { UserProvider } from './Services/userContext';
import './Services/i18n';
import i18next from 'i18next';
import { NotificationPopupProvider } from './Services/notificationPopupProvider';
import NotificationPopup from './Components/NotificationPopup/NotificationPopup';
import NotificationSnack from './Components/NotificationSnack/NotificationSnack';
import Loader from './Components/loader/Loader';
import { Suspense } from 'react';

const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href');
const root = ReactDOM.createRoot(document.getElementById('root'));
i18next.changeLanguage();

root.render(
  // <StrictMode>
  <ErrorBoundary future={{ v7_startTransition: true }}>
    <BrowserRouter basename={baseUrl}>
      <NotificationPopupProvider>
        <UserProvider>
          <Suspense fallback={<Loader/>}>
          <App />
          <NotificationPopup />
          <NotificationSnack />
          </Suspense>
        </UserProvider>
      </NotificationPopupProvider>
    </BrowserRouter>
  </ErrorBoundary>
  //  </StrictMode>
);
