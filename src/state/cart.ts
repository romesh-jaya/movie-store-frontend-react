import { entity } from 'simpler-state';

export const cartItems = entity<string[]>([]);

export const reset = () => {
  cartItems.set([]);
};

export const itemExists = (item: string): boolean => {
  return !!cartItems.get().find((itemOne) => itemOne === item);
};

export const addItem = (item: string) => {
  cartItems.set((value) => [...value, item]);
};

export const removeItem = (item: string) => {
  cartItems.set((value) => value.filter((itemOne) => itemOne !== item));
};
