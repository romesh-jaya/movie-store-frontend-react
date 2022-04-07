import { initItems } from '../state/cart';
import { SessionData } from '../types/SessionData';

export const manageUserSession = () => {
  const sessionDataString = localStorage.getItem('sessionData');

  if (sessionDataString) {
    const sessionData = JSON.parse(sessionDataString) as SessionData;
    if (sessionData.dateCreated) {
      const dateCreatedAsDate = new Date(sessionData.dateCreated);
      if (!isNaN(dateCreatedAsDate.valueOf())) {
        const refDate = new Date();
        refDate.setHours(refDate.getHours() - 1);
        if (dateCreatedAsDate < refDate) {
          localStorage.removeItem('sessionData');
        } else if (sessionData.cartItems) {
          initItems(sessionData.cartItems);
        }
      }
    }
  }
};
