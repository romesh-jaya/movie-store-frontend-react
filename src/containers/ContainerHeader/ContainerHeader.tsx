import { useAuth0 } from '@auth0/auth0-react';
import React from 'react';

import logo from '../../assets/img/movie.png';
import NavBar from '../../components/NavBar/NavBar';
import styles from './containerHeader.module.scss';

interface IProps {
  tabIndex: number;
  setTabIndex: (newTabIndex: number) => void;
}

const ContainerHeader: React.FC<IProps> = (props: IProps) => {
  const { tabIndex, setTabIndex } = props;
  const { user } = useAuth0();

  return (
    <>
      <div className={styles['header-container']}>
        <div className={styles.header}>
          <span className={`${styles['nowrap-div']} ${styles['div-logo']}`}>
            <img
              src={logo}
              height="50px"
              alt="movies"
              className={styles.logo}
            />
          </span>
          <h1 className={`${styles['nowrap-div']} ${styles['header-text']}`}>
            Ultra Movie Shop
          </h1>
        </div>
      </div>
      {!!user && <NavBar tabIndex={tabIndex} setTabIndex={setTabIndex} />}
    </>
  );
};

export default ContainerHeader;
