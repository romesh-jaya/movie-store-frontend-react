import { useAuth0 } from '@auth0/auth0-react';
import React from 'react';
import { useLocation } from 'react-router';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import logo from '../../assets/img/movie.png';
import NavBar from '../../components/NavBar/NavBar';
import styles from './containerHeader.module.scss';
import { PREFERS_DARK_MODE_MEDIA_QUERY } from '../../constants/Constants';

interface IProps {
  tabIndex: number;
  setTabIndex: (newTabIndex: number) => void;
}

const ContainerHeader: React.FC<IProps> = (props: IProps) => {
  const { tabIndex, setTabIndex } = props;
  const { user } = useAuth0();
  const location = useLocation();
  const prefersDarkMode = useMediaQuery(PREFERS_DARK_MODE_MEDIA_QUERY);
  const theme = useTheme();
  const dontShowNavBar =
    location.pathname.includes('transaction-result') ||
    location.pathname.includes('checkout') ||
    location.pathname.includes('my-subscriptions');

  return (
    <>
      <div
        style={{
          backgroundColor: prefersDarkMode
            ? theme.palette.secondary.dark
            : theme.palette.secondary.main,
        }}
        className={styles['header-container']}
      >
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
      {!!user && !dontShowNavBar && (
        <NavBar tabIndex={tabIndex} setTabIndex={setTabIndex} />
      )}
    </>
  );
};

export default ContainerHeader;
