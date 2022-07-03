import React from 'react';
import { useLocation } from 'react-router';

import logo from '../../assets/img/movie.svg';
import styles from './containerHeader.module.scss';
import Navbar from 'react-bootstrap/esm/Navbar';
import Container from 'react-bootstrap/esm/Container';
import NavDropdown from 'react-bootstrap/esm/NavDropdown';
import Nav from 'react-bootstrap/esm/Nav';

/*
interface IProps {
  tabIndex: number;
  setTabIndex: (newTabIndex: number) => void;
}
*/

const ContainerHeader: React.FC = () => {
  const location = useLocation();

  const dontShowNavBar =
    location.pathname.includes('transaction-result') ||
    location.pathname.includes('checkout') ||
    location.pathname.includes('my-subscriptions') ||
    location.pathname.includes('login');

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
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link href="#home">Home</Nav.Link>
                <Nav.Link href="#link">Link</Nav.Link>
                <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                  <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                  <NavDropdown.Item href="#action/3.2">
                    Another action
                  </NavDropdown.Item>
                  <NavDropdown.Item href="#action/3.3">
                    Something
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item href="#action/3.4">
                    Separated link
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
