// 1. 유저(전체)를 보여주며 유저 아이디 검색 가능. 유저 정보 확인 가능
// 2. 친구 추가/삭제가 가능한 페이지

import React, { useState, useEffect } from 'react'
import { BsPersonCircle } from 'react-icons/bs'
import { Button, Card, CardHeader, CardBody, Container, Row, Col, } from "reactstrap";
import { MdPersonOff, MdPersonAdd, MdPersonSearch, MdEmojiPeople } from 'react-icons/md' 
import Fade from 'react-reveal/Fade';
import Friend_data from '../examples/Friend_data.js'  
import MyFriend from '../../components/MyFriend.js'   
import Jump  from 'react-reveal/Jump';
import axios from 'axios';
import Cookies from 'universal-cookie';

function Friend(props) {
  // 친구 목록 (Friend_data.js에서 임의 데이터 받아옴)
  const [friend, myFriend] = useState('')  

  const cookie = new Cookies();
  const myName = cookie.get("myname");
  
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
        <Container style={{ align: 'right' }}>
          <Row>
            <Col md="12">
              <Jump>
                <div style={{textAlign: 'right'}}>
                  <MyFriend friend={friend} />
                </div>
              </Jump>
              <div style={{textAlign: 'center'}}>
                {/* 로그인한 유저명 보여주기 */}
                <h1 className="display-2 text-white">Hello, {myName} !</h1>
                <p className="text-white mt-0 mb-5"> 당신의 친구를 찾아보세요 </p>
                {/* 검색 */}
                <input className="id_search" type="text" placeholder="유저 아이디 검색" autoFocus 
                  onChange={ e => { myFriend(e.target.value) }}
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
            Friend_data.filter( (val) => {
              if(friend=="") { return val }
              else if(val.user_id.toLowerCase().includes(friend.toLowerCase())) { return val }
            }).map( (val, i) => {
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
                              {/* 이미지가 없을 경우 보여줄 아이콘 -> 반응형으로 작업(가운데로) 필요 */}
                              <BsPersonCircle size={ 70 } /> 
                              <img alt="..." className="rounded-circle" 
                                src={ require("../../assets/img/theme/team-4-800x800.jpg").default }
                              />
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
                          <h3> { val.user_id } </h3>
                          {/* user의 가입일자 */}
                          <div className="h5 font-weight-300"> { val.join_date } </div>
                          <hr className="my-4" />
                          <div className="h5 mt-4"> { val.user_email } </div>
                          {/* user 자기소개 */}
                          <div> { val.introd } </div>
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