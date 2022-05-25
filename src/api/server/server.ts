import axios from '../../axios';
import { IPrice } from '../../state/price';

export const getPrices = async (): Promise<IPrice[]> => {
  const response = await axios.get(
    `${import.meta.env.VITE_NODE_SERVER}/payments/prices`
  );
  return response.data.priceInfo;
};
