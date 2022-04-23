// 유선 LAN 사용시 proxy 충돌이 일어남
// 방지용 js 생성

const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'https://bong8230.iptime.org:4000',
            changeOrigin: true,
        })
    );
};

// const { createProxyMiddleware } = require('http-proxy-middleware');

// module.exports = (app) => {
//   app.use(
//     '/socket.io',
//     createProxyMiddleware({
//       target: 'http://localhost:4000',
//       changeOrigin: true,
//       ws: true, // enable websocket proxy
//       logLevel: 'debug',
//     })
//   );
// };

