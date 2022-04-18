import { useRef, useState, useEffect } from "react";
// node.js library that concatenates classes (strings)

import socket from "../client_socket"

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Input,
  Table,
  Container,
  Row,
  Col,
  CardTitle,
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

  const CreateRoom = (event) => setRoomName(event.target.value);
  const onSubmit = (event) => {
    // const roomName = roomRef.current.value;
    event.preventDefault();
    // if (!roomName) {
    //   setErr(true);
    //   setErrMsg('Room Name');
    // } else {
    //   socket.emit('BE-check-user', { roomId: roomName });
    // }
    setRoomNames((currentArray) => [...currentArray, roomName]);
    setRoomName(" ");
  }

  useEffect(() => {
    socket.on('FE-error-user-exist', ({ error }) => {
      if (!error) {
        const roomName = roomRef.current.value;

        props.history.push(`/room/${roomName}`);
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
        <Row>
          <Col lg="6" xl="3">
            <Card className="card-stats mb-4 mb-xl-0">
              <CardBody>
                <Row>
                  <div className="col">
                    <CardTitle
                      tag="h5"
                      className="text-uppercase text-muted mb-0"
                    >
                      Traffic
                    </CardTitle>
                    <span className="h2 font-weight-bold mb-0">
                      350,897
                    </span>
                  </div>
                  <Col className="col-auto">
                    <div className="icon icon-shape bg-danger text-white rounded-circle shadow">
                      <i className="fas fa-chart-bar" />
                    </div>
                  </Col>
                </Row>
                <p className="mt-3 mb-0 text-muted text-sm">
                  <span className="text-success mr-2">
                    <i className="fa fa-arrow-up" /> 3.48%
                  </span>{" "}
                  <span className="text-nowrap">Since last month</span>
                </p>
              </CardBody>
            </Card>
          </Col>
          <Col lg="6" xl="3">
            <Card className="card-stats mb-4 mb-xl-0">
              <CardBody>
                <Row>
                  <div className="col">
                    <CardTitle
                      tag="h5"
                      className="text-uppercase text-muted mb-0"
                    >
                      New users
                    </CardTitle>
                    <span className="h2 font-weight-bold mb-0">2,356</span>
                  </div>
                  <Col className="col-auto">
                    <div className="icon icon-shape bg-warning text-white rounded-circle shadow">
                      <i className="fas fa-chart-pie" />
                    </div>
                  </Col>
                </Row>
                <p className="mt-3 mb-0 text-muted text-sm">
                  <span className="text-danger mr-2">
                    <i className="fas fa-arrow-down" /> 3.48%
                  </span>{" "}
                  <span className="text-nowrap">Since last week</span>
                </p>
              </CardBody>
            </Card>
          </Col>
          <Col lg="6" xl="3">
            <Card className="card-stats mb-4 mb-xl-0">
              <CardBody>
                <Row>
                  <div className="col">
                    <CardTitle
                      tag="h5"
                      className="text-uppercase text-muted mb-0"
                    >
                      Sales
                    </CardTitle>
                    <span className="h2 font-weight-bold mb-0">924</span>
                  </div>
                  <Col className="col-auto">
                    <div className="icon icon-shape bg-yellow text-white rounded-circle shadow">
                      <i className="fas fa-users" />
                    </div>
                  </Col>
                </Row>
                <p className="mt-3 mb-0 text-muted text-sm">
                  <span className="text-warning mr-2">
                    <i className="fas fa-arrow-down" /> 1.10%
                  </span>{" "}
                  <span className="text-nowrap">Since yesterday</span>
                </p>
              </CardBody>
            </Card>
          </Col>
          <Col lg="6" xl="3">
            <Card className="card-stats mb-4 mb-xl-0">
              <CardBody>
                <Row>
                  <div className="col">
                    <CardTitle
                      tag="h5"
                      className="text-uppercase text-muted mb-0"
                    >
                      Performance
                    </CardTitle>
                    <span className="h2 font-weight-bold mb-0">49,65%</span>
                  </div>
                  <Col className="col-auto">
                    <div className="icon icon-shape bg-info text-white rounded-circle shadow">
                      <i className="fas fa-percent" />
                    </div>
                  </Col>
                </Row>
                <p className="mt-3 mb-0 text-muted text-sm">
                  <span className="text-success mr-2">
                    <i className="fas fa-arrow-up" /> 12%
                  </span>{" "}
                  <span className="text-nowrap">Since last month</span>
                </p>
              </CardBody>
            </Card>
          </Col>
        </Row>
        {/* <Row>
          <Col className="mb-5 mb-xl-0" xl="8">
            <video autoPlay playsInline src=""></video>
          </Col>
          <Col xl="4">
          </Col>
        </Row> */}
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
                  {roomNames.map((item, index) => (
                    <tr key={index}>
                      <th >{item}</th>
                      <td><Button color="primary" size="sm"><Link to={`/room/${roomName}`}>참여</Link></Button></td>
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
