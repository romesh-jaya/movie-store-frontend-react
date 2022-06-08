import React, { useState, useEffect } from 'react';

import styles from './transactionResult.module.scss';
import globStyles from '../../index.module.scss';
import Button from '@mui/material/Button';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from '../../axios';
import { clearCart } from '../../state/cart';
import LoadingSkeleton from '../LoadingSkeleton/LoadingSkeleton';

const TransactionResult: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [error, setError] = useState('');
  const [orderNoRetrieved, setOrderNoRetrieved] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const heading = error ? 'Something went wrong' : 'Transaction Success';

  useEffect(() => {
    const completePayment = async () => {
      const orderId = searchParams.get('orderId');

      if (!orderId) {
        setError('OrderId param is missing in URL');
        setIsLoading(false);
        return;
      }

      setError('');

      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_NODE_SERVER
          }/orders/get-order-no?orderId=${orderId}`
        );
        setOrderNoRetrieved(response.data);
        clearCart();
      } catch (error) {
        setError(`Error while completing payment: ${error}`);
      } finally {
        setIsLoading(false);
      }
    };
    completePayment();
  }, []);

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className={styles.table}>
      <h2>{heading}</h2>
      {!error && (
        <p>
          Thank you for your order. Your order no is: {orderNoRetrieved}. You
          should receive a confirmation email shortly.
        </p>
      )}
      {error && <p className={globStyles['error-text']}>{error}</p>}
      <div className={styles['button-div']}>
        <Button
          color="primary"
          variant="contained"
          autoFocus
          onClick={() => navigate('/')}
        >
          Back to Home
        </Button>
      </div>
    </div>
  );
};

export default TransactionResult;
