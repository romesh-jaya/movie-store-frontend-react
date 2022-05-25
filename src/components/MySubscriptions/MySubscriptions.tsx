import React, { useEffect, useState } from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';

import styles from './mySubscriptions.module.scss';
import globStyles from '../../index.module.scss';
import Button from '@mui/material/Button';
import axios from '../../axios';
import Spinner from '../UI/Spinner/Spinner';
import {
  redirectFromCheckoutURLCancelledSubscription,
  redirectFromCheckoutURLSuccessSubscription,
} from '../../constants/Constants';
import {
  getSubscriptionTypeDescription,
  getSubscriptionTypeValue,
} from '../../utils/SubscriptionUtil';
import { useNavigate } from 'react-router-dom';
import { subscriptionTypes } from '../../constants/SubscriptionTypes';
import { initPrices, prices } from '../../state/price';
import { getPrices } from '../../api/server/server';

interface ISubscriptionInfo {
  lookupKey?: string;
  cancelAt?: Date | null;
  currentPeriodEnd: Date;
}

const MySubscriptions: React.FC = () => {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [chosenSubscription, setChosenSubscription] = useState('');
  const pricesArray = prices.use();
  const navigate = useNavigate();
  const [subscriptionInfo, setSubscriptionInfo] = useState<ISubscriptionInfo>({
    currentPeriodEnd: new Date(),
  });
  const subscriptionText = subscriptionInfo.lookupKey
    ? `The following subscription is currently active: <strong>${getSubscriptionTypeValue(
        subscriptionInfo.lookupKey
      )}</strong> (${getSubscriptionTypeDescription(
        subscriptionInfo.lookupKey
      )})${
        subscriptionInfo.cancelAt
          ? ', expiring on ' + subscriptionInfo.cancelAt.toLocaleDateString()
          : ', and will auto-renew on ' +
            subscriptionInfo.currentPeriodEnd.toLocaleDateString()
      }.`
    : '';

  const handleChangeSubscriptionType = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setChosenSubscription((event.target as HTMLInputElement).value);
  };

  const proceedToSubscribe = async () => {
    setError('');

    try {
      setIsLoading(true);
      const response = await axios.post(
        `${
          import.meta.env.VITE_NODE_SERVER
        }/payments/stripe/subscriptions/create-checkout-session-subscription`,
        {
          lookup_key: chosenSubscription,
          redirectFromCheckoutURLCancelled:
            redirectFromCheckoutURLCancelledSubscription,
          redirectFromCheckoutURLSuccess:
            redirectFromCheckoutURLSuccessSubscription,
        }
      );
      const newURL = response.data.url;
      console.info('Redirecting to : ', newURL);
      window.location.href = newURL;
    } catch (error) {
      setError(`Error while submitting payment: ${error}`);
      setIsLoading(false);
    }
  };

  const proceedToCustomerPortal = async () => {
    setError('');

    try {
      setIsLoading(true);
      const response = await axios.post(
        `${
          import.meta.env.VITE_NODE_SERVER
        }/payments/stripe/portal/create-customer-portal-session`,
        {
          redirectFromCheckoutURLSuccess:
            redirectFromCheckoutURLSuccessSubscription,
        }
      );
      const newURL = response.data.url;
      console.info('Redirecting to : ', newURL);
      window.location.href = newURL;
    } catch (error) {
      setError(`Error while redirecting to customer portal: ${error}`);
      setIsLoading(false);
    }
  };

  const retrieveSubscriptionInfo = async () => {
    setError('');

    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_NODE_SERVER
        }/payments/stripe/subscriptions/get-user-subscription`
      );
      setSubscriptionInfo({
        lookupKey: response.data.lookupKey,
        cancelAt: response.data.cancelAtDate
          ? new Date(response.data.cancelAtDate)
          : null,
        currentPeriodEnd: new Date(response.data.currentPeriodEnd),
      });
    } catch (error) {
      setError(`Error while retrieving subscription info: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPrices = async () => {
    setError('');

    try {
      setIsLoading(true);
      const priceInfo = await getPrices();
      initPrices(priceInfo);
    } catch (error) {
      setError(`Error while fetching prices: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const getSubscriptionPrice = (lookupKey: string) => {
    const priceObject = pricesArray.find(
      (price) => price.lookupKey === lookupKey
    );
    return `${priceObject?.price} ${priceObject?.currency.toUpperCase()}`;
  };

  useEffect(() => {
    retrieveSubscriptionInfo();
    if (pricesArray.length === 0) {
      fetchPrices();
    }
  }, []);

  if (isLoading) {
    return (
      <div className={globStyles['spinner-full-page']}>
        <Spinner />
      </div>
    );
  }

  return (
    <div className={styles.table}>
      <h2>My subscriptions</h2>
      {!error && (
        <>
          {!subscriptionInfo.lookupKey && (
            <>
              <p className={styles.intro}>
                Sign up today and get a <strong>limited time offer</strong> on
                annual and half-yearly subscriptions!
              </p>
              <FormControl>
                <RadioGroup
                  onChange={handleChangeSubscriptionType}
                  classes={{
                    root: styles['radio-group'],
                  }}
                >
                  {subscriptionTypes.map((type) => (
                    <FormControlLabel
                      value={type.name}
                      key={type.name}
                      control={<Radio />}
                      label={`${type.value} (${
                        type.description
                      }) - ${getSubscriptionPrice(type.name)}`}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
              <div className={styles['button-div']}>
                <Button
                  color="primary"
                  variant="contained"
                  autoFocus
                  onClick={proceedToSubscribe}
                  disabled={!chosenSubscription}
                >
                  Subscribe
                </Button>
                <Button
                  color="secondary"
                  variant="contained"
                  onClick={() => navigate('/')}
                >
                  Back to Home
                </Button>
              </div>
            </>
          )}
          {subscriptionInfo.lookupKey && (
            <>
              <p dangerouslySetInnerHTML={{ __html: subscriptionText }} />
              <div className={styles['button-div']}>
                <Button
                  color="primary"
                  variant="contained"
                  autoFocus
                  onClick={proceedToCustomerPortal}
                >
                  Manage Subscription
                </Button>
                <Button
                  color="secondary"
                  variant="contained"
                  onClick={() => navigate('/')}
                >
                  Back to Home
                </Button>
              </div>
            </>
          )}
        </>
      )}
      {error && <p className={globStyles['error-text']}>{error}</p>}
    </div>
  );
};

export default MySubscriptions;
