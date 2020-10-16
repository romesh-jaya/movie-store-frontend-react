import React from 'react';

import logo from '../../assets/img/movie.png';
import * as styles from './ContainerHeader.css';

const ContainerHeader: React.FC = () => {

  return (
    <>
      <div className={styles.header}>
        <span className={`${styles.nowrapDiv} ${styles.div1}`}>
          <img src={logo} height="50px" alt="movies" />
        </span>
        <h1 className={`${styles.nowrapDiv} ${styles.headerText}`}>
          Ultra Movie Shop
        </h1>
      </div>
    </>    
  );
};

export default ContainerHeader;