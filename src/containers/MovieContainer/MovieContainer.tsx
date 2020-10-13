import React, { useState, useEffect, Suspense, ReactNode } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import { TextConstants } from '../../constants/TextConstants';
import SettingsContext from '../../context/SettingsContext';
import logo from '../../assets/img/movie.png';
import * as styles from './MovieContainer.css';
import * as globStyles from '../../index.css';
import MovieSearch from '../../components/Movies/MovieSearch/MovieSearch';
import MovieContainerSkeleton from './MovieContainerSkeleton';
import axios from '../../axios';
import MyLibrary from '../../components/MyLibrary/MyLibrary';
import INameValue from '../../interfaces/INameValue';

const Settings = React.lazy(() => import('../../components/Settings/Settings'));

const MovieContainer: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState<INameValue[]>([]);
  const [settingsError, setSettingsError] = useState('');
  const [tabIndex, setTabIndex] = useState(0);
  const apiKeySetting = settings.find(setting => setting.name === 'apiKey');

  const updateContext = (context: INameValue[]): void => {
    setSettings(context);
  };

  const handleChange = (_: React.ChangeEvent<{}>, newValue: number): void => {
    setTabIndex(newValue);
  };

  const TabPanel = (tPanelProps: any): React.ReactElement => {
    const { children, value: tPanelValue, index } = tPanelProps;

    return (
      <Typography
        component="div"
        role="tabpanel"
        hidden={tPanelValue !== index}
        id={`simple-tabpanel-${index}`}
      >
        {tPanelValue === index && <Box p={3}>{children}</Box>}
      </Typography>
    );
  };

  // load the settings
  useEffect(() => {
    async function loadKey() : Promise<void> {
      try {
        const responseApiKey = await axios.get(`${process.env.REACT_APP_NODE_SERVER}/settings/apiKey`);
        if (responseApiKey.data.value) {
          console.log('Retrieved API key.');
        } else {
          console.log('API key was returned blank.');
        }
        
        const responseLang = await axios.get(`${process.env.REACT_APP_NODE_SERVER}/settings/languages`);
        setIsLoading(false);

        const settingsStore : INameValue[] = [
          {
            name: 'apiKey',
            value: responseApiKey.data.value
          },
          {
            name: 'languages',
            value: responseLang.data.value
          }
        ];    
        setSettings(settingsStore);
      } catch {
        setIsLoading(false);
        setSettingsError(TextConstants.CANNOTCONNECTSERVER);
      }
    }
    
    loadKey();
  }, []);

  const renderNoApiKey = (): ReactNode => {
    return <p>{TextConstants.NOAPIKEYDEFINED}</p>;
  };

  const renderContent = (): ReactNode | null => {
    return !isLoading && !settingsError ? (
      <>
        <div className={styles.header}>
          <span className={`${styles.nowrapDiv} ${styles.div1}`}>
            <img src={logo} height="50px" alt="movies" />
          </span>
          <h1 className={`${styles.nowrapDiv} ${styles.headerText}`}>
            Ultra Movie Shop
          </h1>
        </div>
        <AppBar position="static">
          <Tabs value={tabIndex} onChange={handleChange}>
            <Tab label="My Library" id="tab0" />
            <Tab label="Movie Search - OMDB" id="tab1" />
            <Tab label="Settings" id="tab2" />
          </Tabs>
        </AppBar>
        <TabPanel value={tabIndex} index={0}>
          {apiKeySetting && apiKeySetting.value? <MyLibrary /> : renderNoApiKey()}
        </TabPanel>
        <TabPanel value={tabIndex} index={1}>
          {apiKeySetting && apiKeySetting.value? <MovieSearch /> : renderNoApiKey()}
        </TabPanel>
        <TabPanel value={tabIndex} index={2}>
          <Suspense fallback={<div>Loading...</div>}>
            <Settings updateContext={updateContext} />
          </Suspense>
        </TabPanel>
      </>
    ) : null;
  };


  return (
    <SettingsContext.Provider value={settings}>
      {isLoading && <MovieContainerSkeleton />}
      {renderContent()}
      {!isLoading && settingsError ? <p className={globStyles['error-text']}>{settingsError}</p> : null}
    </SettingsContext.Provider>
  );
};

export default MovieContainer;