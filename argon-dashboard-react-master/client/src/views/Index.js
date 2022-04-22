import React, { useRef, useState, useEffect } from "react";
import axios from 'axios';
import AuthNavbar from "../components/Navbars/AuthNavbar";
import AdminFooter from "components/Footers/AdminFooter.js";
// node.js library that concatenates classes (strings)

import socket from "../client_socket";

// reactstrap components
import { Form, Input, Button, Card, CardHeader, Table, Container, Row, Col } from "reactstrap";

import Header from "components/Headers/Header.js";

import { event } from "jquery";

import Cookie from 'universal-cookie'
import Cookies from "universal-cookie";


const Index = (props) => {
  const cookie = new Cookie();
  const roomRef = useRef();
  const userRef = useRef();

  const [roomInput, setRoomInput] = useState("");
  const [roomNames, setRoomNames] = useState([]);
  const [nameInput, setNameInput] = useState("")
  const [roomID, setRoomID] = useState("");
  const [userID, setUserID] = useState("");
  const [err, setErr] = useState(false);
  const [errMsg, setErrMsg] = useState('');

  let roomName = '';
  let userName = '';

  //roomInput 변경
  const onCreateRoom = (event) => {
    event.preventDefault();
    setRoomInput(event.target.value);
  }

  //변경된 roomInput을 배열에 저장
  const onRoomList = (event) => {

    loginCheck();
    
    //새로고침 방지
    event.preventDefault();

    //방 제목을 입력하지 않을 경우 alert창
    if (roomInput.length <= 1) {
      alert("방 제목을 입력해주세요.")
      return false
    } else {

      //creatroom//////////////////
      const url = '/api/createRoom';
      let getRoomCode;
    try {
      const datas = { roomName: roomInput }
      // console.log(roomInput);
      axios.post(url, datas).then((Response) => {

        console.log(Response);
      }).catch((ex) => {
        console.log(ex);
      })

    } catch (error) {
      console.log(error);
    }
    ///////////////

      setRoomNames((currentArray) => [...currentArray, roomInput]); //배열에 roomName 추가
      setRoomInput(" "); //input창 초기화 
    }
  }

  //로그인 정보 확인
  const loginCheck = () => {
    if (!cookie.get('user')) {  //쿠키가 없을때 로그인 페이지로 강제로 이동시킴
      alert("로그인을 해주세요");
      props.history.push("/login");
    }
    else { //쿠키가 있으면 쿠키 정보 검증
      const url = "/api/loginCheck";
      const boolean = true;
      axios.post(url).then((response) => { //서버에 암호화된 쿠키 정보 전달
        console.log(response.data); //서버의 검증에서 받아온 true false;
        if (!response.data) { //false 라면 잘못된 쿠키이므로 다시 로그인시킴
          cookie.remove('user');
          alert("다시 로그인 해주세요.");
          props.history.push('/login');
        }
      }).catch((ex) => {
        console.log(ex);
      })
    }
  }


  const userNameSet = (event) => {
    event.preventDefault();
    setNameInput(event.target.value);
  }
  const onUserName = (event) => {
    event.preventDefault();
    setUserID(nameInput)
    setNameInput("");
  }


  useEffect(() => {
    loginCheck(); //로그인 정보 쿠키 체크
    socket.on('FE-error-user-exist', ({ error }) => {
      if (!error) { //에러가 없으면
        const roomName = roomID;
        const userName = userID;

        sessionStorage.setItem('user', userName);
        props.history.push(`/room/${roomName}`); // roomName으로 push
      } else {
        setErr(error);
        setErrMsg('User name already exist');
      }
    });
  }, [props.history, roomID, userID]);


  function clickJoin(item) {
    /* roomRef.current.value = item; */
    setRoomID(item)
    const roomName = roomID;
    const userName = userID;



    if (!roomName || !userName) {
      setErr(true);
      setErrMsg('Not found roomName');
    } else {
      socket.emit('BE-check-user', { roomId: roomName, userName });
    }


  };


  return (
    <div className="main-content">
      {/* <div className="main-content"> */}
      <AuthNavbar />
      <Header />
      {/* Page content */}
      <Container className="mt--7" fluid style={{ minHeight: '383px' }}>
        <Row className="mt-5">
          <Col className="mb-5 mb-xl-0" >
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center" >
                  {/* <Col className="col-sm-5"> */}
                  <Col className="">
                    <h3 className="mb-0">방 목록</h3>
                  </Col>
                  <Col>
                    <form id="form1" onSubmit={onRoomList}>
                      <Card>
                        <CardHeader className="border-0">
                          <Row className="align-items-center">
                            <div className="col text-right">
                              <input className="text-left" value={roomInput} type="text" id="roomName"
                                ref={roomRef} placeholder="방 이름" autoFocus onChange={onCreateRoom} style={{ width: "80%", border: "none" }}
                              />
                              <Button color="primary" size="sm" type="submit" form="form1" >방 생성</Button>
                            </div>
                          </Row>
                        </CardHeader>
                      </Card>
                    </form>
                  </Col>
                  <Col className="" >
                    {/* roomName Input */}
                    <Form id="form1" onSubmit={onRoomList} >
                      <Input className="text-right" value={roomInput} type="text" required
                        ref={roomRef} placeholder="방 이름을 입력한 후에 Enter!" onChange={onCreateRoom} />
                    </Form>
                  </Col>

                  <Row>
                    {/* nickName Input */}
                    <Form onSubmit={onUserName}>
                      <Input className="text-right" value={nameInput} type="text" required
                        ref={userRef} placeholder="닉네임을 입력한 후에 Enter!" onChange={userNameSet} />
                    </Form>

                  </Row>
                </Row>
              </CardHeader>
              <Table hover className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th >방 이름</th>
                    <th scope="col"> </th>
                    <th scope="col">참여인원</th>
                    <th scope="col"> </th>
                  </tr>
                </thead>
                <tbody>
                  {roomNames.map((item, index) => ( //map함수 이용, 저장된 roomName으로 테이블 row 생성
                    <tr key={index}>
                      <th >{item}</th>
                      <td> </td>
                      <td> </td>
                      <td><Button onClick={() => clickJoin(item)} color="primary" size="sm">참여</Button></td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card>
          </Col>
        </Row>
      </Container>
      <Container fluid  >
        <AdminFooter />
      </Container>
    </div>
  );
};

export default Index;
