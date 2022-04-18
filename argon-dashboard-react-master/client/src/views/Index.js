import { useRef, useState, useEffect } from "react";
// node.js library that concatenates classes (strings)

import socket from "../client_socket"

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
import { Link } from "react-router-dom";
// import CreateRoom from "components/CreateRoom.js";


const Index = (props) => {
  const roomRef = useRef();
  const [roomName, setRoomName] = useState("");
  const [roomNames, setRoomNames] = useState([]);
  const userRef = useRef();
  const [err, setErr] = useState(false);
  const [errMsg, setErrMsg] = useState('');

  //RoomName 변경
  const CreateRoom = (event) => setRoomName(event.target.value);

  //변경된 RoomName을 배열에 저장
  const onSubmit = (event) => {
    // const roomName = roomRef.current.value;

    //새로고침 방지
    event.preventDefault();
    // if (!roomName) {
    //   setErr(true);
    //   setErrMsg('Room Name');
    // } else {
    //   socket.emit('BE-check-user', { roomId: roomName });
    // }
    setRoomNames((currentArray) => [...currentArray, roomName]);//배열에 roomName 추가
    setRoomName(" "); //input창 초기화 -> 작동안함
  }

  useEffect(() => {
    socket.on('FE-error-user-exist', ({ error }) => {
      if (!error) { //에러가 없으면
        const roomName = roomRef.current.value;

        props.history.push(`/room/${roomName}`); // roomName으로 push
      }
    });
  }, [props.history]);

  function clickJoin() {
    const Rooms = roomRef.current.value;;

  }


  return (
    <>
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
                    <Form onSubmit={onSubmit}>
                      <Input className="text-right" size="" type="text" id="roomName"
                        ref={roomRef} placeholder="방 이름" onChange={CreateRoom} />
                      <Button
                        color="primary"
                        value={roomName}
                        size="sm"
                      >방 생성</Button>
                    </Form>
                  </Col>

                </Row>
              </CardHeader>
              <Table hover className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th >방 이름</th>
                    <th scope="col"> </th>
                    <th scope="col"> </th>
                    <th scope="col">참여인원</th>
                  </tr>
                </thead>
                <tbody>
                  {roomNames.map((item, index) => ( //map함수 이용, 저장된 roomName으로 테이블 row 생성
                    <tr key={index}>
                      <th >{item}</th>
                      <td scope="col"> </td>
                      <td scope="col"> </td>
                      <td scope="col"><Button color="primary" size="sm"><Link to={`/room/${roomName}`}>참여</Link></Button></td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Index;
