import React, { useEffect, useState } from 'react';
import {
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

import styles from './stripeCheckoutForm.module.scss';
import { redirectFromCheckoutURLSuccess } from '../../../constants/Constants';

interface IProps {
  orderId?: string;
}

export default function StripeCheckoutForm(props: IProps) {
  const { orderId } = props;
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      'payment_intent_client_secret'
    );

    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      if (paymentIntent) {
        switch (paymentIntent.status) {
          case 'succeeded':
            setMessage('Payment succeeded!');
            break;
          case 'processing':
            setMessage('Your payment is processing.');
            break;
          case 'requires_payment_method':
            setMessage('Your payment was not successful, please try again.');
            break;
          default:
            setMessage('Something went wrong.');
            break;
        }
      }
    });
  }, [stripe]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${redirectFromCheckoutURLSuccess}?orderId=${orderId}`,
      },
    });

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    if (error.type === 'card_error' || error.type === 'validation_error') {
      setMessage(error.message || '');
    } else {
      setMessage('An unexpected error occured.');
    }

    setIsLoading(false);
  };

  return (
    <form
      id="payment-form"
      className={styles['payment-form']}
      onSubmit={handleSubmit}
    >
      <PaymentElement
        id="payment-element"
        className={styles['payment-element']}
      />
      <button
        disabled={isLoading || !stripe || !elements}
        id="submit"
        className={styles['submit']}
      >
        <span id="button-text">
          {isLoading ? (
            <div className={styles['spinner']} id="spinner"></div>
          ) : (
            'Pay now'
          )}
        </span>
      </button>
      {message && (
        <div id="payment-message" className={styles['payment-message']}>
          {message}
        </div>
      )}
    </form>
  );
}
