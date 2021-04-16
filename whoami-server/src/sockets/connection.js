// @flow
const roomHandler = require('./handlers/roomHandler');
const userHandler = require('./handlers/userHandler');

module.exports.connect = (io: any) => {
  io.on('connection', (socket: any): void => {
    console.log(`New client connected with socket ${socket.id}`);
    roomHandler(io, socket);
    userHandler(io, socket);
  });
}