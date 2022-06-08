import React, { Suspense, useEffect, useState } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Route, Routes } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { SnackbarProvider } from 'notistack';

import globStyles from './index.module.scss';
import styles from './app.module.scss';
import axios from './axios';
import ContainerHeader from './containers/ContainerHeader/ContainerHeader';
import Spinner from './components/UI/Spinner/Spinner';
import { manageUserSession } from './utils/UserSession';
import { PREFERS_DARK_MODE_MEDIA_QUERY } from './constants/Constants';

const Login = React.lazy(() => import('./components/Login/Login'));
const TransactionResult = React.lazy(
  () => import('./components/TransactionResult/TransactionResult')
);
const ContainerBody = React.lazy(
  () => import('./containers/ContainerBody/ContainerBody')
);
const PrivateRoute = React.lazy(() => import('./components/PrivateRoute'));
const ErrorPage = React.lazy(() => import('./components/Error/Error'));
const Checkout = React.lazy(() => import('./components/Checkout/Checkout'));
const MySubscriptions = React.lazy(
  () => import('./components/MySubscriptions/MySubscriptions')
);

const SERVER_PATH = import.meta.env.VITE_NODE_SERVER || '';

// Note: these colors have no relation to dark mode. We need to manually change the colors for dark mode
// if necessary
const customPalette = {
  primary: {
    // Note: contrastText will be calculated from palette.primary.main,
    light: '#7794aa',
    main: '#557a95',
    dark: '#3b5568',
  },
  secondary: {
    light: '#ecdbcc',
    main: '#e8d2c0',
    dark: '#a29386',
    contrastText: '#473f3a',
  },
};

const App: React.FC = () => {
  const { getAccessTokenSilently, isLoading } = useAuth0();
  const [tabIndex, setTabIndex] = useState(0);
  const prefersDarkMode = useMediaQuery(PREFERS_DARK_MODE_MEDIA_QUERY);

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          ...customPalette,
          mode: prefersDarkMode ? 'dark' : 'light',
        },
      }),
    [prefersDarkMode]
  );

  axios.interceptors.request.use(async (req) => {
    if (req.url?.toUpperCase().includes(SERVER_PATH.toUpperCase())) {
      // token is auto cached by Auth0, so that multiple requests are not sent each time we need a token
      const token = await getAccessTokenSilently();
      req.headers.authorization = `Bearer ${token}`;
    }
    return req;
  });

  useEffect(() => {
    manageUserSession();
  }, []);

  const renderContent = () => {
    // Had to use the Spinner here instead of Loading Skeleton as the styles weren't applied at this point
    if (isLoading) {
      return (
        <div className={globStyles['spinner-full-page']}>
          <Spinner />
        </div>
      );
    }
    return (
      <Suspense fallback={<div />}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/login-admin" element={<Login />} />
          <Route path="/" element={<PrivateRoute />}>
            <Route
              path="/"
              element={
                <ContainerBody tabIndex={tabIndex} setTabIndex={setTabIndex} />
              }
            />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/my-subscriptions" element={<MySubscriptions />} />
            <Route path="/transaction-result" element={<TransactionResult />} />
          </Route>
          <Route element={<ErrorPage />} />
        </Routes>
      </Suspense>
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider
        maxSnack={1}
        autoHideDuration={4000}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Paper className={styles.container}>
          <ContainerHeader tabIndex={tabIndex} setTabIndex={setTabIndex} />
          {renderContent()}
        </Paper>
      </SnackbarProvider>
    </ThemeProvider>
  );
};

export default App;
