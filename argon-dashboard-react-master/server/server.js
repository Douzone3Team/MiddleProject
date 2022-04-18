const express = require('express');
const mysql = require('mysql');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const PORT = 4000;
const path = require('path');
const cors = require('cors');
const bodyParser = require("body-parser");
// require('dotenv').config({path:path.join(__dirname, './db/db.env')});   //환경변수 세팅

let socketList = {};
//개발
app.use(express.static(path.join(__dirname, '../client/public')));
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, '../client/public/index.html'));
});

app.use(express.static(path.join(__dirname, '../client/public')));
app.use(bodyParser.urlencoded({ extended:false}))
app.use(bodyParser.json());
app.use(cors());
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '../client/public/index.html'));
});

app.post('/api/login',(req,res) => {
    const data = req.body;   
    const getId = data.id.id;
    const getPass = data.pass.pass;
    console.log(data);
    console.log(getId + " " + getPass);
    
    const sql = "SELECT * FROM user";
    mysqlDB.query(sql,function(err, results) {
        if(err) console.log(err);
        else res.send(results);
        console.log(results);
    });

    
});

const mysqlDB = mysql.createConnection({   //express mysql conect
    host:'kosa2.iptime.org', 
    user:'rok', 
    password:'1234', 
    port:50324, 
    database:'chat_db' 
});

// //배포
// // if (process.env.NODE_ENV === 'production') {
// app.use(express.static(path.join(__dirname, '../client/build')));

// app.get('/*', function (req, res) {
//     res.sendFile(path.join(__dirname, '../client/build/index.html'));
// });
// // }

io.on('connection', (socket) => { //소켓이 연결됐을때
    console.log(`New User connected: ${socket.id}`);

    //연결해제
    socket.on('disconnect', () => {
        socket.disconnect();
        console.log('User disconnected!');
    });

    //
    socket.on('BE-check-user', ({ roomId, userName }) => {
        let error = false;

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
        // Socket Join RoomName
        socket.join(roomId);
        socketList[socket.id] = { userName, video: true, audio: true };

        // Set User List
        io.sockets.in(roomId).clients((err, clients) => {
            try {
                const users = [];
                clients.forEach((client) => {
                    // Add User List
                    users.push({ userId: client, info: socketList[client] });
                });
                socket.broadcast.to(roomId).emit('FE-user-join', users);
                // io.sockets.in(roomId).emit('FE-user-join', users);
            } catch (e) {
                io.sockets.in(roomId).emit('FE-error-user-exist', { err: true });
            }
        });
    });


    socket.io('message', ({name, message}) => {
        console.log('name: '+ name + 'message: '+ message);
        io.emit('message',({name, message}))
    })
})


http.listen(PORT, () => {
    console.log('Connected : 4000');
});