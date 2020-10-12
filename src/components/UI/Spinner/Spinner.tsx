import React from 'react';
import * as styles from './Spinner.css';

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