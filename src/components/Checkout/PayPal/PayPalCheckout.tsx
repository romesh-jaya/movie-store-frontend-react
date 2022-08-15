import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/esm/Button';
import { useNavigate } from 'react-router-dom';

import axios from '../../../axios';
import { cartItems } from '../../../state/cart';
import { prices, titlePriceId } from '../../../state/price';
import globStyles from '../../../index.module.scss';
import Spinner from '../../UI/Spinner/Spinner';
import {
  storeName,
  redirectFromCheckoutURLSuccessNoCheckout,
} from '../../../constants/Constants';

export default function PayPalCheckout() {
  const navigate = useNavigate();
  const [orderId, setOrderId] = useState('');
  const [error, setError] = useState('');
  const cartItemsArray = cartItems.use();
  const titlesRented = cartItemsArray.map((item) => item.title);
  const pricesArray = prices.use();
  const [isLoading, setIsLoading] = useState(true);
  const [{ isPending, isRejected }] = usePayPalScriptReducer();

  const pricePerTitle =
    pricesArray.find((price) => price.lookupKey === titlePriceId)?.price || 0;
  const priceCurrency =
    pricesArray.find((price) => price.lookupKey === titlePriceId)?.currency ||
    '';

  const createOrder = (_: any, actions: any) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            currency_code: priceCurrency.toUpperCase(),
            value: pricePerTitle * cartItemsArray.length,
          },
          reference_id: orderId,
          description: storeName,
        },
      ],
      application_context: {
        shipping_preference: 'NO_SHIPPING',
        brand_name: storeName,
      },
    });
  };

  const onApprove = async (_: any, actions: any) => {
    await actions.order.capture();
    navigate(`${redirectFromCheckoutURLSuccessNoCheckout}?orderId=${orderId}`);
  };

  const createPaymentIntent = async () => {
    setError('');

    try {
      const response = await axios.post(
        `${
          import.meta.env.VITE_NODE_SERVER
        }/payments/paypal/products/create-payment-intent`,
        {
          titlesRented,
        }
      );
      const { orderId } = response.data;
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

  if (isLoading || isPending) {
    return (
      <div className={globStyles['spinner-full-page']}>
        <Spinner />
      </div>
    );
  }

  return (
    <>
      {!error && !isRejected && (
        <PayPalButtons
          createOrder={(data, actions) => createOrder(data, actions)}
          onApprove={(data, actions) => onApprove(data, actions)}
        />
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
