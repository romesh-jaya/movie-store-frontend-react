import React from 'react';
import styles from './spinner.module.css';

const Spinner: React.FC = () => {
  return (
    <>
      <div className={styles['spinner-body']}>
        <div className={styles['loading-spinner']} />
      </div>
    </>
  );
};

export default Spinner;
