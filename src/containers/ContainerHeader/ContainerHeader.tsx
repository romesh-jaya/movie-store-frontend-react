import React from 'react';
import { useLocation } from 'react-router';
import { useAuth0 } from '@auth0/auth0-react';
import Navbar from 'react-bootstrap/esm/Navbar';
import Container from 'react-bootstrap/esm/Container';
import Nav from 'react-bootstrap/esm/Nav';
import { GearFill } from 'react-bootstrap-icons';
import { LinkContainer } from 'react-router-bootstrap';

import logo from '../../assets/img/movie.svg';
import styles from './containerHeader.module.scss';
import { isAdmin } from '../../utils/AuthUtil';
import Dropdown from 'react-bootstrap/esm/Dropdown';

const ContainerHeader: React.FC = () => {
  const location = useLocation();
  const { user, logout } = useAuth0();
  const dontShowNavBarPaths = location.pathname.includes('login');

  const onLogoutClicked = (): void => {
    logout({ returnTo: `${window.location.origin}/login` });
  };

  return (
    <>
      <Navbar
        variant="dark"
        bg="primary"
        collapseOnSelect
        expand="sm"
        className="px-2"
      >
        <Container>
          <Navbar.Brand>
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
          {!dontShowNavBarPaths && (
            <>
              <Navbar.Collapse className="ms-3">
                <Nav className="me-auto flex-grow-1">
                  <LinkContainer to="/">
                    <Nav.Link>Home</Nav.Link>
                  </LinkContainer>
                  {!isAdmin(user) && (
                    <LinkContainer to="/my-cart">
                      <Nav.Link>Cart</Nav.Link>
                    </LinkContainer>
                  )}
                  {isAdmin(user) && (
                    <Nav.Link eventKey="/movie-search-omdb">
                      Movie Search - OMDB
                    </Nav.Link>
                  )}
                </Nav>
              </Navbar.Collapse>
              <Dropdown navbar align="end" className={styles['dropdown']}>
                <Dropdown.Toggle>
                  <GearFill />
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item disabled className="fs-6">
                    Welcome, {user && user?.name && user.name.split(' ')[0]}
                  </Dropdown.Item>
                  <LinkContainer to="/">
                    <Dropdown.Item className={styles['menu-item']}>
                      Home
                    </Dropdown.Item>
                  </LinkContainer>
                  {!isAdmin(user) && (
                    <LinkContainer to="/my-cart">
                      <Dropdown.Item className={styles['menu-item']}>
                        Cart
                      </Dropdown.Item>
                    </LinkContainer>
                  )}
                  {isAdmin(user) && (
                    <LinkContainer to="/movie-search-omdb">
                      <Dropdown.Item className={styles['menu-item']}>
                        Movie Search - OMDB
                      </Dropdown.Item>
                    </LinkContainer>
                  )}
                  {!isAdmin(user) && (
                    <LinkContainer to="/my-subscriptions">
                      <Dropdown.Item>My subscriptions</Dropdown.Item>
                    </LinkContainer>
                  )}
                  {isAdmin(user) && (
                    <LinkContainer to="/movie-search-analysis">
                      <Dropdown.Item>Movie Search Analysis</Dropdown.Item>
                    </LinkContainer>
                  )}
                  {isAdmin(user) && (
                    <LinkContainer to="/settings">
                      <Dropdown.Item>Settings</Dropdown.Item>
                    </LinkContainer>
                  )}
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={onLogoutClicked} as="div">
                    Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </>
          )}
        </Container>
      </Navbar>
    </>
  );
};

export default ContainerHeader;
