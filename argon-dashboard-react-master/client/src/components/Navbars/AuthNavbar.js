
import { Link } from "react-router-dom";
// reactstrap components
import React, { useEffect } from 'react'
import { UncontrolledCollapse, NavbarBrand, Navbar, NavItem, NavLink, Nav, Container, Row, Col, DropdownItem, DropdownMenu, UncontrolledDropdown, DropdownToggle, Media, } from "reactstrap";
import { FaUserFriends } from "react-icons/fa";
import { BsPersonCircle } from 'react-icons/bs'
import axios from 'axios';
import Cookies from 'universal-cookie';

const AdminNavbar = (props) => {
  const cookie = new Cookies();
  const myName = cookie.get("myname");
  const myId = cookie.get("myId");

  const cookieRemove = () => {
    alert("로그아웃 되었습니다.");
    cookie.remove('user');
  }

  return (
    <>
      <Navbar className="navbar-top navbar-horizontal navbar-dark" expand="md" >
        <Container className="px-4">
          <NavbarBrand to="/" tag={Link}>
            <img
              alt="home"
              src={
                require("../../assets/img/brand/argon-react-white.png").default
              }
            /> 3Team
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
                <NavLink className="nav-link-icon" to= "/friend" tag={Link} >
                  <i className="ni ni-circle-08" />
                  <span className="nav-link-inner--text">Friend</span>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink className="nav-link-icon" to="/register" tag={Link} >
                  <i className="ni ni-badge" />
                  <span className="nav-link-inner--text">Register</span>
                </NavLink>
              </NavItem>
              <NavItem>
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
              </NavItem>
              <Nav className="align-items-center d-none d-md-flex" navbar>
                <UncontrolledDropdown nav>
                  <DropdownToggle className="pr-0" nav>
                    <Media className="align-items-center">
                      {/* <span className="avatar avatar-sm rounded-circle">
                        <img
                          alt="..."
                          src={
                            require("../../assets/img/theme/team-4-800x800.jpg")
                              .default
                          }
                        />
                      </span> */}
                      <BsPersonCircle size={25} color={'white'} />
                      <Media className="ml-2 d-none d-lg-block">
                        <span className="mb-0 text-sm font-weight-bold">
                          {myName}
                        </span>
                      </Media>
                    </Media>
                  </DropdownToggle>
                  <DropdownMenu className="dropdown-menu-arrow" right>
                    <DropdownItem className="noti-title" header tag="div">
                      <h6 className="text-overflow m-0">Welcome!</h6>
                    </DropdownItem>
                    <DropdownItem to="/profile" tag={Link}>
                      <i className="ni ni-single-02" />
                      <span>My profile</span>
                    </DropdownItem>
                    <DropdownItem to="/profile" tag={Link}>
                      {/* <i className="ni ni-calendar-grid-58" />
                      <i className="ni ni-calendar-grid-58" /> */}
                      <FaUserFriends />
                      <span>Friends</span>
                    </DropdownItem>
                    <DropdownItem to="/admin/user-profile" tag={Link}>
                      <i className="ni ni-settings-gear-65" />
                      <span>Settings</span>
                    </DropdownItem>
                    {/* <DropdownItem to="/admin/user-profile" tag={Link}>
                      <i className="ni ni-support-16" />
                      <span>Support</span>
                    </DropdownItem> */}
                    <DropdownItem divider />
                    <DropdownItem href="#pablo" onClick={(e) => {e.preventDefault()
                    cookieRemove()}}>
                      <i className="ni ni-user-run" />
                      <span>Logout</span>
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              </Nav>
            </Nav>
          </UncontrolledCollapse>
        </Container>
      </Navbar>
    </>
  );
};

export default AdminNavbar;
