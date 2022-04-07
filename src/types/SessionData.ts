import { ICartItem } from '../state/cart';

export type SessionData = {
  dateCreated?: Date;
  cartItems?: ICartItem[];
};
