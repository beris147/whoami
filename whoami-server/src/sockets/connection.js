// @flow
const roomHandler = require('./handlers/roomHandler');
const userHandler = require('./handlers/userHandler');

import type { RoomSetT } from '../types/roomSetType';
import type { UserSetT } from '../types/userSetType';

module.exports.connect = (io: any, rooms: RoomSetT, users: UserSetT) => {
  io.on('connection', (socket: any): void => {
    console.log(`New client connected with socket ${socket.id}`);
    roomHandler(io, socket, rooms, users);
    userHandler(io, socket, rooms, users);
  });
}