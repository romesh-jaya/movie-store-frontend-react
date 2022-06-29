import Button from 'react-bootstrap/esm/Button';
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
        <Button variant="secondary" autoFocus onClick={() => navigate('/')}>
          Back to Home
        </Button>
        <Button variant="primary" onClick={proceedToCustomerPortal}>
          Manage Subscription
        </Button>
      </div>
    </>
  );
}
