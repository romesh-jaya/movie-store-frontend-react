import React, { useState, useEffect, Suspense, ReactElement } from 'react';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { useAuth0 } from '@auth0/auth0-react';

import globStyles from '../../index.module.css';
import { TextConstants } from '../../constants/TextConstants';
import SettingsContext from '../../context/SettingsContext';
import MovieContainerSkeleton from '../MovieContainerSkeleton';
import axios from '../../axios';
import INameValue from '../../interfaces/INameValue';
import { isAdmin } from '../../utils/AuthUtil';
import MyLibrary from '../../components/MyLibrary/MyLibrary';
import NavBar from '../../components/NavBar/NavBar';

const MovieSearch = React.lazy(
  () => import('../../components/Movies/MovieSearch/MovieSearch')
);
const MovieAnalysis = React.lazy(
  () => import('../../components/MovieAnalysis/MovieAnalysis')
);
const Settings = React.lazy(() => import('../../components/Settings/Settings'));

const ContainerBody: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState<INameValue[]>([]);
  const [settingsError, setSettingsError] = useState('');
  const [tabIndex, setTabIndex] = useState(0);
  const apiKeySetting = settings.find((setting) => setting.name === 'apiKey');
  const { user } = useAuth0();

  const updateContext = (context: INameValue[]): void => {
    setSettings(context);
  };

  const handleTabChange = (
    _: React.ChangeEvent<{}>,
    newTabIndex: number
  ): void => {
    setTabIndex(newTabIndex);
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

  useEffect(() => {
    async function loadSettings(): Promise<void> {
      try {
        const responseApiKey = await axios.get(
          `${import.meta.env.VITE_NODE_SERVER}/settings/apiKey`
        );
        if (responseApiKey.data.value) {
          console.log('Retrieved API key.');
        } else {
          console.warn('API key was returned blank.');
        }

        const responseLang = await axios.get(
          `${import.meta.env.VITE_NODE_SERVER}/settings/languages`
        );

        const settings: INameValue[] = [
          {
            name: 'apiKey',
            value: responseApiKey.data.value,
          },
          {
            name: 'languages',
            value: responseLang.data.value,
          },
        ];
        setSettings(settings);
      } catch {
        setSettingsError(TextConstants.CANNOTCONNECTSERVER);
      } finally {
        setIsLoading(false);
      }
    }

    loadSettings();
  }, []);

  const renderNoApiKey = (): ReactElement => {
    return <p>{TextConstants.NOAPIKEYDEFINED}</p>;
  };

  const renderWithSuspense = (children: ReactElement): ReactElement => {
    return <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>;
  };

  const renderContent = (): ReactElement | null => {
    return !isLoading && !settingsError ? (
      <>
        <NavBar tabIndex={tabIndex} handleTabChange={handleTabChange} />
        <TabPanel value={tabIndex} index={0}>
          {apiKeySetting && apiKeySetting.value ? (
            <MyLibrary />
          ) : (
            renderNoApiKey()
          )}
        </TabPanel>
        {user && user?.email && isAdmin(user.email) && (
          <>
            <TabPanel value={tabIndex} index={1}>
              {apiKeySetting && apiKeySetting.value
                ? renderWithSuspense(<MovieSearch />)
                : renderNoApiKey()}
            </TabPanel>
            <TabPanel value={tabIndex} index={2}>
              {renderWithSuspense(<MovieAnalysis />)}
            </TabPanel>
            <TabPanel value={tabIndex} index={3}>
              {renderWithSuspense(<Settings updateContext={updateContext} />)}
            </TabPanel>
          </>
        )}
      </>
    ) : null;
  };

  return (
    <SettingsContext.Provider value={settings}>
      {isLoading && <MovieContainerSkeleton />}
      {renderContent()}
      {!isLoading && settingsError && (
        <p className={globStyles['error-text']}>{settingsError}</p>
      )}
    </SettingsContext.Provider>
  );
};

export default ContainerBody;
