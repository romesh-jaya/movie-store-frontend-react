import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import Button from 'react-bootstrap/esm/Button';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

import globStyles from '../../../index.module.scss';
import {
  redirectFromCheckoutURLSuccessSubscriptionPayPal,
  storeName,
} from '../../../constants/Constants';
import Spinner from '../../UI/Spinner/Spinner';

interface IProps {
  planIDPayPal: string;
}

export default function PayPalSubscriptionCheckout(props: IProps) {
  const navigate = useNavigate();
  const { planIDPayPal } = props;
  const [{ isPending, isRejected }] = usePayPalScriptReducer();
  const { user } = useAuth0();

  const createSubscription = (_: any, actions: any) => {
    return actions.subscription.create({
      plan_id: planIDPayPal,
      application_context: {
        shipping_preference: 'NO_SHIPPING',
        brand_name: storeName,
      },
      custom_id: user?.email,
    });
  };

  const onApprove = async () => {
    navigate(redirectFromCheckoutURLSuccessSubscriptionPayPal);
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
