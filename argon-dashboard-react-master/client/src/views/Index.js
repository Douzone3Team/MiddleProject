import React, { useRef, useState, useEffect } from "react";
import axios from 'axios';
import AuthNavbar from "../components/Navbars/AuthNavbar";
import AdminFooter from "components/Footers/AdminFooter.js";
// node.js library that concatenates classes (strings)

import socket from "../client_socket";

// reactstrap components
import { Button, Card, CardHeader,  Table, Container, Row, Col } from "reactstrap";

import Header from "components/Headers/Header.js";
import { v1 as uuid } from "uuid"; 

const Index = (props) => {
  const roomRef = useRef();
  const [roomInput, setRoomInput] = useState("");
  const [roomNames, setRoomNames] = useState([]);
  const userRef = useRef();
  const [err, setErr] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const userUuid = uuid();
  let roomName = '';
  let userName = '';

  //roomInput 변경
  const onCreateRoom = (event) => {
    

    event.preventDefault();
    setRoomInput(event.target.value);
  }

  //변경된 roomInput을 배열에 저장
  const onRoomList = (event) => {
    const url = '/api/createRoom';
    const getData = null;
      try {
        const datas = { roomName: roomInput} 
        console.log(roomInput);
        axios.post(url,datas).then((Response) =>{
          
          // console.log(Response);
        }).catch((ex) => {
          console.log(ex);
        })
        
      }catch (error) {
        console.log(error);
      }
    
    //새로고침 방지
    event.preventDefault(); 
    
    //방 제목을 입력하지 않을 경우 alert창
    if(roomInput.length <= 1) {
      alert("방 제목을 입력해주세요.")
      return false
    } else {
      setRoomNames((currentArray) => [...currentArray, roomInput]); //배열에 roomName 추가
      setRoomInput(" "); //input창 초기화 
    }
  }

  useEffect(() => {
    socket.on('FE-error-user-exist', ({ roomId, userName, error }) => {

      if (!error) { //에러가 없으면
        sessionStorage.setItem('user', userName);
        props.history.push(`/room/${roomId}`); // roomName으로 push
      } else {
        setErr(error);
        setErrMsg('User name already exist');
      }
    });
  }, [props.history]);


  function clickJoin(item) {
    roomRef.current.value = item;
    roomName = item;
    userName = userUuid;

    if (!roomName || !userName) {
      setErr(true);
      setErrMsg('Enter Room Name or User Name');
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
        <Container className="mt--7" fluid style={{minHeight:'383px'}}>
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
                    {/* <Col className="" >  */}
                      {/* roomName Input */}
                      {/* <Form id="form1" onSubmit={onRoomList} >
                        <Input className="text-left" value={roomInput} type="text" id="roomName"
                          ref={roomRef} placeholder="방 이름" onChange={onCreateRoom} md={3} />
                        <Button color="primary" size="sm" type="submit" form="form1" >방 생성</Button>
                      </Form> */}
                    {/* </Col> */}
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
