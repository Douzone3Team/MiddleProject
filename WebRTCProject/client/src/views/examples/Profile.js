/* eslint-disable */
// 사용자의 기존 정보를 변경할 페이지

import { Link } from "react-router-dom";
import React, { useEffect, useState } from 'react'
import {
  UncontrolledCollapse, Navbar, NavItem, NavLink, Nav, Container, Row, Col, DropdownItem, DropdownMenu, UncontrolledDropdown, DropdownToggle, Media,
  Card, CardHeader, CardBody, Form, FormGroup, Input, Button, NavbarBrand
} from "reactstrap";
// import { Card, CardHeader, CardBody, Container, Row, Col, Form, FormGroup, Input, Button, NavbarBrand } from "reactstrap";
import { BsPersonCircle, BsPencilSquare } from 'react-icons/bs'
import Fade from 'react-reveal/Fade';
// import AuthNavbar from "components/Navbars/AuthNavbar";
import AdminFooter from "components/Footers/AdminFooter.js";
import axios from 'axios';
import Cookies from 'universal-cookie';
import { FaUserFriends } from "react-icons/fa";
import logo from '../../assets/img/real/cnn.png'
// import { BsPersonCircle } from 'react-icons/bs'

function Profile(props) {
  const cookie = new Cookies();
  const myName = cookie.get("myname");
  const myId = cookie.get("myId");
  const [myPass, setPass] = useState("");
  const [myInfo, setMyInfo] = useState("");

  const [inputPass, setInputPass] = useState("");
  const [inputPass2, setInputPass2] = useState("");
  const [inputName, setInputName] = useState("");
  const [inputInfo, setInputInfo] = useState("");
  const loadProfile = async () => {
    const url = '/api/loadProfile'
    await axios.post(url).then((response) => {
      console.log(response.data);
      const { u_pass, u_info } = response.data[0];
      console.log(u_pass + " " + u_info);
      setPass(u_pass);
      setMyInfo(u_info);
    }
    ).catch((ex) => console.log(ex));
  }
  const loginCheck = async () => {
    if (!cookie.get("user")) {
      //쿠키가 없을때 로그인 페이지로 강제로 이동시킴
      alert("로그인을 해주세요");
      props.history.push("/login");
    } else {
      //쿠키가 있으면 쿠키 정보 검증
      const url = "/api/loginCheck";
      const boolean = true;
      await axios
        .post(url)
        .then((response) => {
          //서버에 암호화된 쿠키 정보 전달
          console.log(response.data); //서버의 검증에서 받아온 true false;
          if (!response.data) {
            //false 라면 잘못된 쿠키이므로 다시 로그인시킴
            cookie.remove("user");
            alert("다시 로그인 해주세요.");
            props.history.push("/login");
          }
        })
        .catch((ex) => {
          console.log(ex);
        }
        );
    }
  };
  const handleName = (e) => {
    console.log(e.target.value);
    setInputName(e.target.value);
  }
  const handlePass = (e) => {
    console.log(e.target.value);
    setInputPass(e.target.value);
  }
  const handlePass2 = (e) => {
    console.log(e.target.value);
    setInputPass2(e.target.value);
  }
  const handleInfo = (e) => {
    setInputInfo(e.target.value);
  }
  const profileUpdate = async () => {
    const url = '/api/updateProfile'

    const data = { u_name: { inputName }, u_pass: { inputPass }, u_info: { inputInfo } }
    if (inputPass === inputPass2) {
      console.log("같음");
      await axios.post(url, data).then((response) => {
        alert("변경되었습니다.");

      }).catch((ex) => { })
    } else {
      alert("비밀번호를 확인해주세요");
    }

  }
  useEffect(() => {
    loginCheck();
    loadProfile();
  })

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
        {/* <NavbarBrand to="/" tag={Link}>
          <img
            alt="home"
            src={
              require("../../assets/img/brand/argon-react-white.png").default
            }
          /> 3Team
        </NavbarBrand> */}

        <span className="mask bg-gradient-default opacity-8" />

        <Container>
          <Col lg="12">
            <div className="card-profile-image">
              {/* <a href="#pablo" onClick={(e) => e.preventDefault()}>  
                <img alt="..." className="rounded-circle" rc={require("../../assets/img/theme/team-4-800x800.jpg").default} />
              </a> */}
            </div>
          </Col>
          <Row>
            <Col md="12">
              <div className="search_box" style={{ textAlign: 'center' }}>
                <BsPersonCircle size={120} color={'white'} />
                {/* 로그인한 유저명 보여주기 */}
                <h1 className="display-2 text-white"> {myName} </h1>
                <p className="text-white mt-0 mb-5"> ID : {myId} </p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* 로그인한 계정의 정보 변경 카드 */}
      <Fade bottom duration={1500}>
        <Container className="mt--7" style={{ width: '60%' }}>
          <Col className="order-xl-2 mb-5 mb-xl-0" xl="12">
            <Card className="bg-secondary shadow">
              <Form>
                <CardHeader className="bg-white border-0">
                  <Row className="align-items-center">
                    <Col xs="12">
                      <h3 className="mb-0">My account &nbsp; <BsPencilSquare />
                        <Button className="float-right" color="primary"
                          onClick={(e) => {
                            e.preventDefault()
                            profileUpdate()
                          }} size="sm"
                        >저장</Button>
                      </h3>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  <h6 className="heading-small text-muted mb-4"> User information </h6>
                  <div className="pl-lg-4">
                    {/* <Row> 
                      <Col lg="6">
                        <FormGroup>
                          <label className="form-control-label"> 유저명 </label>
                          <Input className="form-control-alternative" id="input-username" type="text"
                          placeholder = {myName} value={inputName} onChange={handleName}  />
                        </FormGroup>
                      </Col> 
                    </Row>   */}
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label className="form-control-label"> 비밀번호 </label>
                          <Input className="form-control-alternative" id="input-pwd1" type="password1"
                            placeholder={myPass} value={inputPass} onChange={handlePass} />
                        </FormGroup>
                      </Col>
                      {/* 위에서 입력한 비밀번호 값이 같은지 확인 */}
                      <Col lg="6">
                        <FormGroup>
                          <label className="form-control-label"> 비밀번호 확인 </label>
                          <Input className="form-control-alternative" value={inputPass2} id="input-pwd2" type="password2"
                            onChange={handlePass2} />
                        </FormGroup>
                      </Col>
                    </Row>
                  </div>
                  <hr className="my-4" />
                  {/* Description */}
                  <h6 className="heading-small text-muted mb-4">About me</h6>
                  <div className="pl-lg-4">
                    <FormGroup>
                      <label className="form-control-label">인사말</label>
                      <Input className="form-control-alternative" rows="3" type="textarea" value={inputInfo}
                        placeholder={myInfo} onChange={handleInfo} />
                    </FormGroup>
                  </div>
                </CardBody>

              </Form>
            </Card>
          </Col>
        </Container>
      </Fade>
      <Container fluid>
        <AdminFooter />
      </Container>

    </>
  );
}

export default Profile;