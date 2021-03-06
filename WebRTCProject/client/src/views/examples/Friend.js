/* eslint-disable */

// 1. 유저(전체)를 보여주며 유저 아이디 검색 가능. 유저 정보 확인 가능
// 2. 친구 추가/삭제가 가능한 페이지

import React, { useState, useEffect } from 'react'
import { BsPersonCircle } from 'react-icons/bs';
import { FaUserFriends } from "react-icons/fa";
import { Nav, Button, Card, CardHeader, CardBody, Container, Row, Col, Navbar, NavLink, NavbarBrand, UncontrolledCollapse, UncontrolledDropdown, NavItem, DropdownToggle, Media, DropdownItem, DropdownMenu } from "reactstrap";
import { MdPersonOff, MdPersonAdd, MdPersonSearch } from 'react-icons/md'
import Fade from 'react-reveal/Fade';
import Jump from 'react-reveal/Jump';
import { Link } from "react-router-dom";
import Friend_data from '../examples/Friend_data.js'
import MyFriend from '../../components/MyFriend.js'
import axios from 'axios';
import Cookies from 'universal-cookie';
import logo from '../../assets/img/real/cnn.png'

function Friend(props) {
  const [friend, myFriend] = useState('')

  const cookie = new Cookies();
  const myName = cookie.get("myname");


  return (
    <>
      <Navbar className="navbar-top navbar-horizontal navbar-dark" expand="md" style={{ background: '#2E3A5F' }} >
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
                <NavLink className="nav-link-icon" href="/friend" >
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
                <NavLink className="nav-link-icon" href="/profile" >
                  <Media className="align-items-center">
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
      <div className="header pb-8 pt-5 pt-lg-8 d-flex align-items-center"
        style={{ minHeight: "100px", backgroundSize: "cover", backgroundPosition: "center top" }}
      >
        <span className="mask bg-gradient-default opacity-8" />
        <Container style={{ align: 'right' }}>
          <Row>
            <Col md="12">
              <Jump>
                <div style={{ textAlign: 'right' }}>
                  <MyFriend friend={friend} />
                </div>
              </Jump>
              <div style={{ textAlign: 'center' }}>
                <h1 className="display-2 text-white">Hello, {myName} !</h1>
                <p className="text-white mt-0 mb-5"> 당신의 친구를 찾아보세요 </p>
                {/* 검색 */}
                <input className="id_search" type="text" placeholder="유저 아이디 검색" autoFocus
                  onChange={e => { myFriend(e.target.value) }}
                  style={{
                    width: '45%',
                    border: 'solid 7px #5E72E4',
                    borderRadius: '10px',
                    textAlign: 'center'
                  }}
                /> &nbsp; <MdPersonSearch size={35} color={'#fff'} />
              </div><br />
            </Col>
          </Row>
        </Container>
      </div>

      <Container className="mt--7" fluid>
        <Row>
          {/* 유저 검색 */}
          {
            Friend_data.filter((val) => {
              if (friend == "") { return val }
              else if (val.user_id.toLowerCase().includes(friend.toLowerCase())) { return val }
            }).map((val, i) => {
              return (
                <Col className="order-xl-2 mb-5 mb-xl-0" xl="3">
                  <Card className="card-profile shadow">
                    <Fade top cascade>
                      <CardHeader className="text-center border-0 pt-8 pt-md-4 pb-0 pb-md-4">
                        <div className="" style={{ flexDirection: "row-reverse" }}>
                          {/* 만약 친구가 아니라면 초록 버튼(친구추가 버튼)을, 친구라면 빨간 버튼(친구삭제 버튼) 활성화 */}
                          {
                            val.friend === 'Y'
                              ?
                              <Button className="float-right" color="danger"
                                onClick={(e) => e.preventDefault()} size="sm"
                              >
                                <MdPersonOff size={18} />
                              </Button>
                              :
                              <Button className="float-right" color="success"
                                onClick={(e) => e.preventDefault()} size="sm"
                              >
                                <MdPersonAdd size={18} />
                              </Button>
                          }
                        </div>
                      </CardHeader>
                      <Row className="justify-content-center">
                        <Col className="order-lg-2" lg="3">
                          <div className="card-profile-image" xl="12">
                            <a href="#pablo" onClick={(e) => e.preventDefault()}>
                              <BsPersonCircle size={70} />
                            </a>
                          </div>
                        </Col>
                      </Row>
                      <CardBody className="pt-0 pt-md-4">
                        <Row>
                          <div className="profile_img justify-content-center">
                          </div>
                        </Row>
                        {/* user의 정보 */}
                        <div className="text-center">
                          {/* user의 아이디 */}
                          <h3> {val.user_id} </h3>
                          {/* user의 가입일자 */}
                          <div className="h5 font-weight-300"> {val.join_date} </div>
                          <hr className="my-4" />
                          <div className="h5 mt-4"> {val.user_email} </div>
                          {/* user 자기소개 */}
                          <div> {val.introd} </div>
                          <br />
                        </div>
                      </CardBody>
                    </Fade>
                  </Card><br />
                </Col>
              )
            })
          }
        </Row>
      </Container>
    </>
  );
}


export default Friend;
