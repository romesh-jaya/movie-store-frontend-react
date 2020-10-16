import React from 'react';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { Route, Switch, withRouter } from 'react-router-dom';


import ContainerBody from './containers/ContainerBody/ContainerBody';
import { MAIN_COLOUR, SEC_COLOUR_TEXT, SEC_COLOUR } from './constants/Colours';
import ContainerHeader from './containers/ContainerHeader/ContainerHeader';
import Login from './components/Pages/Login';
import ErrorPage from './components/Pages/Error';

const theme = createMuiTheme({
  palette: {
    primary: {
      // light: will be calculated from palette.primary.main,
      main: MAIN_COLOUR,
      // dark: will be calculated from palette.primary.main,
      // contrastText: will be calculated to contrast with palette.primary.main
    },
    secondary: {
      main: SEC_COLOUR,
      contrastText: SEC_COLOUR_TEXT
    }
  }
});

const App: React.FC = () => (
  <ThemeProvider theme={theme}>
    <ContainerHeader />
    <Switch>
      <Route exact path="/login" component={Login} />
      <Route exact path="/" component={ContainerBody} />
      <Route component={ErrorPage} />
    </Switch>
  </ThemeProvider>
);

export default withRouter(App);
