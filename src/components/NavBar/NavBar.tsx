import React from 'react';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { Button, styled } from '@mui/material';
import { useAuth0 } from '@auth0/auth0-react';

import { isAdmin } from '../../utils/AuthUtil';
import styles from './navbar.module.css';
import globStyles from '../../index.module.scss';

interface IProps {
  tabIndex: number;
  setTabIndex: (newTabIndex: number) => void;
}

interface StyledTabProps {
  label: string;
  id: string;
  hidden?: boolean;
}

const StyledTab = styled((props: StyledTabProps) => (
  <Tab disableRipple {...props} />
))(({ hidden }) => ({
  color: 'rgba(255, 255, 255, 0.7)',
  '&.Mui-selected': {
    color: '#fff',
  },
  '&:hover': {
    color: '#fff',
  },
  display: hidden ? 'none !important' : '',
}));

const NavBar: React.FC<IProps> = (props: IProps) => {
  const { tabIndex, setTabIndex } = props;
  const { logout, user } = useAuth0();
  const tabIsHidden = !isAdmin(user);

  const onLogoutClicked = (): void => {
    logout({ returnTo: `${window.location.origin}/login` });
  };

  const handleTabChange = (
    _: React.ChangeEvent<{}>,
    newTabIndex: number
  ): void => {
    setTabIndex(newTabIndex);
  };

  return (
    <AppBar position="static">
      <div className={styles['tab-container']}>
        <div className={styles['tabs-div']}>
          {isAdmin(user) && (
            <Tabs
              value={tabIndex}
              onChange={handleTabChange}
              indicatorColor="secondary"
            >
              <StyledTab label="My Library" id="tab0" hidden={tabIsHidden} />
              <StyledTab label="Movie Search - OMDB" id="tab1" />
              <StyledTab label="Movie Search Analysis" id="tab2" />
              <StyledTab label="Settings" id="tab3" />
            </Tabs>
          )}
        </div>
        <div className={styles['logout-button']}>
          <small className={globStyles['margin-r-10']}>
            Welcome, {user && user?.name && user.name.split(' ')[0]}
          </small>
          <Button
            id="logout-button"
            variant="outlined"
            color="secondary"
            onClick={onLogoutClicked}
          >
            Logout
          </Button>
        </div>
      </div>
    </AppBar>
  );
};

export default NavBar;
