import React from 'react';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import MovieContainer from './containers/MovieContainer/MovieContainer';
import { MAIN_COLOUR, SEC_COLOUR_TEXT, SEC_COLOUR } from './constants/Colours';

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
    <MovieContainer />
  </ThemeProvider>
);

export default App;
