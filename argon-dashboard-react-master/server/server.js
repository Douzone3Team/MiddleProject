const express = require('express');
const mysql = require('mysql');
const app = express();
const read = require('fs');
//open ssl
/* const options = {
    key: read.readFileSync('./keys/key.pem', 'utf-8'),
    cert: read.readFileSync('./keys/cert.pem', 'utf-8'),
    passphrase: 'bong'
}; */



const http = require('http').createServer(/* options, */ app);
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser')
const cookies = require('cookie');
const io = require('socket.io')(http, {
    cors: {
        origin: "*",
        Credential: true
    }
}, app);
var moment = require('moment');
const PORT = 4000;
const path = require('path');
require("dotenv").config();
const bodyParser = require("body-parser");

// require('dotenv').config({path:path.join(__dirname, './db/db.env')});   //환경변수 세팅
// require('date-utils');
require('moment-timezone');



const mysqlDB = mysql.createConnection({   //express mysql conect
    host: 'kosa2.iptime.org',
    user: 'rok',
    password: '1234',
    port: 50324,
    database: 'chat_db',
    multipleStatements: true,
});

let socketList = {};
//개발
app.use(cors());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../client/public')));
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, '../client/public/index.html'));
});
//배포
// if (process.env.NODE_ENV === 'production') {
// app.use(express.static(path.join(__dirname, '../client/build')));

// app.get('/*', function (req, res) {
//     res.sendFile(path.join(__dirname, '../client/build/index.html'));
// });
// }
// console.log(io._parser.);

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());





//로그인 기능
app.post('/api/login', (req, res, fields) => {

    //요청해서 서버로 받아온 데이터
    const data = req.body;
    const getId = data.id.id;
    const getPass = data.pass.pass;

    //쿼리 작성
    const sql = `SELECT u_id, u_pass, u_name FROM user WHERE u_id = '${getId}'`;

    //Mysql로 쿼리 동작
    mysqlDB.query(sql, function (err, results) {
        if (err) console.log(err);
        else {
            isUser = true;
            if (isUser) {
                const YOUR_SECRET_KEY = process.env.SECRET_KEY;
                const accessToken = jwt.sign(
                    {
                        getId,
                    },
                    YOUR_SECRET_KEY,
                    {
                        expiresIn: "1h",
                    }
                );
                res.cookie("user", accessToken, { maxAge: 60 * 60 * 1000 });

                var dbId, dbPass, dbName;

                for (var data of results) {
                    dbId = data.u_id;
                    dbPass = data.u_pass;
                    dbName = data.u_name;

                }
                console.log("@@@@@@@@@@@@@@@@@0000");
                console.log("dbName = " + dbName);
                res.cookie("myname", dbName, { maxAge: 60 * 60 * 1000 });
                console.log("@@@@@@@@@@@@@@@@@0000");

                if ((dbId === getId) && (dbPass === getPass)) {
                    res.cookie("myId", dbId, { maxAge: 60 * 60 * 1000 });

                    res.send(true);
                }
                else res.send(false);

            } else {
                res.state(400).json({
                    error: 'invalide user',
                    isLogin: false,
                })

            }
        }
    });
});

//회원가입 기능
app.post('/api/register', (req, res) => {
    //가입할 정보 입력
    const data = req.body; const getName = data.name.name;
    const getId = data.id.id; const getPass = data.pass.pass;
    //user INSERT 쿼리
    const sql = `INSERT INTO user(u_id, u_pass, u_name) VALUES('${getId}', '${getPass}', '${getName}')`;

    mysqlDB.query(sql, function (err, results) {
        if (err) {   //아이디가 있으면 return false
            console.log("이미 등록된 아이디입니다.");
            res.send(false);
        }
        else {  //없으면 INSERT 되고 return true
            res.send(true);

        };
    })
});


/* app.post('/api/getUserId', (req, res) => {
    console.log(req); //클라이언트 전송정보  
    const getCookie = req.cookies.user; //쿠키내 user 정보
    
    var getName; //암호화된 쿠키내 user 정보
    var dbId,dbPass;
    //암호화 해제
    jwt.verify(getCookie, process.env.SECRET_KEY, function(err, decoded) {
        console.log(decoded);
        if(decoded === undefined){  //cookie가 없을때 error라고 임의로 값전달
            getName = "error";
        }
        else getName = decoded.getId;   //client에서 받아온 user데이터 복호화
    });
    console.log("getName:" + getName);  
    
    //로그인 하는 유저 정보 확인
    const sql = `SELECT * FROM user WHERE u_id = '${getName}'`;
    mysqlDB.query(sql,function(err,results){
        if (err) {  //에러가 나면 false 전달
            console.log("인증실패");
            res.send(false);
        }
        else {
            console.log(results);
            if(results.length > 0){
                console.log("good");
                res.send(true);
            }
            else{ //값이 비었으면 없는 정보이므로 false 전달
                console.log("nodata");
                res.send(false);
                
            }
            
        }
    })
}) */


//로그인 체크
app.post('/api/loginCheck', (req, res) => {
    const getCookie = req.cookies.user; //쿠키내 user 정보

    var getName; //암호화된 쿠키내 user 정보
    var dbId, dbPass;
    //암호화 해제
    jwt.verify(getCookie, process.env.SECRET_KEY, function (err, decoded) {
        if (decoded === undefined) {  //cookie가 없을때 error라고 임의로 값전달
            getName = "error";
        }
        else getName = decoded.getId;   //client에서 받아온 user데이터 복호화
    });

    //로그인 하는 유저 정보 확인
    let sql = `SELECT * FROM user WHERE u_id = '${getName}'`;
    mysqlDB.query(sql, function (err, results) {
        if (err) {  //에러가 나면 false 전달
            console.log("인증실패");
            res.send(false);
        }
        else {
            if (results.length > 0) {

                console.log("good");
                res.cookie("myId", getName, { maxAge: 60 * 60 * 1000 });    //로그인 유지시간 1시간

                res.send(true);
            }
            else { //값이 비었으면 없는 정보이므로 false 전달
                console.log("nodata");
                res.send(false);
            }

        }
    });
});
//방 불러오는 기능
app.post('/api/loadRoom', (req, res) => {
    const sql = `SELECT * FROM room WHERE r_state = 1;
                SELECT r_p_r_code, count(*) as cnt FROM room_participants rp JOIN room r ON rp.r_p_r_code = r.r_code GROUP BY r_p_r_code;`;
    mysqlDB.query(sql, function(err, results){
        if(err) console.log(err);
        else{
            
            console.log("DFASDFASDFADSFASFDS");
            console.log(results[0]);
            console.log(results[1]);

            res.json({roomDetail: results[0],roomCount : results[1]});         
        }
    })    
});
app.post('/api/loadRoomCount', (req,res) =>{
    const sql = `SELECT `
})
//방 참여 기능
app.post('/api/joinRoom', (req, res) => {
    const userId = req.cookies.myId;
    const r_p_r_code = req.body.getRoomCode;
    // console.log("user)id" + userId);
    sql = `INSERT INTO room_participants(r_p_r_code, r_p_u_id) VALUES(${r_p_r_code},'${userId}') `
    console.log("sql = " + sql);
    mysqlDB.query(sql, function (err, results) {
        if (err) console.log(err);
        else {
            console.log("성공");
            res.send(results);
        }
    });
    sql = `UPDATE user SET u_isJoin = '0' WHERE u_id = '${userId}'`;
    mysqlDB.query(sql, function (err, results) {
        if (err) console.log(err)
        else {
            console.log("update success");
        };
    })
})

//방 생성 기능
app.post('/api/createRoom', (req, res) => {

    const data = req.body.roomName; //clients에서 받아온 데이터
    const getCookie = req.cookies.user; //쿠키내 user 정보

    let getName; //암호화된 쿠키내 user 정보    
    let getRoomMax; //쿼리에 넣을 방 번호

    //암호화 해제
    jwt.verify(getCookie, process.env.SECRET_KEY, function (err, decoded) {

        if (decoded === undefined) {  //cookie가 없을때 error라고 임의로 값전달
            getName = "error";
        }
        else getName = decoded.getId;   //client에서 받아온 user데이터 복호화
    });

    console.log("getName:" + getName);


    let sql = `INSERT INTO room(r_name,u_id) VALUES('${data}' ,'${getName}' );` //방생성 쿼리
    mysqlDB.query(sql, function (err, results, next) { //db에 생성할 방 INSERT
        if (err) console.log(err);
        else { console.log("방 추가완료"); }
    });

    sql = `SELECT r_code from room order by r_code desc limit 1;`;
    mysqlDB.query(sql, function (err, results, next) {
        if (err) console.log(err);
        else {

            for (var data of results) {

                getRoomMax = data.r_code;

            }

            res.send({ getRoomMax: getRoomMax });
        }


    });
})

app.post('/api/loadProfile', (req, res) => {
    const myName = req.cookies.myId;
    const sql = `SELECT * FROM user WHERE u_id = '${myName}';`
    mysqlDB.query(sql, function(err, results) {
        if (err) console.log(err);
        else { 
            console.log(results);
            res.send(results);
        };
    })
})

app.post('/api/updateProfile', (req, res) => {
    console.log(req.body);
    const getId = req.cookies.myId;
    const getName = req.body.u_name.inputName;
    const getPass = req.body.u_pass.inputPass;
    const getInfo = req.body.u_info.inputInfo;

    console.log(getId + "  " + getName + "  " + getPass + "  " + getInfo );
    const sql =`Update user SET u_name ='${getName}', u_info ='${getInfo}', u_pass='${getPass}' WHERE u_id ='${getId}'`;
    console.log(sql);
    mysqlDB.query(sql, function(err, results) {
        if(err) err
        else{
            console.log("수정되었습니다.");
        }
    })    
});

io.on('connection', (socket) => { //소켓이 연결됐을때
    console.log(`New User connected: ${socket.id}`);


    //연결해제
    socket.on('disconnect', () => {
        socket.disconnect();
        console.log(`${socket.id} User disconnected!`);
    });

    socket.on('BE-check-user', ({ roomId, userName }) => {
        let error = false;
        console.log("유저가 있는지 확인");
        io.sockets.in(roomId).clients((err, clients) => {

            clients.forEach((client) => {
                if (socketList[client] == userName) {
                    error = true;
                }
            });
            socket.emit('FE-error-user-exist', { error });
        });
    });

    //Join Room

    socket.on('BE-join-room', ({ roomId, userName }) => {
        console.log("server : Userjoin message 받음");
        // Socket Join RoomName
        socket.join(roomId);
        socketList[socket.id] = { userName, video: true, audio: true };

        // Set User List
        io.sockets.in(roomId).clients((err, clients) => {
            console.log("server : room안에 user추가");
            try {
                const users = [];
                clients.forEach((client) => {
                    // Add User List
                    users.push({ userId: client, info: socketList[client] });
                    console.log("server : room안에 user추가2");
                });
                socket.broadcast.to(roomId).emit('FE-user-join', users);
                console.log("server : client에게 userjoin 알림");
                // io.sockets.in(roomId).emit('FE-user-join', users);
            } catch (e) {
                io.sockets.in(roomId).emit('FE-error-user-exist', { err: true });
            }
        });
    })

    socket.on('BE-call-user', ({ userToCall, from, signal }) => {
        console.log("server : signal값 받고 fe-receive-call message를 client에 전달")
        io.to(userToCall).emit('FE-receive-call', {
            signal,
            from,
            info: socketList[socket.id],
        });
    });

    socket.on('BE-accept-call', ({ signal, to }) => {
        console.log("sever : 추가되는 peer확인, client에게 확인 message 전달")
        io.to(to).emit('FE-call-accepted', {
            signal,
            answerId: socket.id,
        });
    });

    // let time = new Date();
    // console.log(time.getHours());
    // console.log(time.getMinutes());

    //채팅
    socket.on('BE-send-message', ({ roomId, msg, sender, time }) => {
        // var nowTime = new Date();
        // var time = nowTime.toFormat('HH:MM:SS');

        // moment.tz.setDefault("Asia/Seoul");
        // var time = moment().format('HH:MM');
        var time = new Date().toTimeString().split(" ")[0];

        io.sockets.in(roomId).emit('FE-receive-message', { msg, sender, roomId, time });
        console.log('server에서 보내는 시간: ' + time);
    });

    // socket.on('BE-send-message', ({ roomId, msg, sender }) => {
    //     io.sockets.in(roomId).emit('FE-receive-message', { msg, sender, roomId });
    // });

    // socket.on('BE-leave-room', ({ roomId, leaver }) => {
    //     delete socketList[socket.id];
    //     socket.broadcast
    //         .to(roomId)
    //         .emit('FE-user-leave', { userId: socket.id, userName: [socket.id] });
    //     io.sockets.sockets[socket.id].leave(roomId);
    // });

    socket.on('BE-toggle-camera-audio', ({ roomId, switchTarget }) => {
        if (switchTarget === 'video') {
            socketList[socket.id].video = !socketList[socket.id].video;
        } else {
            socketList[socket.id].audio = !socketList[socket.id].audio;
        }
        socket.broadcast
            .to(roomId)
            .emit('FE-toggle-camera', { userId: socket.id, switchTarget });
    });

});


http.listen(PORT, () => {
    console.log(`Connected : ${PORT}`);
});