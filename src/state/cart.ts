import { entity } from 'simpler-state';

export interface ICartItem {
  id: string;
  title: string;
  imdbID: string;
}

export const cartItems = entity<ICartItem[]>([]);

export const reset = () => {
  cartItems.set([]);
};

export const addItem = (item: ICartItem) => {
  cartItems.set((value) => [...value, item]);
};

export const removeItem = (imdbID: string) => {
  cartItems.set((value) =>
    value.filter((itemOne) => itemOne.imdbID !== imdbID)
  );
};
