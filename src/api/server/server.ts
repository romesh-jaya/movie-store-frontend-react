import axios from '../../axios';
import { PaymentMethodType } from '../../enums/PaymentMethodType';
import { IPrice } from '../../state/price';
import { getPaymentMethod } from '../../utils/PaymentMethodUtil';

const paymentMethod = getPaymentMethod();

export const getPrices = async (): Promise<IPrice[]> => {
  if (paymentMethod === PaymentMethodType.Stripe) {
    const response = await axios.get(
      `${import.meta.env.VITE_NODE_SERVER}/payments/stripe/prices`
    );
    return response.data.priceInfo;
  }

  const response = await axios.get(
    `${import.meta.env.VITE_NODE_SERVER}/payments/paypal/prices`
  );
  return response.data.priceInfo;
};
