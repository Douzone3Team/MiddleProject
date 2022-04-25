
import { Link } from "react-router-dom";
// reactstrap components
import React from 'react'
import { UncontrolledCollapse, NavbarBrand, Navbar, NavItem, NavLink, Nav, Container, Row, Col, Media, } from "reactstrap";
import { BsPersonCircle } from 'react-icons/bs'
import logo from '../../assets/img/real/cnn.png'
import Cookies from 'universal-cookie';

const AdminNavbar = (props) => {
  const cookie = new Cookies();
  const myName = cookie.get("myname");


  const cookieRemove = () => {
    alert("로그아웃 되었습니다.");
    cookie.remove('user');
  }

  return (
    <>
      <Navbar className="navbar-top navbar-horizontal navbar-dark" expand="md" >
        <Container className="px-4">
          <NavbarBrand href="/">
            <img
              alt="home"
              src={logo}
            />
          </NavbarBrand>
          <button className="navbar-toggler" id="navbar-collapse-main">
            <span className="navbar-toggler-icon" />
          </button>
          <UncontrolledCollapse navbar toggler="#navbar-collapse-main">
            <div className="navbar-collapse-header d-md-none">
              <Row>
                <Col className="collapse-brand" xs="6">
                  <Link to="/">
                    <img
                      alt="..."
                      src={
                        require("../../assets/img/brand/argon-react.png")
                          .default
                      }
                    />
                  </Link>
                </Col>
                <Col className="collapse-close" xs="6">
                  <button className="navbar-toggler" id="navbar-collapse-main">
                    <span />
                    <span />
                  </button>
                </Col>
              </Row>
            </div>
            <Nav className="ml-auto" navbar>
              {/* <NavItem>
                <NavLink className="nav-link-icon" to="/" tag={Link}>
                  <i className="ni ni-planet" />
                  <span className="nav-link-inner--text">Dashboard</span>
                </NavLink>
              </NavItem> */}
              <NavItem>
                <NavLink className="nav-link-icon" href="/friend"  >
                  <i className="ni ni-circle-08" />
                  <span className="nav-link-inner--text">Friend</span>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink className="nav-link-icon" href="/register" >
                  <i className="ni ni-badge" />
                  <span className="nav-link-inner--text">Register</span>
                </NavLink>
              </NavItem>
              {/* <NavItem>
                <NavLink className="nav-link-icon" to="/login" tag={Link}>
                  <i className="ni ni-key-25" />
                  <span className="nav-link-inner--text">Login</span>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className="nav-link-icon"
                  to="/profile"
                  tag={Link}
                >
                  <i className="ni ni-single-02" />
                  <span className="nav-link-inner--text">Profile</span>
                </NavLink>
              </NavItem> */}
              <NavItem>
                <NavLink className="nav-link-icon" href="/profile" >                  <Media className="align-items-center">
                  <BsPersonCircle size={25} color={'white'} />
                  <Media className="ml-2 d-none d-lg-block">
                    <span className="mb-0 text-sm font-weight-bold">
                      {myName}
                    </span>
                  </Media>
                </Media>
                </NavLink>
              </NavItem>
            </Nav>
          </UncontrolledCollapse>
        </Container>
      </Navbar>
    </>
  );
};

export default AdminNavbar;
