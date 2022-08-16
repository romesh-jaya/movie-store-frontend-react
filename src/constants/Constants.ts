export const SEARCH_URL = import.meta.env.VITE_SEARCH_URL || '';

export const storeName = 'Ultra Movie Shop';

export const pageSize = 10;

export const redirectFromCheckoutURLCancelled =
  window.location.origin.toString();
export const redirectFromCheckoutURLSuccess = `${window.location.origin.toString()}/transaction-result`;
export const redirectFromCheckoutURLSuccessNoCheckout = `/transaction-result`;
export const redirectFromCheckoutURLSuccessSubscription = `${window.location.origin.toString()}/my-subscriptions`;
export const redirectFromCheckoutURLCancelledSubscription = `${window.location.origin.toString()}/my-subscriptions`;
export const redirectFromCheckoutURLSuccessSubscriptionPayPal = `/my-subscriptions`;
