import React, { Suspense, useState } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Route, Routes } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { SnackbarProvider } from 'notistack';

import styles from './app.module.scss';
import axios from './axios';
import ContainerBody from './containers/ContainerBody/ContainerBody';
import { MAIN_COLOUR, SEC_COLOUR_TEXT, SEC_COLOUR } from './constants/Colours';
import ContainerHeader from './containers/ContainerHeader/ContainerHeader';
import Login from './components/Pages/Login';
import ErrorPage from './components/Pages/Error';
import PrivateRoute from './components/PrivateRoute';
import Spinner from './components/UI/Spinner/Spinner';

const SERVER_PATH = import.meta.env.VITE_NODE_SERVER || '';

const theme = createTheme({
  palette: {
    primary: {
      main: MAIN_COLOUR,
      // Note: light, dark and contrastText will be calculated from palette.primary.main,
    },
    secondary: {
      main: SEC_COLOUR,
      contrastText: SEC_COLOUR_TEXT,
    },
  },
});

const App: React.FC = () => {
  const { getAccessTokenSilently, isLoading } = useAuth0();
  const [tabIndex, setTabIndex] = useState(0);

  axios.interceptors.request.use(async (req) => {
    if (req.url?.toUpperCase().includes(SERVER_PATH.toUpperCase())) {
      // token is auto cached by Auth0, so that multiple requests are not sent each time we need a token
      const token = await getAccessTokenSilently();
      req.headers.authorization = `Bearer ${token}`;
    }
    return req;
  });

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className={styles['spinner-full-page']}>
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
            <Route path="/" element={<ContainerBody tabIndex={tabIndex} />} />
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
        <div className={styles.container}>
          <ContainerHeader tabIndex={tabIndex} setTabIndex={setTabIndex} />
          {renderContent()}
        </div>
      </SnackbarProvider>
    </ThemeProvider>
  );
};

export default App;
