const express = require('express');
const mysql = require('mysql');
const app = express();
const http = require('http').createServer(app);
const cors = require('cors');
const io = require('socket.io')(http, {
    cors: {
        origin: "*",
        Credential: true
    }
});
const PORT = 4000;
const path = require('path');
const bodyParser = require("body-parser");
// require('dotenv').config({path:path.join(__dirname, './db/db.env')});   //환경변수 세팅


let socketList = {};
//개발
app.use(cors());
app.use(express.static(path.join(__dirname, '../client/public')));
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, '../client/public/index.html'));
});

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());


app.post('/api/login', (req, res) => {
    const data = req.body;
    const getId = data.id.id;
    const getPass = data.pass.pass;
    console.log(data);
    console.log(getId + " " + getPass);

    const sql = "SELECT * FROM user";
    mysqlDB.query(sql, function (err, results) {
        if (err) console.log(err);
        else res.send(results);
        console.log(results);
    });


});

const mysqlDB = mysql.createConnection({   //express mysql conect
    host: 'kosa2.iptime.org',
    user: 'rok',
    password: '1234',
    port: 50324,
    database: 'chat_db'
});

// //배포
// // if (process.env.NODE_ENV === 'production') {
// app.use(express.static(path.join(__dirname, '../client/build')));

// app.get('/*', function (req, res) {
//     res.sendFile(path.join(__dirname, '../client/build/index.html'));
// });
// }
// console.log(io._parser.);


io.on('connection', (socket) => { //소켓이 연결됐을때
    console.log(`New User connected: ${socket.id}`);
    socket.on('message', ({ name, message }) => {
        console.log('message: ' + message + 'name: ' + name);
        io.emit('message', ({ name, message }))
    })
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

    /**
     * Join Room
     */
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
    });


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

    socket.on('BE-send-message', ({ roomId, msg, sender }) => {
        io.sockets.in(roomId).emit('FE-receive-message', { msg, sender });
    });

    socket.on('BE-leave-room', ({ roomId, leaver }) => {
        delete socketList[socket.id];
        socket.broadcast
            .to(roomId)
            .emit('FE-user-leave', { userId: socket.id, userName: [socket.id] });
        io.sockets.sockets[socket.id].leave(roomId);
    });

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
    console.log('Connected : 4000');
});