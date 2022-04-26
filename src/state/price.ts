import { entity } from 'simpler-state';

export const titlePriceId = 'TITLE_PRICE';

export interface IPrice {
  id: string;
  price: number;
  currency: string;
}

export const prices = entity<IPrice[]>([]);

export const initPrices = (priceItems: IPrice[]) => {
  prices.set(priceItems);
};
