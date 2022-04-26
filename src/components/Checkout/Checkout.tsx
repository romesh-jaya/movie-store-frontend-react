import { useState, useEffect } from 'react';
import {
  Appearance,
  loadStripe,
  StripeElementsOptions,
} from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

import CheckoutForm from './CheckoutForm';
import axios from '../../axios';
import { cartItems } from '../../state/cart';
import styles from './checkout.module.scss';
import globStyles from '../../index.module.scss';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK_TEST);

const appearance: Appearance = {
  theme: 'stripe',
};

export default function Checkout() {
  const [clientSecret, setClientSecret] = useState('');
  const [error, setError] = useState('');
  const cartItemsArray = cartItems.use();
  const navigate = useNavigate();
  const titlesRented = cartItemsArray.map((item) => item.title);

  const createPaymentIntent = async () => {
    setError('');

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_NODE_SERVER}/payments/create-payment-intent`,
        {
          titlesRented,
        }
      );
      setClientSecret(response.data.clientSecret);
      console.info('response.data.clientSecret : ', response.data.clientSecret);
    } catch (error) {
      setError(`Error while submitting payment: ${error}`);
    }
  };

  useEffect(() => {
    if (titlesRented.length === 0) {
      navigate('/'); // probably came here by directly typing the URL
    }
    createPaymentIntent();
  }, []);

  const options: StripeElementsOptions = {
    clientSecret,
    appearance,
  };

  return (
    <div className={styles['container']}>
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      )}
      {error && (
        <>
          <p className={globStyles['error-text']}>{error}</p>
          <div className={styles['button-div']}>
            <span className={globStyles['right-spacer']}>
              <Button
                color="primary"
                variant="contained"
                autoFocus
                onClick={() => navigate('/')}
              >
                Back
              </Button>
            </span>
          </div>
        </>
      )}
    </div>
  );
}
