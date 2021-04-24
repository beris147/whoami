// @flow
import type { RoomT, RoomSetT, UserT, UserSetT } from 'common/types';
const { 
  transferOwnership, 
  removeRoom, 
  emitRoomUpdate,
} = require("utils/roomUtils");

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
  room.users = room.users.filter(name => name != user.username);
  if(!room.users.length) {
    removeRoom(room, rooms);
    return;
  }
  rooms[room.id] = 
    room.owner == user.username
    ? transferOwnership(room, room.users[0])
    : room;
}

const getUserRoom = (user: UserT, rooms: RoomSetT): RoomT => {
  return rooms[user.roomId];
}

const removeUser = (user: UserT, users: UserSetT): void => {
  delete users[user.id];
}

const removeUserById = (
  userId: string,
  users: UserSetT,
  rooms: RoomSetT,
): void => {
  if(!users[userId]) return;
  const user = users[userId];
  removeUser(user, users);
  if(!rooms[user.roomId]) return;
  removeUserFromRoom(user, rooms); // handles transfer owner
}

module.exports = {
  createUser,
  removeUser,
  removeUserById,
  removeUserFromRoom,
  getUserRoom,
};