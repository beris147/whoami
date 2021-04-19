// @flow
import type { RoomT, RoomSetT, UserT, UserSetT } from 'common/types';

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
  rooms[room.id].users = room.users.filter(name => name != user.username);
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