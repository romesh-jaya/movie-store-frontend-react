import Button from '@mui/material/Button';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import { useNavigate } from 'react-router-dom';

import { subscriptionTypes } from '../../../constants/SubscriptionTypes';
import styles from '../mySubscriptions.module.scss';
import { useEffect, useState } from 'react';
import { prices } from '../../../state/price';

interface IProps {
  fetchPrices: () => {};
  proceedToSubscribe: (chosenSubscription: string) => {};
}

export default function NoSubscription(props: IProps) {
  const { fetchPrices, proceedToSubscribe } = props;
  const [chosenSubscription, setChosenSubscription] = useState('');
  const pricesArray = prices.use();
  const navigate = useNavigate();

  const handleChangeSubscriptionType = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setChosenSubscription((event.target as HTMLInputElement).value);
  };

  const getSubscriptionPrice = (lookupKey: string) => {
    const priceObject = pricesArray.find(
      (price) => price.lookupKey === lookupKey
    );
    return `${priceObject?.price} ${priceObject?.currency.toUpperCase()}`;
  };

  useEffect(() => {
    if (pricesArray.length === 0) {
      fetchPrices();
    }
  }, []);

  return (
    <>
      <p className={styles.intro}>
        Sign up today and get a <strong>limited time offer</strong> on annual
        and half-yearly subscriptions!
      </p>
      <FormControl>
        <RadioGroup
          onChange={handleChangeSubscriptionType}
          classes={{
            root: styles['radio-group'],
          }}
        >
          {subscriptionTypes.map((type) => (
            <FormControlLabel
              value={type.name}
              key={type.name}
              control={<Radio />}
              label={`${type.value} (${
                type.description
              }) - ${getSubscriptionPrice(type.name)}`}
            />
          ))}
        </RadioGroup>
      </FormControl>
      <div className={styles['button-div']}>
        <Button
          color="primary"
          variant="contained"
          autoFocus
          onClick={() => proceedToSubscribe(chosenSubscription)}
          disabled={!chosenSubscription}
        >
          Subscribe
        </Button>
        <Button
          color="secondary"
          variant="contained"
          onClick={() => navigate('/')}
        >
          Back to Home
        </Button>
      </div>
    </>
  );
}
