// @flow
const { removeRoom, emitRoomUpdate } = require('utils/roomUtils');
const { removeUserFromRoom, removeUser } = require('utils/userUtils');

import type { RoomSetT, UserSetT } from 'common/types';

module.exports = (
  io: Object,
  socket: Object,
  rooms: RoomSetT,
  users: UserSetT,
) => {
  const disconnect = (): void => {
    console.log(`Client ${socket.id} disconnected`);
    if(!users[socket.id]) return;
    try {
      const user = users[socket.id];
      removeUser(user, users);
      removeUserFromRoom(user, rooms);
      if (!rooms[user.roomId].users.length) {
        console.log(`removing empty room ${user.roomId}`);
        removeRoom(rooms[user.roomId], rooms);
      }
      else emitRoomUpdate(rooms[user.roomId], io);
      /* 
      TODO
      Check if the user that left was the owner, if true we need to change the
      current owner. Implement this when we can test if it works. 
      */
    } catch (error) {
      console.log(error);
    }
  }
  
  socket.on('disconnect', disconnect);
}