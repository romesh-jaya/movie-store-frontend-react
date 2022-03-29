import React from 'react';

import logo from '../../assets/img/movie.png';
import styles from './containerHeader.module.css';

const ContainerHeader: React.FC = () => {
  return (
    <>
      <div className={styles.header}>
        <span className={`${styles['nowrap-div']} ${styles['div-logo']}`}>
          <img src={logo} height="50px" alt="movies" />
        </span>
        <h1 className={`${styles['nowrap-div']} ${styles['header-text']}`}>
          Ultra Movie Shop
        </h1>
      </div>
    </>
  );
};

export default ContainerHeader;
