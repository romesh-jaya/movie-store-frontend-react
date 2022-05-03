/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';

import styles from './mySubscriptions.module.scss';
import globStyles from '../../index.module.scss';
import Button from '@mui/material/Button';
import axios from '../../axios';
import Spinner from '../UI/Spinner/Spinner';

const MySubscriptions: React.FC = () => {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (isLoading) {
    return (
      <div className={globStyles['spinner-full-page']}>
        <Spinner />
      </div>
    );
  }

  return (
    <div className={styles.table}>
      <h2>My subscriptions</h2>
      {!error && (
        <p>
          Sign up today and get a limited time offer on annual and half-yearly
          subscriptions!
        </p>
      )}
      {error && <p className={globStyles['error-text']}>{error}</p>}
      <div className={styles['button-div']}>
        <Button
          color="primary"
          variant="contained"
          autoFocus
          onClick={() => {}}
        >
          Subscribe
        </Button>
      </div>
    </div>
  );
};

export default MySubscriptions;
