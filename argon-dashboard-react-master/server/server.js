const express = require('express');
const mysql = require('mysql');
const app = express();
const http = require('http').createServer(app);
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser')
const cookie = require('cookie');
const io = require('socket.io')(http, {
    cors: {
        origin: "*",
        Credential: true
    }
});
const PORT = 4000;
const path = require('path');
require("dotenv").config();
const bodyParser = require("body-parser");
// require('dotenv').config({path:path.join(__dirname, './db/db.env')});   //환경변수 세팅

const mysqlDB = mysql.createConnection({   //express mysql conect
    host:'kosa2.iptime.org', 
    user:'rok', 
    password:'1234', 
    port:50324, 
    database:'chat_db' 
});

let socketList = {};
//개발
app.use(cors());
app.use(express.static(path.join(__dirname, '../client/public')));
app.use(cookieParser());
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, '../client/public/index.html'));
});

app.use(bodyParser.urlencoded({ extended:false}))
app.use(bodyParser.json());

//로그인 기능
app.post('/api/login',(req, res, fields) => {
    
    // let isUser = false;
    // console.log(req);
    // console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
    // console.log(req.headers);
    // console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    // var cookies = cookie.parse(req.headers.cookie); 
    // const parsedCookies = cookie.parse(cookies);
    // console.log(parsedCookies);

    

    //요청해서 서버로 받아온 데이터
    const data = req.body;   
    const getId = data.id.id;
    const getPass = data.pass.pass;
    console.log(data);
    console.log(getId + " " + getPass);    
    //쿼리 작성
    const sql = `SELECT * FROM user WHERE u_id = '${getId}'`;

    //Mysql로 쿼리 동작
    mysqlDB.query(sql,function(err, results) {
        if(err) console.log(err);
        else {
            isUser = true;
            if(isUser) {                
                const YOUR_SECRET_KEY = process.env.SECRET_KEY;
                console.log(YOUR_SECRET_KEY);                
                const accessToken = jwt.sign(
                    {
                        getId,
                    },
                    YOUR_SECRET_KEY,
                    {
                        expiresIn: "1h",
                    }
                );
                console.log(accessToken);
                res.cookie("user", accessToken);
                var getName;
                for(var data of results){
                    getName = data.u_name
                    
                }
                res.status(201).json({
                    result:"ok",
                    accessToken,
                    isLogin : true,
                    userId : getId,
                    userName : getName,
                });
                
            } else {
                res.state(400).json({ error : 'invalide user',
                isLogin : false, })
                
            }
            // res.cookie('islogined',getId);
            
        } 
        console.log(results);
    });    
});

//회원가입 기능
app.post('/api/register', (req,res) => {
    //가입할 정보 입력
    const data = req.body; const getName = data.name.name; 
    const getId = data.id.id; const getPass = data.pass.pass;
    //user INSERT 쿼리
    const sql =`INSERT INTO user(u_id, u_pass, u_name) VALUES('${getId}', '${getPass}', '${getName}')`;
    console.log(sql);
    mysqlDB.query(sql,function(err, results) {
        if(err) {
            console.log("이미 등록된 아이디입니다.");
            res.send(false);
        }
        else {
            res.send(true);
            
        };
    })
})

//로그인 체크
// app.post('/api/loginCheck' (req,res) => {


// })
//방 생성 기능
app.post('/api/createRoom',(req,res) => {
    const getCookie = req.cookies.user; //clients 측 쿠키'user'  getCookie에 저장
    var decode;
    //암호화 해제
    jwt.verify(getCookie, process.env.SECRET_KEY, function(err, decoded) {
        decode = decoded.getId;
        console.log(decoded);
        console.log(decode);
    });
    console.log("decode : "+ decode);
    //
    
    const lcsql = `SELECT * FROM user WHERE u_id = '${decode}'`;
    
    mysqlDB.query(crsql,function(err,results){
        if (err) {
            console.log("인증실패");
            
        }
        else res.send(false);
    })

    
    const data = req.body.roomName; //clients에서 받아온 데이터
    console.log(data);
    const crsql = `INSERT INTO room(r_name,u_id) VALUES('${data}' ,'aaaa' )` //방생성 쿼리
    console.log();
    // const num = mysqlDB.query(crsql,function(err, results) { //db에 생성할 방 INSERT
    //     if(err) console.log(err);
    //     else console.log("방 추가완료");
    //     return results
    // });
                                 
    // sql = 'Insert into'
    // mysqlDB.query()
})



// //배포
// // if (process.env.NODE_ENV === 'production') {
// app.use(express.static(path.join(__dirname, '../client/build')));

// app.get('/*', function (req, res) {
//     res.sendFile(path.join(__dirname, '../client/build/index.html'));
// });
// }
// console.log(io._parser.);


// io.on('connection', (socket) => { //소켓이 연결됐을때
//     console.log(`New User connected: ${socket.id}`);

//     // 채팅연결 - git
//     socket.on('BE-send-message', ({msg, sender}) => {
//         io.sockets.emit('FE-receive-message', { msg, sender});
//     });

//     //연결해제
//     socket.on('disconnect', () => {
//         socket.disconnect();
//         console.log('User disconnected!');
//     });

//     // //
//     socket.on('BE-check-user', ({ roomId, userName }) => {
//         let error = false;
//         console.log(roomId);
//         // io.sockets.in(roomId).clients((err, clients) => {
//         //     console.log(13);
//         //     clients.forEach((client) => {
//         //         if (socketList[client] == userName) {
//         //             error = true;
//         //         }
//         //     });
//         socket.emit('FE-error-user-exist', { roomId, userName, error });
//         //     console.log(2);
//         // });
//     });







    //Join Room
    // socket.on('BE-join-room', ({ roomId, userName }) => {
    //     // Socket Join RoomName
    //     socket.join(roomId);
    //     socketList[socket.id] = { userName, video: true, audio: true };


//     //     // Set User List
//     //     io.sockets.in(roomId).clients((err, clients) => {
//     //         try {
//     //             const users = [];
//     //             clients.forEach((client) => {
//     //                 // Add User List
//     //                 users.push({ userId: client, info: socketList[client] });
//     //             });
//     //             socket.broadcast.to(roomId).emit('FE-user-join', users);
//     //             // io.sockets.in(roomId).emit('FE-user-join', users);
//     //         } catch (e) {
//     //             io.sockets.in(roomId).emit('FE-error-user-exist', { err: true });
//     //         }
//     //     });
//     // });


//     // socket.on('BE-call-user', ({ userToCall, from, signal }) => {
//     //     io.to(userToCall).emit('FE-receive-call', {
//     //         signal,
//     //         from,
//     //         info: socketList[socket.id],
//     //     });
//     // });

//     // socket.on('BE-accept-call', ({ signal, to }) => {
//     //     io.to(to).emit('FE-call-accepted', {
//     //         signal,
//     //         answerId: socket.id,
//     //     });
//     // });

//     // socket.on('BE-send-message', ({ roomId, msg, sender }) => {
//     //     io.sockets.in(roomId).emit('FE-receive-message', { msg, sender });
//     // });

//     // socket.on('BE-leave-room', ({ roomId, leaver }) => {
//     //     delete socketList[socket.id];
//     //     socket.broadcast
//     //         .to(roomId)
//     //         .emit('FE-user-leave', { userId: socket.id, userName: [socket.id] });
//     //     io.sockets.sockets[socket.id].leave(roomId);
//     // });

//     // socket.on('BE-toggle-camera-audio', ({ roomId, switchTarget }) => {
//     //     if (switchTarget === 'video') {
//     //         socketList[socket.id].video = !socketList[socket.id].video;
//     //     } else {
//     //         socketList[socket.id].audio = !socketList[socket.id].audio;
//     //     }
//     //     socket.broadcast
//     //         .to(roomId)
//     //         .emit('FE-toggle-camera', { userId: socket.id, switchTarget });
//     // });
// });





http.listen(PORT, () => {
    console.log('Connected : 4000');
});