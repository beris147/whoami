// @flow
const { removeRoom, emitRoomUpdate } = require('utils/roomUtils');
const { removeUserFromRoom, removeUser } = require('utils/userUtils');

import type { RoomSetT } from 'types/roomSetType';
import type { UserSetT } from 'types/userSetType';

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
      } catch (error) {
        console.log(error);
      }
    }
    
    socket.on('disconnect', disconnect);
}