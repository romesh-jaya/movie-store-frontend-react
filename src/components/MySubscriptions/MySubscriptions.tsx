import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

import SubscriptionExists from './SubscriptionExists/SubscriptionExists';
import NoSubscription from './NoSubscription/NoSubscription';
import { getPaymentMethod } from '../../utils/PaymentMethodUtil';
import { PaymentMethodType } from '../../enums/PaymentMethodType';

interface ISubscriptionInfo {
  lookupKey?: string;
  cancelAt?: Date | null;
  currentPeriodEnd: Date;
}

const paymentMethod = getPaymentMethod();

const MySubscriptions: React.FC = () => {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const [subscriptionInfo, setSubscriptionInfo] = useState<ISubscriptionInfo>({
    currentPeriodEnd: new Date(),
  });
  const subscriptionHtml = subscriptionInfo.lookupKey
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

    if (paymentMethod === PaymentMethodType.Stripe) {
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
      return;
    }
    navigate(`/checkout-subscription?chosenSubscription=${chosenSubscription}`);
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
      window.open(
        newURL,
        '_blank' // open in a new tab
      );
    } catch (error) {
      setError(`Error while redirecting to customer portal: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const retrieveSubscriptionInfo = async () => {
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
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setError('');
      setIsLoading(true);
      await retrieveSubscriptionInfo();
      setIsLoading(false);
    };
    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className={globStyles['spinner-full-page']}>
        <Spinner />
      </div>
    );
  }

  // Note: styles.table has been left intentionally as we cannot set custom boostrap max-width
  return (
    <div className={`my-4 ${styles.table}`}>
      <h2>My subscriptions</h2>
      {!error && (
        <>
          {subscriptionInfo.lookupKey ? (
            <SubscriptionExists
              proceedToCustomerPortal={proceedToCustomerPortal}
              subscriptionText={subscriptionHtml}
            />
          ) : (
            <NoSubscription proceedToSubscribe={proceedToSubscribe} />
          )}
        </>
      )}
      {error && <p className={globStyles['error-text']}>{error}</p>}
    </div>
  );
};

export default MySubscriptions;
