import React, { useEffect, useState, useRef } from "react";
import AuthNavbar from "components/Navbars/AuthNavbar";
import AdminFooter from "components/Footers/AdminFooter.js";
import Peer from "simple-peer";
import styled from "styled-components";
// node.js library that concatenates classes (strings)
import Video from "./examples/Video";
import socket from "client_socket";
import { setCookie, getCookie } from "../cookie/cookie";
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Container,
  Row,
  Col,
  CardTitle,
} from "reactstrap";

//socket(server-client)연결

import TextField from "@material-ui/core/TextField";

// reactstrap components
import Header from "components/Headers/Header.js";

import {
  BsCameraVideoFill,
  BsCameraVideoOffFill,
  BsFillMicFill,
  BsFillMicMuteFill,
} from "react-icons/bs";
import { Dropdown } from "react-bootstrap";

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

  //채팅 메세지에 표시할 시간
  const [time, setTime] = useState("");

  //다른 참여자의 Cam (임의데이터)
  const [participant, setParticipant] = useState([
    "참여자1",
    "참여자2",
    "참여자3",
    "참여자4",
  ]);
  // 화상통화 시 카메라/마이크 끄고 켜기
  const [cam, changeCam] = useState(true);
  const [mic, changeMic] = useState(true);
  // 화상통화 할 카메라/마이크 설정바꾸기
  const [setCam, selectCam] = useState(["mode1_cam", "mode2_cam", "mode3_cam"]);
  const [setMic, selectMic] = useState(["mode1_mic", "mode2_mic", "mode3_mic"]);

  // 렌더링될 때 client(message) 받기 //영상 가져오기
  useEffect(() => {
    if (!getCookie("user")) {
      alert("로그인을 해주세요");
      props.history.push("/login");
    }
    //채팅
    socket.on("FE-receive-message", ({ msg, sender, roomId, time }) => {
      setMsg((msgs) => [...msgs, { sender, msg, time }]);
    });

    navigator.mediaDevices.enumerateDevices().then((devices) => {
      const camera = devices.filter((device) => device.kind === "videoinput");
      setVideoDevices(camera);
      console.log("client : 영상 준비");
    });

    // Connect Camera & Mic
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        console.log(stream);
        userVideoRef.current.srcObject = stream;
        userStream.current = stream;
        console.log("client : 영상출력 ");
        socket.emit("BE-join-room", { roomId, userName: currentUser });
        console.log("client : server에 join message 전송 ");

        socket.on("FE-user-join", (users) => {
          // all users
          console.log("client : server에서 join완료 message ");
          const peers = [];
          users.forEach(({ userId, info }) => {
            let { userName, video, audio } = info;
            console.log(
              "client : server에서 받아온 username과 현재 user을 비교 "
            );
            if (userName !== currentUser) {
              console.log(
                "client : server에서 받아온 username과 현재 user가 다름 "
              );
              console.log("client : 새로운 user 생성 ");
              console.log("createPeer내 BE-call-user message를 server에 전송");
              const peer = createPeer(userId, socket.id, stream);

              peer.userName = userName;
              peer.peerID = userId;

              peersRef.current.push({
                peerID: userId,
                peer,
                userName,
              });
              peers.push(peer);
              console.log("client : user리스트에 추가 ");

              setUserVideoAudio((preList) => {
                return {
                  ...preList,
                  [peer.userName]: { video, audio },
                };
              });
            }
          });
          //useState peer값 변경 -> 전체접속자
          setPeers(peers);
        });

        socket.on("FE-receive-call", async ({ signal, from, info }) => {
          console.log("client : signal과 fe-receive-call message 전달받음  ");
          let { userName, video, audio } = info;
          const peerIdx = await findPeer(from);

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
          console.log("client : server에서 확인 message 받음, 방문 peer 추가");
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

    return () => {
      socket.disconnect();
    };
  }, [currentUser, props.history, roomId]);

  useEffect(() => {
    scrollToBottom();
  }, [msg]);

  //영상
  function createPeer(userId, caller, stream) {
    console.log("client : peer 생성");
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      console.log("client : signal 전송 및 server에 be-call-user 전송");
      socket.emit("BE-call-user", {
        userToCall: userId,
        from: caller,
        signal,
      });
    });
    peer.on("disconnect", () => {
      peer.destroy();
    });
    console.log("client : createPeer에 peer값 리턴");
    return peer;
  }

  function addPeer(incomingSignal, callerId, stream) {
    console.log("client : peer 추가");
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      console.log("client : server로 message와 signal,추가되는 user 전달");
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
      <Col lg="6" xl="3" key={index}>
        <Card className="card-stats mb-4 mb-xl-0">
          <CardBody>
            <Row>
              <div className="col">
                <CardTitle tag="h5" className="text-uppercase mb-0">
                  <VideoBox
                    className={`width-peer${
                      peers.length > 8 ? "" : peers.length
                    }`}
                    // onClick={expandScreen}
                    key={index}
                  >
                    {writeUserName(peer.userName)}

                    <Video key={index} peer={peer} number={arr.length} />
                  </VideoBox>
                </CardTitle>
              </div>
            </Row>
          </CardBody>
        </Card>{" "}
        <br />
      </Col>
    );
  }

  function writeUserName(userName, index) {
    if (userVideoAudio.hasOwnProperty(userName)) {
      if (!userVideoAudio[userName].video) {
        return <div key={userName}>{userName}</div>;
      }
    }
  }

  //채팅
  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = (e) => {
    if (e.key === "Enter") {
      const msg = e.target.value;
      // console.log(msg);

      if (msg) {
        socket.emit("BE-send-message", { roomId, msg, sender: currentUser,time });
        console.log('client에서 받아온 시간: ' +time );
        // 현재시간
        // let nowTime = new Date();
        // let sendTime = [...time];
        // sendTime.push(nowTime.getHours() + ":" + nowTime.getMinutes());
        // // renderChat();
        // setTime(sendTime);

        inputRef.current.value = "";
      }
    }
  };

  return (
    <>
      <div className="main-content">
        <AuthNavbar />
        <Header />
        <Container className="mt--7" fluid>
          <Row>
            {peers &&
              peers.map((peer, index, arr) =>
                createUserVideo(peer, index, arr)
              )}
          </Row>
          <Row className="mt-5">
            <Col className="mb-5 mb-xl-0" xl="9">
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
                </div>
              </Card>
              <br />
              <div>
                <Dropdown>
                  <Dropdown.Toggle className="mr-4" size="sm">
                    {" "}
                    카메라 선택{" "}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {setCam.map((data, i) => {
                      return <Dropdown.Item>{data}</Dropdown.Item>;
                    })}
                  </Dropdown.Menu>
                </Dropdown>
                <Dropdown>
                  <Dropdown.Toggle size="sm">마이크 선택</Dropdown.Toggle>
                  <Dropdown.Menu>
                    {setMic.map((data, i) => {
                      return <Dropdown.Item>{data}</Dropdown.Item>;
                    })}
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </Col>
            <Col className="mb-5 mb-xl-0" xl="3">
              <Card className="shadow">
                <CardHeader
                  className="border-0"
                  style={{ height: "46vh", overflow: "auto" }}
                >
                  <div>
                    {msg &&
                      msg.map(({ sender, msg, time }, idx) => {
                        if (sender !== currentUser) {
                          return (
                            <div key={idx}>
                              <ChattingOther>
                                <strong>
                                  {/* {sender} : &nbsp;{msg} {time[idx]} */}
                                  {sender} : &nbsp;{msg} {time}

                                </strong>
                              </ChattingOther>
                            </div>
                          );
                        } else {
                          return (
                            <ChattingMe>
                              <div className="text-right" key={idx}>
                                <strong>
                                  {/* {time[idx]} {msg} : {sender} */}
                                  {time} {msg} : {sender}
                                </strong>
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
                      <Button color="primary" size="sm">
                        SEND
                      </Button>
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
    width: 40vh;
    height: 80%;
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
  display: block;
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
`;

export default Room;
