import Button from 'react-bootstrap/esm/Button';
import { useNavigate } from 'react-router-dom';

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
      <div className="d-flex justify-content-center gap-3 mt-4">
        <Button variant="secondary" onClick={() => navigate('/')}>
          Back to Home
        </Button>
        <Button variant="primary" onClick={proceedToCustomerPortal}>
          Manage Subscription
        </Button>
      </div>
    </>
  );
}
