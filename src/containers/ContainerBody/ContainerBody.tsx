import React, {
  useState,
  useEffect,
  ReactElement,
  FunctionComponent,
} from 'react';
import { useAuth0 } from '@auth0/auth0-react';

import globStyles from '../../index.module.scss';
import { TextConstants } from '../../constants/TextConstants';
import axios from '../../axios';
import { initSettings, settings, getSettingValue } from '../../state/settings';
import LoadingSkeleton from '../../components/LoadingSkeleton/LoadingSkeleton';

const ContainerBody: FunctionComponent = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [settingsError, setSettingsError] = useState('');
  const settingsArray = settings.use();
  const apiKeySetting = getSettingValue('apiKey');
  const { error: authError } = useAuth0();

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

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (!apiKeySetting) {
    return <p>{TextConstants.NOAPIKEYDEFINED}</p>;
  }

  if (authError) {
    return <p className={globStyles['error-text']}>Error in Authentication</p>;
  }

  if (settingsError) {
    return <p className={globStyles['error-text']}>{settingsError}</p>;
  }

  return children as ReactElement;
};

export default ContainerBody;
