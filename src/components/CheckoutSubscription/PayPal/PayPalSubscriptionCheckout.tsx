import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import Button from 'react-bootstrap/esm/Button';
import { useNavigate } from 'react-router-dom';

import globStyles from '../../../index.module.scss';
import { redirectFromCheckoutURLSuccessSubscription } from '../../../constants/Constants';
import Spinner from '../../UI/Spinner/Spinner';

interface IProps {
  planIDPayPal: string;
}

export default function PayPalSubscriptionCheckout(props: IProps) {
  const navigate = useNavigate();
  const { planIDPayPal } = props;
  const [{ isPending, isRejected }] = usePayPalScriptReducer();

  const createSubscription = (_: any, actions: any) => {
    return actions.subscription.create({
      plan_id: planIDPayPal,
    });
  };

  const onApprove = async () => {
    const newURL = redirectFromCheckoutURLSuccessSubscription;
    console.info('Redirecting to : ', newURL);
    window.location.href = newURL;
  };

  if (isPending) {
    return (
      <div className={globStyles['spinner-full-page']}>
        <Spinner />
      </div>
    );
  }

  return (
    <>
      {!isRejected && (
        <PayPalButtons
          createSubscription={(data, actions) =>
            createSubscription(data, actions)
          }
          onApprove={onApprove}
        />
      )}
      {isRejected && (
        <>
          <p className={globStyles['error-text']}>
            Error loading Paypal Buttons
          </p>
          <div className="mt-4">
            <span className="me-3">
              <Button variant="primary" onClick={() => navigate('/')}>
                Back
              </Button>
            </span>
          </div>
        </>
      )}
    </>
  );
}
