import { entity } from 'simpler-state';
import { MovieTableInfo } from '../types/MovieTableInfo';

export const cartItems = entity<MovieTableInfo[]>([]);

export const clearCart = () => {
  cartItems.set([]);
  saveToLocalStorage();
};

export const initItems = (items: MovieTableInfo[]) => {
  cartItems.set(items);
};

export const addItem = (item: MovieTableInfo) => {
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
