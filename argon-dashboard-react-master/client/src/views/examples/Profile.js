// 접속한 사용자의 기존 정보를 수정할 페이지

import React from 'react' 
import { Card, CardHeader, CardBody, Container, Row, Col, Form, FormGroup, Input, Button } from "reactstrap";
import { BsPersonCircle, BsPencilSquare } from 'react-icons/bs' 
import Fade from 'react-reveal/Fade';

function Profile() { 
  // 마지막 접속일자 계산 시 사용
  let today = new Date(); 
  
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
                <h1 className="display-2 text-white">Hello, Douzone !</h1>
                {/* 마지막 접속일자 띄워주기 (현재는 오늘 날짜 가져오도록 임의로 넣어놓음) */}
                <p className="text-white mt-0 mb-5"> 마지막 접속일자 : { today.getFullYear()+"/"+today.getDay() } </p> 
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
                      <Col lg="6">
                        <FormGroup>
                          <label className="form-control-label"> 유저명 </label>
                          <Input className="form-control-alternative" type="text" id="input-username" placeholder="Username" />
                        </FormGroup>
                      </Col>
                      {/* <Col lg="6"> */}
                        {/* DB 이메일 가능할 경우 사용할 Form */}
                        {/* <FormGroup>
                          <label className="form-control-label"> 이메일 주소 </label>
                          <Input className="form-control-alternative" id="input-email" type="email" placeholder="user@douzone.com" />
                        </FormGroup>
                      </Col> */}
                      <Col lg="6">
                        {/* DB 이메일 가능할 경우 사용할 Form */}
                        <FormGroup>
                          <label className="form-control-label"> 이메일 주소 </label>
                          <Input className="form-control-alternative" id="input-pwd" type="password" placeholder="user@douzone.com" />
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