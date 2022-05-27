import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

import styles from '../mySubscriptions.module.scss';

interface IProps {
  subscriptionText: string;
  proceedToCustomerPortal: () => {};
}

export default function SubscriptionExists(props: IProps) {
  const { subscriptionText, proceedToCustomerPortal } = props;
  const navigate = useNavigate();

  return (
    <>
      <p dangerouslySetInnerHTML={{ __html: subscriptionText }} />
      <div className={styles['button-div']}>
        <Button
          color="secondary"
          variant="contained"
          autoFocus
          onClick={() => navigate('/')}
        >
          Back to Home
        </Button>
        <Button
          color="primary"
          variant="contained"
          onClick={proceedToCustomerPortal}
        >
          Manage Subscription
        </Button>
      </div>
    </>
  );
}
