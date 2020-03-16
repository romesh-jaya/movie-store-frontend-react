import React from 'react';
import logo from '../../assets/img/movie.png';
import * as styles from './MovieContainer.css';
 
const MovieContainer: React.FC = () => {
  return (
    <>
      <div className={styles.header}>
        <div className={`${styles.nowrapDiv  } ${  styles.div1}`}>
          <img src={logo} height="50px" alt="movies" />
        </div>
        <div className={`${styles.nowrapDiv  } ${  styles.div2} ${  styles.headerText}`}>
            Ultra Movie Shop
        </div>
      </div>
    </>
  );
};
 
export default MovieContainer;