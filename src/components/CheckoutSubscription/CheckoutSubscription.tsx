import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';

import { PaymentMethodType } from '../../enums/PaymentMethodType';
import {
  getPaymentMethod,
  getPayPalClientID,
} from '../../utils/PaymentMethodUtil';
import globStyles from '../../index.module.scss';
import PayPalSubscriptionCheckout from './PayPal/PayPalSubscriptionCheckout';
import styles from './checkoutSubscription.module.scss';
import { prices } from '../../state/price';

const payPalOptions = {
  'client-id': getPayPalClientID(),
  components: 'buttons',
  intent: 'subscription',
  vault: true,
};

const paymentMethod = getPaymentMethod();

export default function CheckoutSubscription() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const pricesArray = prices.use();
  const [error, setError] = useState('');
  const [planIDPayPal, setPlanIDPayPal] = useState('');

  useEffect(() => {
    const chosenSubscription = searchParams.get('chosenSubscription');

    if (paymentMethod !== PaymentMethodType.PayPal || !chosenSubscription) {
      navigate('/'); // probably came here by directly typing the URL
      return;
    }

    const planIDPayPal = pricesArray.find(
      (price) => price.lookupKey === chosenSubscription
    )?.planIDPayPal;

    if (!planIDPayPal) {
      setError('Error in extracting PayPal Plan ID');
      return;
    }
    setPlanIDPayPal(planIDPayPal);
  }, []);

  return (
    <div className={`my-4 ${styles['container']}`}>
      {error && <p className={globStyles['error-text']}>{error}</p>}
      {!error && (
        <PayPalScriptProvider options={payPalOptions}>
          <PayPalSubscriptionCheckout planIDPayPal={planIDPayPal} />
        </PayPalScriptProvider>
      )}
    </div>
  );
}
