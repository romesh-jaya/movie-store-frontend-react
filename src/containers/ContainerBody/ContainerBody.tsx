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
import { initSettings, getSettingValue } from '../../state/settings';
import LoadingSkeleton from '../../components/LoadingSkeleton/LoadingSkeleton';
import { getPrices } from '../../api/server/server';
import { initPrices } from '../../state/price';

const ContainerBody: FunctionComponent = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const apiKeySetting = getSettingValue('apiKey');
  const { error: authError } = useAuth0();

  async function loadSettings(): Promise<void> {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_NODE_SERVER}/settings`
      );

      const settings = response.data;
      initSettings(settings);
    } catch {
      setError(TextConstants.CANNOTCONNECTSERVER);
    }
  }

  const fetchPrices = async () => {
    try {
      const priceInfo = await getPrices();
      initPrices(priceInfo);
    } catch (error) {
      setError(`Error while fetching prices: ${error}`);
    }
  };

  useEffect(() => {
    async function loadData(): Promise<void> {
      const promiseArray = [loadSettings(), fetchPrices()];
      await Promise.all(promiseArray);
      setIsLoading(false);
    }
    loadData();
  }, []);

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (!apiKeySetting) {
    return (
      <p className={globStyles['error-text']}>
        {TextConstants.NOAPIKEYDEFINED}
      </p>
    );
  }

  if (authError) {
    return <p className={globStyles['error-text']}>Error in Authentication</p>;
  }

  if (error) {
    return <p className={globStyles['error-text']}>{error}</p>;
  }

  return children as ReactElement;
};

export default ContainerBody;
