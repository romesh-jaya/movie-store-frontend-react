import { PaymentMethodType } from '../../enums/PaymentMethodType';
import { getPaymentMethod } from '../../utils/PaymentMethod';
import StripeCheckout from './Stripe/StripeCheckout';

export default function Checkout() {
  const paymentMethod = getPaymentMethod();
  if (paymentMethod === PaymentMethodType.Stripe) {
    return <StripeCheckout />;
  }

  return <div>Checkout</div>;
}
