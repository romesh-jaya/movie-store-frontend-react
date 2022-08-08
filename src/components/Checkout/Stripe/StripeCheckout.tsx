import { useState, useEffect } from 'react';
import {
  Appearance,
  loadStripe,
  StripeElementsOptions,
} from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/esm/Button';

import StripeCheckoutForm from './StripeCheckoutForm';
import axios from '../../../axios';
import { cartItems } from '../../../state/cart';
import globStyles from '../../../index.module.scss';
import { redirectFromCheckoutURLSuccessNoCheckout } from '../../../constants/Constants';
import Spinner from '../../UI/Spinner/Spinner';

// Note: the code for this has mostly been taken from Stripe's examples
// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK_TEST);

const appearance: Appearance = {
  theme: 'stripe',
};

export default function StripeCheckout() {
  const [clientSecret, setClientSecret] = useState('');
  const [orderId, setOrderId] = useState('');
  const [error, setError] = useState('');
  const cartItemsArray = cartItems.use();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const titlesRented = cartItemsArray.map((item) => item.title);

  const createPaymentIntent = async () => {
    setError('');

    try {
      const response = await axios.post(
        `${
          import.meta.env.VITE_NODE_SERVER
        }/payments/stripe/products/create-payment-intent`,
        {
          titlesRented,
        }
      );
      const { subscriptionActive, clientSecret, orderId } = response.data;
      if (subscriptionActive) {
        navigate(
          `${redirectFromCheckoutURLSuccessNoCheckout}?orderId=${orderId}`
        );
        return;
      }
      setClientSecret(clientSecret);
      setOrderId(orderId);
    } catch (error) {
      setError(`Error while creating payment intent: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    createPaymentIntent();
  }, []);

  const options: StripeElementsOptions = {
    clientSecret,
    appearance,
  };

  if (isLoading) {
    return (
      <div className={globStyles['spinner-full-page']}>
        <Spinner />
      </div>
    );
  }

  return (
    <>
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <StripeCheckoutForm orderId={orderId} />
        </Elements>
      )}
      {error && (
        <>
          <p className={globStyles['error-text']}>{error}</p>
          <div className="mt-4">
            <span className="me-3">
              <Button variant="primary" onClick={() => navigate('/')}>
                Back
              </Button>
            </span>
          </div>
        </>
      )}
    </>
  );
}
