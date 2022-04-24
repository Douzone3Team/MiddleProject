import io from 'socket.io-client';
// const sockets = io('/*');
const sockets = io('https://bong8230.iptime.org:4000', { autoConnect: true, forceNew: true });
export default sockets;