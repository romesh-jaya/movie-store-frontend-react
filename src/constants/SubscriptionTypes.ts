import INameValue from '../interfaces/INameValue';

export const subscriptionTypes: INameValue[] = [
  { name: 'annualSubscription', value: 'DVD rental annual Subscription' },
  { name: 'halfYearSubscription', value: 'DVD rental half-year Subscription' },
];

export const getSubscriptionTypeValue = (name: string) => {
  const value = subscriptionTypes.find((type) => type.name === name)?.value;
  return value ?? 'Unknown';
};
