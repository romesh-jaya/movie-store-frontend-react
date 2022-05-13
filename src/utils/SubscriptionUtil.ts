import { subscriptionTypes } from '../constants/SubscriptionTypes';

export const getSubscriptionTypeValue = (name: string) => {
  const value = subscriptionTypes.find((type) => type.name === name)?.value;
  return value ?? 'Unknown';
};

export const getSubscriptionTypeDescription = (name: string) => {
  const description = subscriptionTypes.find(
    (type) => type.name === name
  )?.description;
  return description ?? 'Unknown';
};
