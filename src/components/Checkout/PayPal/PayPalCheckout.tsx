import { PayPalButtons } from '@paypal/react-paypal-js';

export default function PayPalCheckout() {
  const createOrder = (_: any, actions: any) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: '0.01',
          },
        },
      ],
    });
  };
  const onApprove = async (_: any, actions: any) => {
    await actions.order.capture();
    alert(`Transaction completed`);
  };

  return (
    <PayPalButtons
      createOrder={(data, actions) => createOrder(data, actions)}
      onApprove={(data, actions) => onApprove(data, actions)}
    />
  );
}
