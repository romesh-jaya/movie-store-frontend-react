import React, { useEffect, useState } from 'react';

import styles from './mySubscriptions.module.scss';
import globStyles from '../../index.module.scss';
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

import { initPrices } from '../../state/price';
import { getPrices } from '../../api/server/server';
import SubscriptionExists from './SubscriptionExists/SubscriptionExists';
import NoSubscription from './NoSubscription/NoSubscription';

interface ISubscriptionInfo {
  lookupKey?: string;
  cancelAt?: Date | null;
  currentPeriodEnd: Date;
}

const MySubscriptions: React.FC = () => {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

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

  const proceedToSubscribe = async (chosenSubscription: string) => {
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

  useEffect(() => {
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
          {subscriptionInfo.lookupKey ? (
            <SubscriptionExists
              proceedToCustomerPortal={proceedToCustomerPortal}
              subscriptionText={subscriptionText}
            />
          ) : (
            <NoSubscription
              fetchPrices={fetchPrices}
              proceedToSubscribe={proceedToSubscribe}
            />
          )}
        </>
      )}
      {error && <p className={globStyles['error-text']}>{error}</p>}
    </div>
  );
};

export default MySubscriptions;
