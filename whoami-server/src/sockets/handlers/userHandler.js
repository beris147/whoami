// @flow
const roomUtils = require('../../utils/roomUtils');
const userUtils = require('../../utils/userUtils');

const { removeRoom, emitRoomUpdate, rooms } = roomUtils;
const { removeUserFromRoom, removeUser, users } = userUtils;

module.exports = (
        io: Object, 
        socket: Object,
) => {
    const disconnect = (): void => {
      console.log(`Client ${socket.id} disconnected`);
      try {
        const user = users[socket.id];
        removeUserFromRoom(user);
        removeUser(user);
        if (!rooms[user.roomId].users.length) {
          console.log(`removing room ${user.roomId}`);
          removeRoom(rooms[user.roomId]);
        }
        else emitRoomUpdate(rooms[user.roomId], io);
      } catch (error) {
        console.log(error);
      }
    }
    
    socket.on('disconnect', disconnect);
}