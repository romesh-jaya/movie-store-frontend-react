import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { Button } from '@material-ui/core';
import { useAuth0 } from '@auth0/auth0-react';

import { isAdmin } from '../../utils/AuthUtil';
import * as styles from './navbar.module.css';
import * as globStyles from '../../index.module.css';

interface IProps {
  tabIndex: number;
  handleTabChange: (_: React.ChangeEvent<{}>, newTabIndex: number) => void;
}

const NavBar: React.FC<IProps> = (props: IProps) => {
  const { tabIndex, handleTabChange } = props;
  const { logout, user } = useAuth0();
  const myLibClass =
    (user && user?.email && !isAdmin(user.email) && styles['my-library']) ||
    undefined;

  const onLogoutClicked = (): void => {
    logout({ returnTo: `${window.location.origin}/login` });
  };

  return (
    <AppBar position="static">
      <div>
        <div className={styles['tabs-div']}>
          <Tabs value={tabIndex} onChange={handleTabChange}>
            <Tab
              label="My Library"
              id="tab0"
              classes={{
                root: myLibClass,
              }}
            />
            {user && user?.email && isAdmin(user.email) && (
              <>
                <Tab label="Movie Search - OMDB" id="tab1" />
                <Tab label="Movie Search Analysis" id="tab2" />
                <Tab label="Settings" id="tab3" />
              </>
            )}
          </Tabs>
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
