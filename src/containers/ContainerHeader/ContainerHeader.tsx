import React from 'react';
import { useLocation } from 'react-router';

import logo from '../../assets/img/movie.svg';
import styles from './containerHeader.module.scss';
import Navbar from 'react-bootstrap/esm/Navbar';
import Container from 'react-bootstrap/esm/Container';
import NavDropdown from 'react-bootstrap/esm/NavDropdown';
import Nav from 'react-bootstrap/esm/Nav';
import { isAdmin } from '../../utils/AuthUtil';
import { useAuth0 } from '@auth0/auth0-react';
import { GearFill } from 'react-bootstrap-icons';

/*
interface IProps {
  tabIndex: number;
  setTabIndex: (newTabIndex: number) => void;
}
*/

const ContainerHeader: React.FC = () => {
  const location = useLocation();
  const { user, logout } = useAuth0();

  const dontShowNavBar =
    location.pathname.includes('transaction-result') ||
    location.pathname.includes('checkout') ||
    location.pathname.includes('my-subscriptions') ||
    location.pathname.includes('login');

  const onLogoutClicked = (): void => {
    logout({ returnTo: `${window.location.origin}/login` });
  };

  return (
    <>
      <Navbar variant="dark" bg="primary" collapseOnSelect expand="md">
        <Container>
          <Navbar.Brand href="#home">
            <img
              src={logo}
              style={{
                filter:
                  'invert(100%) sepia(2%) saturate(7444%) hue-rotate(290deg) brightness(108%) contrast(97%)',
              }}
              height="50px"
              alt="movies"
              className={styles.logo}
            />
            <div>Ultra Movie Shop</div>
          </Navbar.Brand>
          {!dontShowNavBar && (
            <Navbar.Collapse>
              <Nav className="me-auto">
                <Nav.Link eventKey="/">Home</Nav.Link>
                {!isAdmin(user) && (
                  <Nav.Link eventKey="/my-cart">Cart</Nav.Link>
                )}
                {isAdmin(user) && (
                  <Nav.Link eventKey="/movie-search-omdb">
                    Movie Search - OMDB
                  </Nav.Link>
                )}
                <NavDropdown title={<GearFill />}>
                  <NavDropdown.Item disabled className="fs-6">
                    Welcome, {user && user?.name && user.name.split(' ')[0]}
                  </NavDropdown.Item>
                  {!isAdmin(user) && (
                    <NavDropdown.Item eventKey="/my-subscriptions">
                      My subscriptions
                    </NavDropdown.Item>
                  )}
                  {isAdmin(user) && (
                    <NavDropdown.Item eventKey="/movie-search-analysis">
                      Movie Search Analysis
                    </NavDropdown.Item>
                  )}
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={onLogoutClicked}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              </Nav>
            </Navbar.Collapse>
          )}
        </Container>
      </Navbar>
    </>
  );
};

export default ContainerHeader;
