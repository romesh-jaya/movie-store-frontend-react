import { entity } from 'simpler-state';

export interface ICartItem {
  id: string;
  title: string;
  imdbID: string;
}

export const cartItems = entity<ICartItem[]>([]);

export const initItems = (items: ICartItem[]) => {
  cartItems.set(items);
};

export const addItem = (item: ICartItem) => {
  cartItems.set((value) => [...value, item]);
  saveToLocalStorage();
};

export const removeItem = (imdbID: string) => {
  cartItems.set((value) =>
    value.filter((itemOne) => itemOne.imdbID !== imdbID)
  );
  saveToLocalStorage();
};

const saveToLocalStorage = () => {
  localStorage.setItem(
    'sessionData',
    JSON.stringify({ dateCreated: new Date(), cartItems: cartItems.get() })
  );
};
