// @flow
const { rooms } = require('./roomUtils')

import type { RoomT } from '../types/roomType';
import type { UserT } from '../types/userType';

const users: { [string]: UserT } = {};

const createUser = (
    id: string, 
    username: string, 
    roomId: string, 
): UserT => {
    return users[id] = { id, username, roomId };
}

const removeUserFromRoom = (user: UserT): void => {
  const room = userRoom(user);
  rooms[room.id].users = room.users.filter(name => name != user.username);
}

const userRoom = (user: UserT): RoomT => {
  return rooms[user.roomId];
}

const removeUser = (user: UserT): void => {
  delete users[user.id];
}


module.exports = {
    createUser,
    removeUser,
    removeUserFromRoom,
    userRoom,
    users,
};