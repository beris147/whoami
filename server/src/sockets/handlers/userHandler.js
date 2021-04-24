// @flow
const { emitRoomUpdate } = require('utils/roomUtils');
const { removeUserById } = require('utils/userUtils');

import type { RoomSetT, UserSetT } from 'common/types';

module.exports = (
  io: Object,
  socket: Object,
  rooms: RoomSetT,
  users: UserSetT,
) => {
  const disconnect = (): void => {
    console.log(`Client ${socket.id} disconnected`);
    removeUserById(socket.id, users, rooms);
  }
  
  socket.on('disconnect', disconnect);
}