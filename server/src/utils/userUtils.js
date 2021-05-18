// @flow
const { 
  transferOwnership, 
  removeRoom, 
  emitToRoom,
} = require("utils/roomUtils");

import type { 
  RoomT, 
  RoomSetT, 
  UserT, 
  UserJoinedRoomT,
  UserSetT, 
  ErrorT,
} from 'common/types';

const createUser = (
  id: string, 
  username: string, 
  roomId: string,
  users: UserSetT,
): UserT => {
  return users[id] = { id, username, roomId };
}

const removeUserFromRoom = (user: UserT, rooms: RoomSetT, io: any): void => {
  const room = getUserRoom(user, rooms);
  room.users = room.users.filter(name => name != user.username);
  if(!room.users.length) {
    removeRoom(room, rooms);
    return;
  }
  rooms[room.id] = 
    room.owner == user.username
    ? transferOwnership(room, room.users[0], io)
    : room;
  if(io) emitToRoom(room.id, 'user-left', user.username, io);
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
  io: any,
): void => {
  if(!users[userId]) return;
  const user = users[userId];
  removeUser(user, users);
  if(!rooms[user.roomId]) return;
  removeUserFromRoom(user, rooms, io); // handles transfer owner
}

const getUserId = (
  username: string,
  roomId: string,
  users: UserSetT
): ?string => {
  const userId = Object.keys(users).find(
    (userId) =>
      users[userId].username == username && users[userId].roomId == roomId
  );
  return userId;
};

const getUser = (id: string, users: UserSetT): ?UserT => {
  return users[id];
}

const getOwner = (
  roomId: string,
  users: UserSetT,
  rooms: RoomSetT,
): ?UserT => {
  const room = rooms[roomId];
  if (!room) return null;
  const owner = room.owner;
  const ownerId = getUserId(owner, roomId, users);
  if (!ownerId) return null;
  return getUser(ownerId, users);
};

const emitUserJoinedRoom = (room: RoomT, user: UserT, socket: any) => {
  if (socket) {
    const userJoined: UserJoinedRoomT = { room, user };
    socket.emit('joined-room', userJoined);
  }
}

module.exports = {
  createUser,
  removeUser,
  removeUserById,
  removeUserFromRoom,
  getUserRoom,
  getOwner,
  getUser,
  emitUserJoinedRoom,
};