// @flow
const roomUtils = require('../../utils/roomUtils');
const userUtils = require('../../utils/userUtils');

import type { RoomSetT } from '../../types/roomSetType';
import type { UserSetT } from '../../types/userSetType';

const { removeRoom, emitRoomUpdate } = roomUtils;
const { removeUserFromRoom, removeUser } = userUtils;

module.exports = (
    io: Object, 
    socket: Object,
    rooms: RoomSetT,
    users: UserSetT,
) => {
    const disconnect = (): void => {
      console.log(`Client ${socket.id} disconnected`);
      try {
        const user = users[socket.id];
        removeUserFromRoom(user, rooms);
        removeUser(user, users);
        if (!rooms[user.roomId].users.length) {
          console.log(`removing room ${user.roomId}`);
          removeRoom(rooms[user.roomId], rooms);
        }
        else emitRoomUpdate(rooms[user.roomId], io);
      } catch (error) {
        console.log(error);
      }
    }
    
    socket.on('disconnect', disconnect);
}