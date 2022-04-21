
import React, { useEffect, useState, useRef } from "react";
import AuthNavbar from "../components/Navbars/AuthNavbar";
import AdminFooter from "components/Footers/AdminFooter.js";
import Peer from 'simple-peer';
import styled from 'styled-components';
// node.js library that concatenates classes (strings)
import Video from "./examples/Video";
import socket from "client_socket";


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


//socekt(server-client)연결

import TextField from "@material-ui/core/TextField";

// reactstrap components
import Header from "components/Headers/Header.js";
import { BsCameraVideoFill, BsCameraVideoOffFill, BsFillMicFill, BsFillMicMuteFill } from "react-icons/bs";
import { Dropdown } from 'react-bootstrap'
// import Friends from '../variables/Friends'


const Room = (props) => {
    //영상
    const currentUser = sessionStorage.getItem('user');
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
    const [state, setState] = useState({ message: '', name: '' });
    const [chat, setChat] = useState([]);
    const [time, setTime] = useState('');
    const [participant, setParticipant] = useState(['참여자1', '참여자2', '참여자3', '참여자4'])
    const [cam, changeCam] = useState(true);
    const [mic, changeMic] = useState(true);
    const [setCam, selectCam] = useState(['mode1_cam', 'mode2_cam', 'mode3_cam']);
    const [setMic, selectMic] = useState(['mode1_mic', 'mode2_mic', 'mode3_mic']);

    socket.on("message", (message) => {
        setChat([...chat, message]);
    });
    // 렌더링될 때 client(message) 받기
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

        // 현재시간
        let nowTime = new Date();
        let sendTime = [...time];
        sendTime.push(nowTime.getHours() + ':' + nowTime.getMinutes())
        // renderChat();
        setTime(sendTime);
    };

    // messgae이벤트 보이기
    const renderChat = () => {
        // console.log(chat);
        return (
            chat.map(({ name, message }, index) => (
                <div key={index}>
                    {time[index]}&nbsp;&nbsp; {name}: <span>{message}</span>
                </div>)
            ));
    };


    //영상
    function createPeer(userId, caller, stream) {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream,
        });

        peer.on('signal', (signal) => {
            socket.emit('BE-call-user', {
                userToCall: userId,
                from: caller,
                signal,
            });
        });
        peer.on('disconnect', () => {
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

        peer.on('signal', (signal) => {
            socket.emit('BE-accept-call', { signal, to: callerId });
        });

        peer.on('disconnect', () => {
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
                className={`width-peer${peers.length > 8 ? '' : peers.length}`}
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

    /* const [participant, setParticipant] = useState(['참여자1', '참여자2', '참여자3', '참여자4'])
    const [message, setMessage] = useState('');
    let [cam, changeCam] = useState(true);
    let [mic, changeMic] = useState(true);
  
    function chatting() {
      let newMessage = [...message];
      message.unshift(message);
      setMessage(newMessage);
    } */

    useEffect(() => {
        navigator.mediaDevices.enumerateDevices().then((devices) => {
            const camera = devices.filter((device) => device.kind === 'videoinput');
            setVideoDevices(camera);
            console.log("room0");
        });
        console.log("room1");
        // Connect Camera & Mic
        navigator.mediaDevices
            .getUserMedia({ video: true, audio: true }, console.log("room2"))
            .then((stream) => {
                console.log("room3");
                userVideoRef.current.srcObject = stream;
                userStream.current = stream;

                socket.emit('BE-join-room', { roomId, userName: currentUser });
                socket.on('FE-user-join', (users) => {
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

                socket.on('FE-receive-call', ({ signal, from, info }) => {
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

                socket.on('FE-call-accepted', ({ signal, answerId }) => {
                    const peerIdx = findPeer(answerId);
                    peerIdx.peer.signal(signal);
                });

                socket.on('FE-user-leave', ({ userId, userName }) => {
                    const peerIdx = findPeer(userId);
                    peerIdx.peer.destroy();
                    setPeers((users) => {
                        users = users.filter((user) => user.peerID !== peerIdx.peer.peerID);
                        return [...users];
                    });
                    peersRef.current = peersRef.current.filter(({ peerID }) => peerID !== userId);
                });
            });
    })

    return (
        <>
            <div className="main-content">
                <AuthNavbar />
                <Header />
                <Container className="mt--7" fluid>
                    <Row>
                        {participant.map((data, i) => {
                            return (
                                <Col lg="6" xl="3" key={data}>
                                    <Card className="card-stats mb-4 mb-xl-0">
                                        <CardBody >
                                            <Row >
                                                <div className="col" >
                                                    <CardTitle tag="h5" className="text-uppercase text-muted mb-0" >{data}</CardTitle>
                                                </div>
                                            </Row>
                                        </CardBody>
                                    </Card> <br />
                                </Col>
                            )
                        })
                        }
                    </Row>
                    <Row className="mt-5">
                        <Col className="mb-5 mb-xl-0" xl="8">
                            <Card className="shadow">
                                <CardHeader className="border-0" style={{ height: '350px' }}>
                                </CardHeader>
                                <div>
                                    <div className="col text-right">
                                        {/* <Col className="col-auto">
                    <div className="icon icon-shape bg-danger text-white rounded-circle shadow" onClick={() => { changeCam(!cam) }}>
                      {cam === true ? <BsCameraVideoFill /> : <BsCameraVideoOffFill />}
                    </div>&nbsp;
                    <div className="icon icon-shape bg-danger text-white rounded-circle shadow" onClick={() => { changeMic(!mic) }}>
                      {mic === true ? <BsFillMicFill /> : <BsFillMicMuteFill />}
                    </div>
                  </Col> */}
                                    </div>
                                    <VideoBox className={`width-peer${peers.length > 8 ? '' : peers.length}`}>
                                        {userVideoAudio['localUser'].video ? null : (
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
                                        peers.map((peer, index, arr) => createUserVideo(peer, index, arr))}
                                </div>
                            </Card>
                            <br />
                            <div>
                                <Dropdown>
                                    <Dropdown.Toggle className="mr-4" size="sm">카메라 선택</Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        {setCam.map((data, i) => { return (<Dropdown.Item>{data}</Dropdown.Item>) })}
                                    </Dropdown.Menu>
                                </Dropdown>
                                <Dropdown>
                                    <Dropdown.Toggle size="sm">마이크 선택</Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        {setMic.map((data, i) => { return (<Dropdown.Item>{data}</Dropdown.Item>) })}
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                        </Col>
                        <Col className="mb-5 mb-xl-0" xl="3">
                            <form onSubmit={onMessageSubmit}>
                                <Card className="shadow">
                                    <CardHeader className="border-0" style={{ height: "420px" }}>
                                        <Row className="align-items-center">
                                            <div className="col">받은 메세지</div>
                                        </Row>
                                        <Row className="align-items-center">
                                            <div className="col text-right">{renderChat()}</div>
                                        </Row>
                                    </CardHeader>
                                    <CardHeader className="border-0">
                                        <Row className="align-items-center">
                                            <div className="col text-right">
                                                <hr />
                                                <input name="message"
                                                    onChange={(e) => {
                                                        onTextChange(e)
                                                    }}
                                                    style={{ width: "80%", border: "none" }}
                                                />
                                                <Button className="timeBtn" color="primary" size="sm"> SEND </Button>
                                            </div>
                                        </Row>
                                    </CardHeader>
                                </Card>
                            </form>
                            <div className="card">
                                <form onSubmit={onMessageSubmit}>
                                    <h1>Message</h1>
                                    <div className="name-field">
                                        <TextField name="name"
                                            onChange={(e) => onTextChange(e)}
                                            value={state.name || ""}
                                            label="Name"
                                        />
                                    </div>
                                </form>
                            </div>
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
            width: 100%;
            height: 100%;
  }

            :hover {
    > i {
                display: block;
    }
  }
            `;

export default Room;
