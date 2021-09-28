import React from 'react';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import { Route, Switch, withRouter } from 'react-router-dom';

import { useAuth0 } from '@auth0/auth0-react';
import axios from './axios';
import ContainerBody from './containers/ContainerBody/ContainerBody';
import { MAIN_COLOUR, SEC_COLOUR_TEXT, SEC_COLOUR } from './constants/Colours';
import ContainerHeader from './containers/ContainerHeader/ContainerHeader';
import Login from './components/Pages/Login';
import ErrorPage from './components/Pages/Error';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';

const SERVER_PATH = process.env.REACT_APP_NODE_SERVER || '';

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
  const { getAccessTokenSilently } = useAuth0();

  axios.interceptors.request.use(async (req) => {
    if (req.url?.toUpperCase().includes(SERVER_PATH.toUpperCase())) {
      // token is auto cached by Auth0, so that multiple requests are not sent each time we need a token
      const token = await getAccessTokenSilently();
      req.headers.authorization = `Bearer ${token}`;
    }
    return req;
  });

  return (
    <ThemeProvider theme={theme}>
      <ContainerHeader />
      <Switch>
        <Route exact path="/login" component={Login} />
        <Route exact path="/login-admin" component={Login} />
        <ProtectedRoute>
          <Route exact path="/" component={ContainerBody} />
        </ProtectedRoute>
        <Route component={ErrorPage} />
      </Switch>
    </ThemeProvider>
  );
};

export default withRouter(App);
