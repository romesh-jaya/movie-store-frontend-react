import React, { useState, useEffect, ReactElement } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useAuth0 } from '@auth0/auth0-react';

import globStyles from '../../index.module.scss';
import { TextConstants } from '../../constants/TextConstants';
import axios from '../../axios';
import { isAdmin } from '../../utils/AuthUtil';
import MyLibrary from '../../components/MyLibrary/MyLibrary';
import { initSettings, settings, getSettingValue } from '../../state/settings';
import LoadingSkeleton from '../../components/LoadingSkeleton/LoadingSkeleton';

interface IProps {
  tabIndex: number;
  setTabIndex: (newTabIndex: number) => void;
}

const MovieSearch = React.lazy(
  () => import('../../components/Movies/MovieSearch/MovieSearch')
);
const MovieAnalysis = React.lazy(
  () => import('../../components/MovieAnalysis/MovieAnalysis')
);
const Settings = React.lazy(() => import('../../components/Settings/Settings'));
const Cart = React.lazy(() => import('../../components/Cart/Cart'));

const ContainerBody: React.FC<IProps> = (props: IProps) => {
  const { tabIndex, setTabIndex } = props;
  const [isLoading, setIsLoading] = useState(true);
  const [settingsError, setSettingsError] = useState('');
  const settingsArray = settings.use();
  const apiKeySetting = getSettingValue('apiKey');
  const { user } = useAuth0();

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
    // reset tab index everytime this page is loaded for the first time
    setTabIndex(0);
  }, []);

  useEffect(() => {
    async function loadSettings(): Promise<void> {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_NODE_SERVER}/settings`
        );

        const settings = response.data;
        initSettings(settings);
      } catch {
        setSettingsError(TextConstants.CANNOTCONNECTSERVER);
      } finally {
        setIsLoading(false);
      }
    }

    if (settingsArray.length === 0) {
      loadSettings();
      return;
    }
    setIsLoading(false);
  }, []);

  const renderNoApiKey = (): ReactElement => {
    return <p>{TextConstants.NOAPIKEYDEFINED}</p>;
  };

  const renderContent = (): ReactElement | null => {
    if (isLoading || settingsError) {
      return null;
    }

    return (
      <>
        <TabPanel value={tabIndex} index={0}>
          {apiKeySetting ? <MyLibrary /> : renderNoApiKey()}
        </TabPanel>
        {isAdmin(user) && (
          <>
            <TabPanel value={tabIndex} index={1}>
              {apiKeySetting ? <MovieSearch /> : renderNoApiKey()}
            </TabPanel>
            <TabPanel value={tabIndex} index={2}>
              {<MovieAnalysis />}
            </TabPanel>
            <TabPanel value={tabIndex} index={3}>
              {<Settings />}
            </TabPanel>
          </>
        )}
        {!isAdmin(user) && (
          <TabPanel value={tabIndex} index={4}>
            <Cart />
          </TabPanel>
        )}
      </>
    );
  };

  return (
    <>
      {isLoading && <LoadingSkeleton />}
      {renderContent()}
      {!isLoading && settingsError && (
        <p className={globStyles['error-text']}>{settingsError}</p>
      )}
    </>
  );
};

export default ContainerBody;
