
import React, { useState, useEffect } from 'react';   

//socekt(server-client)연결
import io from 'socket.io-client';
import TextField from "@material-ui/core/TextField";

// reactstrap components
import Header from "components/Headers/Header.js";
import { Button, Card, CardHeader, CardBody, Container, Row, Col, CardTitle } from "reactstrap";
import { BsCameraVideoFill, BsCameraVideoOffFill, BsFillMicFill, BsFillMicMuteFill } from "react-icons/bs";
import { Dropdown } from 'react-bootstrap'  

const Index = (props) => { 
  const [state, setState] = useState({ message: '', name: ''});
  const [chat, setChat] = useState([]);
  const [participant, setParticipant] = useState(['참여자1', '참여자2', '참여자3', '참여자4'])
  const [message, setMessage] = useState('');
  const [cam, changeCam] = useState(true);
  const [mic, changeMic] = useState(true);
  const [setCam, selectCam] = useState(['mode1_cam', 'mode2_cam', 'mode3_cam']);
  const [setMic, selectMic] = useState(['mode1_mic', 'mode2_mic', 'mode3_mic']);


  //socket 9000번 연결
  const socket = io.connect("http://localhost:4000");

  socket.on("message", (message) => {
    setChat([...chat, message]);
  });
  // 렌더링될때 client(message) 받기
  useEffect(() => {
    socket.on("message", (message) => {
      setChat([...chat, message]);
    });
  });


  const onTextChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };
  // message이벤트 지정하고 message이벤트 보내기
  const onMessageSubmit = (e) => {
    e.preventDefault();
    const { name, message } = state;
    socket.emit("message", { name, message });
    setState({ message: "", name });
  };

  // messgae이벤트 보이기
  const renderChat = () => {
    return chat.map(({ name, message }, index) => (
      <div key={index}>
        <h3>
          {name}: <span>{message}</span>
        </h3>
      </div>
    ));
  };

  function chatting() {
    let newMessage = [...message];
    message.unshift(message);
    setMessage(newMessage);
  }

  // if (window.Chart) {
  //   parseOptions(Chart, chartOptions());
  // }

  // const toggleNavs = (e, index) => {
  //   e.preventDefault();
  //   setActiveNav(index);
  //   setChartExample1Data("data" + index);
  // };

  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        <Row>
          { participant.map((data, i) => {
              return( 
                <Col lg="6" xl="3" key={ data }>
                  <Card className="card-stats mb-4 mb-xl-0">
                    <CardBody >
                      <Row >
                        <div className="col" >
                          <CardTitle tag="h5" className="text-uppercase text-muted mb-0" >{ data }</CardTitle> 
                        </div>
                        {/* <Col className="col-auto"> 
                        </Col> */}
                      </Row>
                      <p className="mt-3 mb-0 text-muted text-sm"> 
                      </p>
                    </CardBody>
                  </Card> <br />
                </Col> 
              )
            })
          } 
        </Row> 
        <Row className="mt-5">
          <Col className="mb-5 mb-xl-0" xl="9">
            <Card className="shadow">
              <CardHeader className="border-0" style={{ height: "550px" }}>
                <Row className="align-items-center">
                  <div className="col text-right">
                    <Col className="col-auto">
                      <div className="icon icon-shape bg-danger text-white rounded-circle shadow" onClick={ () => { changeCam(!cam)} }>
                        { cam === true ? <BsCameraVideoFill /> : <BsCameraVideoOffFill /> }
                      </div>&nbsp;
                      <div className="icon icon-shape bg-danger text-white rounded-circle shadow" onClick={ () => { changeMic(!mic)} }>
                        { mic === true ? <BsFillMicFill /> : <BsFillMicMuteFill /> }
                      </div>
                    </Col>
                  </div>
                </Row>
              </CardHeader>
            </Card>
            <br />
            <div> 
              <Dropdown>
                <Dropdown.Toggle className="mr-4" size="sm">카메라 선택</Dropdown.Toggle> 
                <Dropdown.Menu>
                  { setCam.map( (data, i) => { return ( <Dropdown.Item>{ data }</Dropdown.Item> ) })}
                </Dropdown.Menu>
              </Dropdown>
              <Dropdown>
                <Dropdown.Toggle size="sm">마이크 선택</Dropdown.Toggle>
                <Dropdown.Menu>
                  { setMic.map( (data, i) => { return ( <Dropdown.Item>{ data }</Dropdown.Item> ) })}
                </Dropdown.Menu> 
              </Dropdown>
            </div> 
          </Col> 
          <Col className="mb-5 mb-xl-0" xl="3">
            <Card className="shadow">
              <CardHeader className="border-0" style={{ height: "420px" }}>
                <Row className="align-items-center">
                  <div className="col">받은 메세지</div>
                </Row>
                <Row className="align-items-center">
                  <div className="col text-right">보낸 메세지 {message} </div>
                </Row>
              </CardHeader>
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col text-right">
                    <hr />
                    <input
                      onChange={(e) => {
                        setMessage(e.target.value);
                      }}
                      style={{ width: "80%", border: "none" }}
                    />
                    <Button color="primary" onClick={chatting} size="sm">
                      SEND
                    </Button>
                  </div>
                </Row>
              </CardHeader>
            </Card>
            <div className="card">
              <form onSubmit={onMessageSubmit}>
                <h1>Message</h1>
                <div className="name-field">
                  <TextField
                    name="name"
                    onChange={(e) => onTextChange(e)}
                    value={state.name || ""}
                    label="Name"
                  />
                </div>
                <div>
                  <TextField
                    name="message"
                    onChange={(e) => onTextChange(e)}
                    value={state.message}
                    id="outlined-multiline-static"
                    variant="outlined"
                    label="Message"
                  />
                </div>
                <button>Send Message</button>
              </form>
              <div className="render-chat">
                <h1>Chat log</h1>
                {renderChat()}
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Index;
