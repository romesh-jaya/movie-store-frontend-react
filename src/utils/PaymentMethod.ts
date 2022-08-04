import { PaymentMethodType } from '../enums/PaymentMethodType';

export const getPaymentMethod = () => {
  const paymentMethod = import.meta.env.VITE_PAYMENT_METHOD;

  switch (paymentMethod) {
    case PaymentMethodType.Stripe:
    case PaymentMethodType.PayPal:
      return paymentMethod;
    default:
      throw new Error(`Payment method ${paymentMethod} doesn't exist`);
  }
};
