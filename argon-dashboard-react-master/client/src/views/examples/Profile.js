/* eslint-disable */

// 접속한 사용자의 기존 정보를 수정할 페이지

import React, { useEffect } from 'react' 
import { Card, CardHeader, CardBody, Container, Row, Col, Form, FormGroup, Input, Button } from "reactstrap";
import { BsPersonCircle, BsPencilSquare } from 'react-icons/bs' 
import Fade from 'react-reveal/Fade';
import axios from 'axios';
import Cookies from 'universal-cookie';

function Profile(props) {   
  const cookie = new Cookies();
  const myName = cookie.get("myname");
  const myId = cookie.get("myId");
  
  const loginCheck = async() => {
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
        });
      }
    };
  useEffect(() => {
    loginCheck();
  })
  
  return (
    <> 
      <div className="header pb-8 pt-5 pt-lg-8 d-flex align-items-center"
        style={{ minHeight: "100px", backgroundSize: "cover", backgroundPosition: "center top" }}
      > 
        <span className="mask bg-gradient-default opacity-8" /> 
        <Container>
          <Col lg="12">
            <div className="card-profile-image">
              <a href="#pablo" onClick={(e) => e.preventDefault()}>
                {/* 이미지가 없을 경우 보여줄 아이콘 -> 반응형으로 작업(가운데로) 필요 */}
                {/* 추가 작업 : 이미지 onClick 시 프로필 사진 변경 */}
                <img alt="..." className="rounded-circle" rc={ require("../../assets/img/theme/team-4-800x800.jpg").default } />
              </a>
            </div>
          </Col>
          <Row>
            <Col md="12">
              <div className="search_box" style={{ textAlign: 'center' }}>
                <BsPersonCircle size={120} color={'white'} />
                {/* 로그인한 유저명 보여주기 */}
                <h1 className="display-2 text-white"> { myName } </h1>
                <p className="text-white mt-0 mb-5"> ID : { myId } </p> 
              </div>
            </Col>
          </Row> 
        </Container>
      </div> 

      {/* 로그인한 계정의 정보 변경 카드 */}
      {/* <Container className="mt--7" fluid>   */}
      <Fade bottom duration={ 1500 }>
        <Container className="mt--7" style={{width: '60%'}}>  
          <Col className="order-xl-2 mb-5 mb-xl-0" xl="12">
            <Card className="bg-secondary shadow">
              <Form>
                <CardHeader className="bg-white border-0">
                  <Row className="align-items-center">
                    <Col xs="12">
                      <h3 className="mb-0">My account &nbsp; <BsPencilSquare/>
                        <Button className="float-right" color="primary"  
                          onClick={(e) => e.preventDefault()} size="sm"
                        >저장</Button>  
                      </h3>
                    </Col> 
                  </Row>
                </CardHeader>
              <CardBody>
                  <h6 className="heading-small text-muted mb-4"> User information </h6>
                  <div className="pl-lg-4">
                    <Row>
                      <Col lg="10">
                        <FormGroup>
                          <label className="form-control-label"> 유저명 </label>
                          <Input className="form-control-alternative" id="input-username" type="text" />
                        </FormGroup>
                      </Col> 
                      <Col lg="6">
                        <FormGroup>
                          <label className="form-control-label"> 암호 변경 </label>
                          <Input className="form-control-alternative" id="input-pwd1" type="password1" />
                        </FormGroup>
                      </Col>
                      {/* 위에서 입력한 암호와 값이 같은지 확인 */}
                      <Col lg="6">
                        <FormGroup>
                          <label className="form-control-label"> 암호 확인 </label>
                          <Input className="form-control-alternative" id="input-pwd2" type="password2" />
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
                      <Input className="form-control-alternative" placeholder="안녕하세요" rows="3" type="textarea" />
                    </FormGroup>
                  </div>
              </CardBody>
                </Form>
            </Card>
          </Col>
        </Container>
      </Fade>
    </>
  );
}

export default Profile;