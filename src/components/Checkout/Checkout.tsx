import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { PaymentMethodType } from '../../enums/PaymentMethodType';
import { getPaymentMethod } from '../../utils/PaymentMethodUtil';
import StripeCheckout from './Stripe/StripeCheckout';
import { cartItems } from '../../state/cart';
import PayPalCheckout from './PayPal/PayPalCheckout';

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

  if (paymentMethod === PaymentMethodType.Stripe) {
    return <StripeCheckout />;
  }

  return <PayPalCheckout />;
}
