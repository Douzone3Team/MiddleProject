import io from 'socket.io-client';
// const sockets = io('/*');
const sockets = io('http://localhost:4000/', { autoConnect: true, forceNew: true });
export default sockets;