import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/esm/Button';
import ToggleButton from 'react-bootstrap/esm/ToggleButton';
import ToggleButtonGroup from 'react-bootstrap/esm/ToggleButtonGroup';

import { subscriptionTypes } from '../../../constants/SubscriptionTypes';
import { useEffect, useState } from 'react';
import { prices } from '../../../state/price';

interface IProps {
  proceedToSubscribe: (chosenSubscription: string) => {};
}

export default function NoSubscription(props: IProps) {
  const { proceedToSubscribe } = props;
  const [chosenSubscription, setChosenSubscription] = useState('');
  const pricesArray = prices.use();
  const navigate = useNavigate();

  const handleChangeSubscriptionType = (value: string) => {
    setChosenSubscription(value);
  };

  const getSubscriptionPrice = (lookupKey: string) => {
    const priceObject = pricesArray.find(
      (price) => price.lookupKey === lookupKey
    );
    return `${priceObject?.price} ${priceObject?.currency.toUpperCase()}`;
  };

  useEffect(() => {}, []);

  // Note: onChange() in the ToggleButtonGroup didn't fire, so used onClick in the ToggleButton instead
  return (
    <>
      <p className="mt-4">
        Sign up today and get a <strong>limited time offer</strong> on annual
        and half-yearly subscriptions!
      </p>
      <ToggleButtonGroup
        type="radio"
        className="d-flex gap-3"
        value={chosenSubscription}
        name="group1"
      >
        {subscriptionTypes.map((type) => (
          <ToggleButton
            value={type.name}
            id={type.name}
            key={type.name}
            onClick={() => handleChangeSubscriptionType(type.name)}
            variant={chosenSubscription === type.name ? 'info' : 'outline-info'}
          >
            {`${type.value} (${type.description}) - ${getSubscriptionPrice(
              type.name
            )}`}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
      <div className="d-flex justify-content-center gap-3 mt-4">
        <Button
          variant="primary"
          onClick={() => proceedToSubscribe(chosenSubscription)}
          disabled={!chosenSubscription}
        >
          Subscribe
        </Button>

        <Button variant="secondary" onClick={() => navigate('/')}>
          Back to Home
        </Button>
      </div>
    </>
  );
}
