import React, {useState, useCallback, useEffect, Suspense} from 'react';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';


import KeyContext from '../../context/KeyContext';
import logo from '../../assets/img/movie.png';
import * as styles from './MovieContainer.css';
import * as globStyles from '../../index.css';
import MovieSearch from '../../components/Movies/MovieSearch/MovieSearch';
import MovieContainerSkeleton from './MovieContainerSkeleton';
import axios from '../../axios';

const Settings = React.lazy(() => import('../../components/Settings/Settings'));
const ZERO = 0;

interface IState {
  isLoading: boolean;
  settingsError: string;
  apiKey: string;
  value: number
};
 
const MovieContainer: React.FC = () => {
  const [state, setState] = useState<IState>({
    isLoading: true,
    settingsError: '',
    apiKey: '',
    value: ZERO,
  });

  const mergeState = useCallback((name: string, value: any) : void => {
    setState(oldState => ({
      ...oldState,
      [name]: value
    }));
  }, []);

  const setAPIKey = (apiKey: string) : void => {
    mergeState('apiKey', apiKey);
  };

  const handleChange = (_ : React.ChangeEvent<{}>, newValue : number) : void => {
    mergeState('value', newValue);
  };

  const TabPanel = (tPanelProps : any) : React.ReactElement => {
    const { children, value: tPanelValue, index} = tPanelProps;
  
    return (
      <Typography
        component="div"
        role="tabpanel"
        hidden={tPanelValue !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
      >
        {tPanelValue === index && <Box p={3}>{children}</Box>}
      </Typography>
    );
  };

  // load the settings
  useEffect(() => {
    mergeState('isLoading', TextTrackCueList);
    axios.get(`${process.env.REACT_APP_NODE_SERVER  }/settings/apiKey`)
      .then(response => {
        if (response) {
          mergeState('isLoading', false);
          if (response.data.value)
          {
            console.log('Retrieved API key.');
            mergeState('apiKey', response.data.value);
          }
          else
          {
            mergeState('settingsError', 'API key was returned blank.');
          }
        }
      })
      .catch((err : any) => {
        console.log(err);
        mergeState('isLoading', false);
        mergeState('settingsError', 'Cannot connect to Node Server.');
      });
  }, [mergeState]);
  
  const content = (
    <>
      <div className={styles.header}>
        <span className={`${styles.nowrapDiv  } ${  styles.div1}`}>
          <img src={logo} height="50px" alt="movies" />
        </span>
        <h1 className={`${styles.nowrapDiv  } ${  styles.headerText}`}>
            Ultra Movie Shop
        </h1>
      </div>
      <AppBar position="static">
        <Tabs value={state.value} onChange={handleChange}>
          <Tab label="Movie Search - OMDB" id="simple-tab-0" />
          <Tab label="Settings" id="simple-tab-1" />
        </Tabs>
      </AppBar>
      <TabPanel value={state.value} index={0}>
        <MovieSearch />
      </TabPanel>
      <TabPanel value={state.value} index={1}>
        <Suspense fallback={<div>Loading...</div>}>
          <Settings setAPIKey={setAPIKey} /> 
        </Suspense>
      </TabPanel>
    </>
  );


  return (
    <KeyContext.Provider value={state.apiKey}>
      {state.isLoading && <MovieContainerSkeleton /> }
      {!state.isLoading && !state.settingsError ? content : null }
      {!state.isLoading && state.settingsError ?  <p className={globStyles['error-text']}>{state.settingsError}</p> : null }
    </KeyContext.Provider>
  );
};
 
export default MovieContainer;