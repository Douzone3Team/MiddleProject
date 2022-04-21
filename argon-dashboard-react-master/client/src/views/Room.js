import React, { useEffect, useState, useRef } from "react";
import AuthNavbar from "../components/Navbars/AuthNavbar";
import AdminFooter from "components/Footers/AdminFooter.js";
import Peer from "simple-peer";
import styled from "styled-components";
// node.js library that concatenates classes (strings)
import classnames from "classnames";
import Video from "./examples/Video";
import socket from "client_socket";
import { setCookie, getCookie } from '../cookie/cookie';
// reactstrap components
import { Button, Card, CardHeader, CardBody, Container, Row, Col, CardTitle, } from "reactstrap";
// import Cookie from 'universal-cookie';
// const cookie = new Cookie();
import Clock from 'react-live-clock';

// reactstrap components
import Header from "components/Headers/Header.js";
import { BsCameraVideoFill, BsCameraVideoOffFill, BsFillMicFill, BsFillMicMuteFill, } from "react-icons/bs";
import { Dropdown } from "react-bootstrap";
import { monthsShort } from "moment";
// import Friends from '../variables/Friends'

const Room = (props) => {
  //영상
  const currentUser = sessionStorage.getItem("user");
  const [peers, setPeers] = useState([]);
  const [userVideoAudio, setUserVideoAudio] = useState({
    localUser: { video: true, audio: true },
  });
  const [videoDevices, setVideoDevices] = useState([]);
  const peersRef = useRef([]);
  const userVideoRef = useRef();
  const userStream = useRef();
  const roomId = props.match.params.roomId;

  //채팅
  const [msg, setMsg] = useState([]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef();
  const [time, setTime] = useState('');
  let today = new Date();
  let hour = today.getHours();
  let minute = today.getMinutes();

  var dateString = hour + ' : '+ minute;
  // console.log(dateString);

  //다른 참여자의 Cam (임의데이터)
  const [participant, setParticipant] = useState([ "참여자1", "참여자2", "참여자3", "참여자4",]);
  // 화상통화 시 카메라/마이크 끄고 켜기
  const [cam, changeCam] = useState(true);
  const [mic, changeMic] = useState(true);
  // 화상통화 할 카메라/마이크 설정바꾸기
  const [setCam, selectCam] = useState(["mode1_cam", "mode2_cam", "mode3_cam"]);
  const [setMic, selectMic] = useState(["mode1_mic", "mode2_mic", "mode3_mic"]);

  // 렌더링될 때 client(message) 받기 //영상 가져오기
  useEffect(() => {
    if (!getCookie('user')) {
        alert("로그인을 해주세요");
        props.history.push("/login");
      }
    //채팅
    socket.on("FE-receive-message", ({ msg, sender}) => {
      setMsg((msgs) => [...msgs, { sender, msg }]);
    });

    //영상
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      const filtered = devices.filter((device) => device.kind === "videoinput");
      setVideoDevices(filtered);
    });

    // Connect Camera & Mic
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        userVideoRef.current.srcObject = stream;
        userStream.current = stream;

        socket.emit("BE-join-room", { roomId, userName: currentUser });
        socket.on("FE-user-join", (users) => {
          // all users
          const peers = [];
          users.forEach(({ userId, info }) => {
            let { userName, video, audio } = info;

            if (userName !== currentUser) {
              const peer = createPeer(userId, socket.id, stream);

              peer.userName = userName;
              peer.peerID = userId;

              peersRef.current.push({
                peerID: userId,
                peer,
                userName,
              });
              peers.push(peer);

              setUserVideoAudio((preList) => {
                return {
                  ...preList,
                  [peer.userName]: { video, audio },
                };
              });
            }
          });

          setPeers(peers);
        });

        socket.on("FE-receive-call", ({ signal, from, info }) => {
          let { userName, video, audio } = info;
          const peerIdx = findPeer(from);

          if (!peerIdx) {
            const peer = addPeer(signal, from, stream);

            peer.userName = userName;

            peersRef.current.push({
              peerID: from,
              peer,
              userName: userName,
            });
            setPeers((users) => {
              return [...users, peer];
            });
            setUserVideoAudio((preList) => {
              return {
                ...preList,
                [peer.userName]: { video, audio },
              };
            });
          }
        });

        socket.on("FE-call-accepted", ({ signal, answerId }) => {
          const peerIdx = findPeer(answerId);
          peerIdx.peer.signal(signal);
        });

        socket.on("FE-user-leave", ({ userId, userName }) => {
          const peerIdx = findPeer(userId);
          peerIdx.peer.destroy();
          setPeers((users) => {
            users = users.filter((user) => user.peerID !== peerIdx.peer.peerID);
            return [...users];
          });
          peersRef.current = peersRef.current.filter(
            ({ peerID }) => peerID !== userId
          );
        });
      });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [msg]);

  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = (e) => {
    // let nowTime = dateString;
    // 현재시간


    if (e.key === "Enter") {
      const msg = e.target.value;
      console.log(msg);
      
      let nowTime = new Date();
      let sendTime = [...time];
      sendTime.push(nowTime.getHours() + ':' + nowTime.getMinutes())
      // renderChat();
      setTime(sendTime);
      console.log(time);

      if (msg) {
        socket.emit("BE-send-message", { msg, sender: currentUser});
        inputRef.current.value = "";
      }
    }
  };
  

  //영상
  function createPeer(userId, caller, stream) {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      socket.emit("BE-call-user", {
        userToCall: userId,
        from: caller,
        signal,
      });
    });
    peer.on("disconnect", () => {
      peer.destroy();
    });
    return peer;
  }

  function addPeer(incomingSignal, callerId, stream) {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      socket.emit("BE-accept-call", { signal, to: callerId });
    });

    peer.on("disconnect", () => {
      peer.destroy();
    });

    peer.signal(incomingSignal);

    return peer;
  }

  function findPeer(id) {
    return peersRef.current.find((p) => p.peerID === id);
  }

  function createUserVideo(peer, index, arr) {
    return (
      <VideoBox 
        className={`width-peer${peers.length > 8 ? "" : peers.length}`}
        // onClick={expandScreen}
        key={index} 
      >
        {writeUserName(peer.userName)}
        <Video key={index} peer={peer} number={arr.length} />
      </VideoBox>
    );
  }

  function writeUserName(userName, index) {
    if (userVideoAudio.hasOwnProperty(userName)) {
      if (!userVideoAudio[userName].video) {
        return <div key={userName}>{userName}</div>;
      }
    }
  } 

  return (
    <>
      <div className="main-content">
        <AuthNavbar />
        <Header />
        <Container className="mt--7" fluid>
          <Row>
            { participant.map((data, i) => {
              return (
                <Col lg="6" xl="3" key={data}>
                  <Card className="card-stats mb-4 mb-xl-0">
                    <CardBody>
                      <Row>
                        <div className="col" >
                          <CardTitle tag="h5" className="text-uppercase text-muted mb-0" >
                            { data }
                          </CardTitle>
                        </div>
                      </Row>
                    </CardBody>
                  </Card>{" "}
                  <br />
                </Col>
              );
            })}
          </Row>
          <Row className="mt-5">
            <Col className="mb-5 mb-xl-0" xl="9" >
              <Card className="shadow"> 
                <div>
                  <div className="col text-right">

                    <Col className="col-auto">
                      {/* <div
                        className="icon icon-shape bg-danger text-white rounded-circle shadow"
                        onClick={() => {
                          changeCam(!cam);
                        }}
                      >
                        {cam === true ? (
                          <BsCameraVideoFill />
                        ) : (
                          <BsCameraVideoOffFill />
                        )}
                      </div>
                      &nbsp;
                      <div
                        className="icon icon-shape bg-danger text-white rounded-circle shadow"
                        onClick={() => {
                          changeMic(!mic);
                        }}
                      >
                        {mic === true ? (
                          <BsFillMicFill />
                        ) : (
                          <BsFillMicMuteFill />
                        )}
                      </div> */}
                    </Col>

                  </div>
                  <VideoBox
                    className={`width-peer${
                      peers.length > 8 ? "" : peers.length
                    }`}
                  >
                    {userVideoAudio["localUser"].video ? null : (
                      <div>{currentUser}</div>
                    )}
                    <MyVideo
                      ref={userVideoRef}
                      muted
                      autoPlay
                      playsInline
                    ></MyVideo>
                  </VideoBox>
                  {peers &&
                    peers.map((peer, index, arr) =>
                      createUserVideo(peer, index, arr)
                    )}
                </div>
              </Card>
              <br />
              <div>
                <Dropdown>
                  <Dropdown.Toggle className="mr-4" size="sm"> 카메라 선택 </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {setCam.map((data, i) => { return <Dropdown.Item>{ data }</Dropdown.Item>; })}
                  </Dropdown.Menu>
                </Dropdown>
                <Dropdown>
                  <Dropdown.Toggle size="sm">마이크 선택</Dropdown.Toggle>
                  <Dropdown.Menu>
                    {setMic.map((data, i) => { return <Dropdown.Item>{ data }</Dropdown.Item>; })}
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </Col>
            <Col className="mb-5 mb-xl-0" xl="3">
              <Card className="shadow">
                <CardHeader className="border-0" style={{ height: "46vh", overflow: "auto" }}>
                  <div>
                    {msg &&
                      msg.map(({ sender, msg}, idx) => {
                        if (sender !== currentUser) {
                          return (
                            <ChattingOther>
                              <div key={idx}>
                                 {/* <strong>상대방: &nbsp;{msg}   &nbsp;&nbsp;&nbsp;{time[idx]}</strong> */}
                                 <strong>상대방: &nbsp;{msg} &nbsp;&nbsp;&nbsp;  {time[idx]}</strong>
                                 
                              </div>
                            </ChattingOther>
                          );
                        } else {
                          return (
                            <ChattingMe>
                              <div className="col text-right" key={idx}>
                                <strong>{msg}</strong>
                              </div>
                            </ChattingMe>
                          );
                        }
                      })}
                    <div
                      style={{ float: "left", clear: "both" }}
                      ref={messagesEndRef}
                    />

                  </div>

                </CardHeader>
                <CardHeader className="border-0">
                  <Row className="align-items-center">
                    <div className="col text-right">
                      <hr />
                      <input
                        ref={inputRef}
                        onKeyUp={sendMessage}
                        placeholder="Enter your message"
                        style={{ width: "80%", border: "none" }}
                      />
                      <Button color="primary" size="sm" onClick={sendMessage}>SEND</Button>
                    </div>
                  </Row>
                </CardHeader>
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

const MyVideo = styled.video``;

const VideoBox = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  > video {
    top: 0;
    left: 0;
    width: 80vh;
    height: 100%;
  }

  :hover {
    > i {
      display: block;
    }
  }
`;

const ChattingOther = styled.div`
  position: relative;
  margin-bottom: 10px;
  padding: 6px;
  width: 100%;
  height: auto;
  color: black;
  border: 2px solid #5e72e4;
  border-radius: 10px;
  font-size: 5px;
  float: left;


`;
const ChattingMe = styled.div`
  position: relative;
  margin-bottom: 10px;
  padding: 6px;
  width: 100%;
  height: auto;
  color: black;
  border: 2px solid #ccc;
  border-radius: 10px;
  font-size: 5px;
  float: right;
  flex-direction: column-reverse;

`;

export default Room;
