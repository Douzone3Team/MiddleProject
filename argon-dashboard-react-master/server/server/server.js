const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const PORT = 4000;
const path = require('path');

let socketList = {};
//개발
app.use(express.static(path.join(__dirname, '../client/public')));
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, '../client/public/index.html'));
});

// //배포
// // if (process.env.NODE_ENV === 'production') {
// app.use(express.static(path.join(__dirname, '../client/build')));

// app.get('/*', function (req, res) {
//     res.sendFile(path.join(__dirname, '../client/build/index.html'));
// });
// // }

io.on('connection', (socket) => {

});


http.listen(PORT, () => {
    console.log('Connected : 4000');
});