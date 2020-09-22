import React from 'react';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import MovieContainer from './containers/MovieContainer/MovieContainer';

const theme = createMuiTheme({
    palette: {
        primary: {
            // light: will be calculated from palette.primary.main,
            main: '#557a95',
            // dark: will be calculated from palette.primary.main,
            // contrastText: will be calculated to contrast with palette.primary.main
        },
        secondary: {
            main: '#e8d2c0',
            contrastText: '#473f3a'
        }

    }
});

const App: React.FC = () => (
    <ThemeProvider theme={theme}>
        <MovieContainer />
    </ThemeProvider>
);

export default App;
