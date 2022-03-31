import React from 'react';

import logo from '../../assets/img/movie.png';
import styles from './containerHeader.module.scss';

const ContainerHeader: React.FC = () => {
  return (
    <div className={styles['header-container']}>
      <div className={styles.header}>
        <span className={`${styles['nowrap-div']} ${styles['div-logo']}`}>
          <img src={logo} height="50px" alt="movies" className={styles.logo} />
        </span>
        <h1 className={`${styles['nowrap-div']} ${styles['header-text']}`}>
          Ultra Movie Shop
        </h1>
      </div>
    </div>
  );
};

export default ContainerHeader;
