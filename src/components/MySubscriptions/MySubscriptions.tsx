import React, { useState } from 'react';

import styles from './mySubscriptions.module.scss';
import globStyles from '../../index.module.scss';
import Button from '@mui/material/Button';
import axios from '../../axios';
import Spinner from '../UI/Spinner/Spinner';
import {
  redirectFromCheckoutURLCancelledSubscription,
  redirectFromCheckoutURLSuccessSubscription,
} from '../../constants/Constants';

const lookupKey = 'annualSubscription';

const MySubscriptions: React.FC = () => {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
        <p>
          Sign up today and get a limited time offer on annual and half-yearly
          subscriptions!
        </p>
      )}
      {error && <p className={globStyles['error-text']}>{error}</p>}
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
    </div>
  );
};

export default MySubscriptions;
