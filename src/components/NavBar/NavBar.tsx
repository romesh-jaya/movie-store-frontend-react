import React, { ReactNode, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { styled } from '@mui/material';
import Button from '@mui/material/Button';
import { useAuth0 } from '@auth0/auth0-react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import { isAdmin } from '../../utils/AuthUtil';
import styles from './navbar.module.css';
import SettingsIcon from '@mui/icons-material/Settings';
import { cartItems } from '../../state/cart';
import { useNavigate } from 'react-router-dom';

interface IProps {
  tabIndex: number;
  setTabIndex: (newTabIndex: number) => void;
}

interface StyledTabProps {
  label: ReactNode;
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
  const [anchorElMenu, setAnchorElMenu] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const menuOpen = Boolean(anchorElMenu);

  const openMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElMenu(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorElMenu(null);
  };

  const { logout, user } = useAuth0();
  const cartItemsLength = cartItems.use().length;

  const onLogoutClicked = (): void => {
    logout({ returnTo: `${window.location.origin}/login` });
  };

  const onMySubscriptionsClicked = (): void => {
    handleCloseMenu();
    navigate('/my-subscriptions');
  };

  const handleTabChange = (
    _: React.ChangeEvent<{}>,
    newTabIndex: number
  ): void => {
    setTabIndex(newTabIndex);
  };

  // Note: the tabs must always be present in the DOM, in order to find the correct tabIndex
  // So we use a strategy of hiding the unneccessary ones
  return (
    <AppBar position="static">
      <div className={styles['tab-container']}>
        <div className={styles['tabs-div']}>
          <Tabs
            value={tabIndex}
            onChange={handleTabChange}
            indicatorColor="secondary"
          >
            <StyledTab label="Movie Library" id="tab0" />
            <StyledTab
              label="Movie Search - OMDB"
              id="tab1"
              hidden={!isAdmin(user)}
            />
            <StyledTab
              label="Movie Search Analysis"
              id="tab2"
              hidden={!isAdmin(user)}
            />
            <StyledTab label="Settings" id="tab3" hidden={!isAdmin(user)} />
            <StyledTab
              label={
                <div>
                  Cart
                  {cartItemsLength > 0 && (
                    <span className={styles['number-items']}>
                      {cartItemsLength}
                    </span>
                  )}
                </div>
              }
              id="tab4"
              hidden={isAdmin(user)}
            />
          </Tabs>
        </div>
        <div className={styles['cog-wheel']}>
          <Button color="secondary" onClick={openMenu}>
            <SettingsIcon />
          </Button>
          <Menu
            anchorEl={anchorElMenu}
            open={menuOpen}
            onClose={handleCloseMenu}
          >
            <MenuItem
              disabled
              classes={{
                root: styles['welcome-message'],
              }}
            >
              Welcome, {user && user?.name && user.name.split(' ')[0]}
            </MenuItem>
            {!isAdmin(user) && (
              <MenuItem onClick={onMySubscriptionsClicked}>
                My subscriptions
              </MenuItem>
            )}
            <MenuItem onClick={onLogoutClicked}>Logout</MenuItem>
          </Menu>
        </div>
      </div>
    </AppBar>
  );
};

export default NavBar;
