import React, { Suspense, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { SnackbarProvider } from 'notistack';
import Container from 'react-bootstrap/Container';

import globStyles from './index.module.scss';
import axios from './axios';
import ContainerHeader from './containers/ContainerHeader/ContainerHeader';
import Spinner from './components/UI/Spinner/Spinner';
import { manageUserSession } from './utils/UserSession';

const Login = React.lazy(() => import('./components/Login/Login'));
const TransactionResult = React.lazy(
  () => import('./components/TransactionResult/TransactionResult')
);
const MovieSearch = React.lazy(
  () => import('./components/Movies/MovieSearch/MovieSearch')
);
const MovieAnalysis = React.lazy(
  () => import('./components/MovieAnalysis/MovieAnalysis')
);
const Settings = React.lazy(() => import('./components/Settings/Settings'));
const Cart = React.lazy(() => import('./components/Cart/Cart'));
const MyLibrary = React.lazy(() => import('./components/MyLibrary/MyLibrary'));
const PrivateRoute = React.lazy(() => import('./components/PrivateRoute'));
const AdminRoute = React.lazy(() => import('./components/AdminRoute'));
const ErrorPage = React.lazy(() => import('./components/Error/Error'));
const Checkout = React.lazy(() => import('./components/Checkout/Checkout'));
const MySubscriptions = React.lazy(
  () => import('./components/MySubscriptions/MySubscriptions')
);

const SERVER_PATH = import.meta.env.VITE_NODE_SERVER || '';

const App: React.FC = () => {
  const { getAccessTokenSilently, isLoading: isLoadingAuth } = useAuth0();

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
    if (isLoadingAuth) {
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
            <Route path="/" element={<MyLibrary />} />
            <Route path="/my-cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/my-subscriptions" element={<MySubscriptions />} />
            <Route path="/transaction-result" element={<TransactionResult />} />
            <Route path="/" element={<AdminRoute />}>
              <Route path="/movie-search-omdb" element={<MovieSearch />} />
              <Route
                path="/movie-search-analysis"
                element={<MovieAnalysis />}
              />
              <Route path="/settings" element={<Settings />} />
            </Route>
          </Route>
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </Suspense>
    );
  };

  return (
    <SnackbarProvider
      maxSnack={1}
      autoHideDuration={4000}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      classes={{ root: globStyles['snackbar-item-root'] }}
    >
      <Container fluid className="d-flex flex-column min-vh-100 px-0">
        <ContainerHeader />
        {renderContent()}
      </Container>
    </SnackbarProvider>
  );
};

export default App;
