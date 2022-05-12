import React, { useEffect, useState } from 'react';

import styles from './mySubscriptions.module.scss';
import globStyles from '../../index.module.scss';
import Button from '@mui/material/Button';
import axios from '../../axios';
import Spinner from '../UI/Spinner/Spinner';
import {
  redirectFromCheckoutURLCancelledSubscription,
  redirectFromCheckoutURLSuccessSubscription,
} from '../../constants/Constants';
import { getSubscriptionTypeValue } from '../../constants/SubscriptionTypes';

const lookupKey = 'annualSubscription';

interface ISubscriptionInfo {
  lookupKey?: string;
  cancelAt?: Date | null;
}

const MySubscriptions: React.FC = () => {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [subscriptionInfo, setSubscriptionInfo] = useState<ISubscriptionInfo>(
    {}
  );
  const subscriptionText = subscriptionInfo.lookupKey
    ? `The following subscription is currently active: <strong>${getSubscriptionTypeValue(
        subscriptionInfo.lookupKey
      )}</strong>${
        subscriptionInfo.cancelAt
          ? ', expiring on ' + subscriptionInfo.cancelAt.toLocaleDateString()
          : ''
      }.`
    : '';

  const proceedToSubscribe = async () => {
    setError('');

    try {
      setIsLoading(true);
      const response = await axios.post(
        `${
          import.meta.env.VITE_NODE_SERVER
        }/payments/create-checkout-session-subscription`,
        {
          lookup_key: lookupKey,
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

  useEffect(() => {
    const retrieveSubscriptionInfo = async () => {
      setError('');

      try {
        setIsLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_NODE_SERVER}/payments/get-user-subscription`
        );
        setSubscriptionInfo({
          lookupKey: response.data.lookupKey,
          cancelAt: response.data.cancelAtDate
            ? new Date(response.data.cancelAtDate)
            : null,
        });
      } catch (error) {
        setError(`Error while retrieving subscription info: ${error}`);
      } finally {
        setIsLoading(false);
      }
    };
    retrieveSubscriptionInfo();
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
              <p>
                Sign up today and get a limited time offer on annual and
                half-yearly subscriptions!
              </p>
              <div className={styles['button-div']}>
                <Button
                  color="primary"
                  variant="contained"
                  autoFocus
                  onClick={proceedToSubscribe}
                >
                  Subscribe
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
                  onClick={proceedToSubscribe}
                >
                  Manage Subscription
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
