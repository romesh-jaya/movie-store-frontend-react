import React, { useState, useEffect } from 'react';

import styles from './transactionResult.module.scss';
import globStyles from '../../index.module.scss';
import Button from '@mui/material/Button';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from '../../axios';
import Spinner from '../UI/Spinner/Spinner';
import { clearCart } from '../../state/cart';

const TransactionResult: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [error, setError] = useState('');
  const [orderNoRetrieved, setOrderNoRetrieved] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const heading = error ? 'Something went wrong' : 'Transaction Success';

  useEffect(() => {
    const completePayment = async () => {
      const orderId = searchParams.get('orderId');

      if (!orderId) {
        setError('OrderId param is missing in URL');
        return;
      }

      setError('');

      try {
        setIsLoading(true);
        const response = await axios.post(
          `${import.meta.env.VITE_NODE_SERVER}/payments/complete-payment`,
          {
            orderId,
          }
        );
        setOrderNoRetrieved(response.data.orderNo);
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
    return (
      <div className={globStyles['spinner-full-page']}>
        <Spinner />
      </div>
    );
  }

  return (
    <div className={styles.table}>
      <h2>{heading}</h2>
      {!error && (
        <p>Thank you for your order. Your order no is: {orderNoRetrieved}</p>
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
