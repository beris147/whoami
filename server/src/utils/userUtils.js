// @flow
import type { RoomT, RoomSetT, UserT, UserSetT } from 'common/types';
const { transferOwnership } = require("utils/roomUtils");

const createUser = (
  id: string, 
  username: string, 
  roomId: string,
  users: UserSetT,
): UserT => {
  return users[id] = { id, username, roomId };
}

const removeUserFromRoom = (user: UserT, rooms: RoomSetT): void => {
  const room = getUserRoom(user, rooms);
  const roomv2: RoomT = 
    room.owner == user.username
    ? transferOwnership(room, room.users[0])
    : room;
  const roomv3: RoomT = {
    ...roomv2,
    users: roomv2.users.filter(name => name != user.username),
  }
  rooms[room.id] = roomv3; 
}

const getUserRoom = (user: UserT, rooms: RoomSetT): RoomT => {
  return rooms[user.roomId];
}

const removeUser = (user: UserT, users: UserSetT): void => {
  delete users[user.id];
}


module.exports = {
  createUser,
  removeUser,
  removeUserFromRoom,
  getUserRoom,
};