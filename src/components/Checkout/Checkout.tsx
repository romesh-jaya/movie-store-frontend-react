import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';

import { PaymentMethodType } from '../../enums/PaymentMethodType';
import {
  getPaymentMethod,
  getPayPalClientID,
} from '../../utils/PaymentMethodUtil';
import StripeCheckout from './Stripe/StripeCheckout';
import { cartItems } from '../../state/cart';
import PayPalCheckout from './PayPal/PayPalCheckout';
import styles from './checkout.module.scss';

const payPalOptions = {
  'client-id': getPayPalClientID(),
  components: 'buttons',
};

const paymentMethod = getPaymentMethod();

export default function Checkout() {
  const navigate = useNavigate();
  const cartItemsArray = cartItems.use();
  const titlesRented = cartItemsArray.map((item) => item.title);

  useEffect(() => {
    if (titlesRented.length === 0) {
      navigate('/'); // probably came here by directly typing the URL
    }
  }, []);

  return (
    <div className={`my-4 ${styles['container']}`}>
      {paymentMethod === PaymentMethodType.Stripe && <StripeCheckout />}
      {paymentMethod === PaymentMethodType.PayPal && (
        <PayPalScriptProvider options={payPalOptions}>
          <PayPalCheckout />
        </PayPalScriptProvider>
      )}
    </div>
  );
}
