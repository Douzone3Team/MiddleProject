import axios from 'axios';
import { useEffect, useState } from "react";
import 'url-search-params-polyfill';
import styled from "styled-components";
import AuthNavbar from "components/Navbars/AuthNavbar";
import AdminFooter from "components/Footers/AdminFooter.js";
import Header from "components/Headers/Header.js";
// import jwt from "jsonwebtoken";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Col,
  Container
} from "reactstrap";
import Cookies from 'universal-cookie';
const cookies = new Cookies();

const Login = (props) => {
  const [id, setId] = useState('');
  const [pass, setPass] = useState('');

  const handleInputId = (e) => {
    setId(e.target.value);
  }

  const handleInputPw = (e) => {
    setPass(e.target.value);
  }

  //login functon
  const handleLogin = async () => {
    console.log("isClicked");
    var isLogin;
    const url = '/api/login';
    try {

      const data = {//입력받은 ID와 PASSWORD
        id: { id },
        pass: { pass },
      }
      console.log(id + " " + pass);
      await axios.post(url, data).then((Response) => {//SERVER에 CLIENTS DATA 전송
        console.log("~~~~~~~~~~~~~~~~");
        console.log(Response);
        console.log(Response.data);
        console.log("~~~~~~~~~~~~~~~~");
        isLogin = Response.data;  //서버에서 DB와 ID PASS 검사후 true false
        console.log("isLogin:" + isLogin);

      }).catch((ex) => {
        console.log(ex);
      })



    } catch (error) {
      console.log(error);
    }
    if (isLogin) {  //true면 로그인후 인덱스로 이동  
      props.history.push("/");
    }
    else {
      alert("아이디나 비밀번호를 확인해주세요")
    }
  }
  return (
    <>
      <div className="main-content">
        <AuthNavbar />
        <Header />
        <Container className="mt--7" fluid>
          <div>
            <Card style={{ width: "30%", height: "80%", margin: "0 auto" }} className="bg-secondary shadow border-0">
              <br />
              <br />
              <i style={{ margin: "0 auto", fontSize: "150px" }} className="ni ni-circle-08" />
              <h1 style={{ fontSize: "50px", margin: "0 auto" }}>Login</h1>
              <br />
              <br />
              <CardBody className="px-lg-5 py-lg-5">
                <Form role="form">
                  <FormGroup className="mb-3">
                    <InputGroup className="input-group-alternative">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="ni ni-email-83" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        placeholder="Email"
                        type="email"
                        autoComplete="new-email"
                        value={id}
                        onChange={handleInputId}

                      />
                    </InputGroup>
                  </FormGroup>
                  <FormGroup>
                    <InputGroup className="input-group-alternative">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="ni ni-lock-circle-open" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        placeholder="Password"
                        type="password"
                        autoComplete="new-password"
                        value={pass}
                        onChange={handleInputPw}
                      />
                    </InputGroup>
                  </FormGroup>
                  <div className="custom-control custom-control-alternative custom-checkbox">
                    <input
                      className="custom-control-input"
                      id=" customCheckLogin"
                      type="checkbox"
                    />
                    <label
                      className="custom-control-label"
                      htmlFor=" customCheckLogin"
                    >
                      <span className="text-muted">Remember me</span>
                    </label>
                  </div>
                  <div className="text-center">
                    <Button onClick={handleLogin} className="my-4" color="primary" type="button">
                      Sign in
                    </Button>
                  </div>
                </Form>
              </CardBody>
            </Card>
            <Row className="mt-3">
              <Col xs="6">
                <a
                  className="text-light"
                  href="#pablo"
                  onClick={(e) => e.preventDefault()}
                >
                  <small>Forgot password?</small>
                </a>
              </Col>
              <Col className="text-right" xs="6">
                <a
                  className="text-light"
                  href="#pablo"
                  onClick={(e) => e.preventDefault()}
                >
                  <small>Create new account</small>
                </a>
              </Col>
            </Row>
          </div>
        </Container>
        <Container fluid>
          <AdminFooter />
        </Container>
      </div>
    </>
  );
};

export default Login;
