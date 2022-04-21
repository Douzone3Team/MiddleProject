import React, { useRef, useState, useEffect } from "react";
import AuthNavbar from "../components/Navbars/AuthNavbar";
import AdminFooter from "components/Footers/AdminFooter.js";
// node.js library that concatenates classes (strings)

import socket from "../client_socket";

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  Input,
  Table,
  Container,
  Row,
  Col,
  Form,
} from "reactstrap";

import Header from "components/Headers/Header.js";
import { event } from "jquery";




const Index = (props) => {
  const roomRef = useRef();
  const userRef = useRef();
  const [roomInput, setRoomInput] = useState("");
  const [roomNames, setRoomNames] = useState([]);
  const [nameInput, setNameInput] = useState("")
  const [roomID, setRoomID] = useState("");
  const [userID, setUserID] = useState("");
  const [err, setErr] = useState(false);
  const [errMsg, setErrMsg] = useState('');





  //roomInput 변경
  const onCreateRoom = (event) => {
    event.preventDefault();
    setRoomInput(event.target.value);
  }

  //변경된 roomInput을 배열에 저장
  const onRoomList = (event) => {
    //새로고침 방지
    event.preventDefault();
    setRoomNames((currentArray) => [...currentArray, roomInput]);//배열에 roomName 추가
    setRoomInput(" "); //input창 초기화
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
    <>
      <div className="main-content">
        <AuthNavbar />
        <Header />
        {/* Page content */}
        <Container className="mt--7" fluid>
          <Row className="mt-5">
            <Col className="mb-5 mb-xl-0" >
              <Card className="shadow">
                <CardHeader className="border-0">
                  <Row className="align-items-center" >
                    <Col className="col-sm-5">
                      <h3 className="mb-0">방 목록</h3>
                    </Col>
                    <Col className="" >
                      {/* roomName Input */}
                      <Form id="form1" onSubmit={onRoomList} >
                        <Input className="text-right" value={roomInput} type="text" required
                          ref={roomRef} placeholder="방 이름을 입력한 후에 Enter!" onChange={onCreateRoom} />
                      </Form>
                    </Col>
                  </Row>
                  <Row>
                    {/* nickName Input */}
                    <Form onSubmit={onUserName}>
                      <Input className="text-right" value={nameInput} type="text" required
                        ref={userRef} placeholder="닉네임을 입력한 후에 Enter!" onChange={userNameSet} />
                    </Form>
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
        <Container fluid>
          <AdminFooter />
        </Container>
      </div>
    </>
  );
};

export default Index;
