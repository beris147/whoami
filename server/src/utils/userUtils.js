// @flow
import { transferOwnership, removeRoom, emitToRoom } from 'utils/roomUtils';

import type { ErrorT } from 'domain/models/ErrorModels';
import type { RoomT, RoomSetT, RoomIdT } from 'domain/models/RoomModels';
import type {
  UserT,
  UserIdT,
  UsernameT,
  UserJoinedRoomT,
  UserSetT,
} from 'domain/models/UserModels';

export const createUser = (
  id: UserIdT,
  username: UsernameT,
  roomId: RoomIdT,
  users: UserSetT
): UserT => {
  return (users[id] = { id, username, roomId });
};

export const removeUserFromRoom = (
  user: UserT,
  rooms: RoomSetT,
  io: any
): void => {
  const room = getUserRoom(user, rooms);
  room.users = room.users.filter((name) => name != user.username);
  if (!room.users.length) {
    removeRoom(room, rooms);
    return;
  }
  rooms[room.id] =
    room.owner == user.username
      ? transferOwnership(room, room.users[0], io)
      : room;
  if (io) emitToRoom(room.id, 'user-left', user.username, io);
};

export const getUserRoom = (user: UserT, rooms: RoomSetT): RoomT => {
  return rooms[user.roomId];
};

export const removeUser = (user: UserT, users: UserSetT): void => {
  delete users[user.id];
};

export const removeUserById = (
  userId: UserIdT,
  users: UserSetT,
  rooms: RoomSetT,
  io: any
): void => {
  if (!users[userId]) return;
  const user = users[userId];
  removeUser(user, users);
  if (!rooms[user.roomId]) return;
  removeUserFromRoom(user, rooms, io); // handles transfer owner
};

export const getUserId = (
  username: UsernameT,
  roomId: RoomIdT,
  users: UserSetT
): ?string => {
  const userId = Object.keys(users).find(
    (userId) =>
      users[userId].username == username && users[userId].roomId == roomId
  );
  return userId;
};

export const getUser = (id: string, users: UserSetT): ?UserT => {
  return users[id];
};

export const getOwner = (
  roomId: RoomIdT,
  users: UserSetT,
  rooms: RoomSetT
): ?UserT => {
  const room = rooms[roomId];
  if (!room) return null;
  const owner = room.owner;
  const ownerId = getUserId(owner, roomId, users);
  if (!ownerId) return null;
  return getUser(ownerId, users);
};

export const emitUserJoinedRoom = (room: RoomT, user: UserT, socket: any) => {
  if (socket) {
    const userJoined: UserJoinedRoomT = { room, user };
    socket.emit('joined-room', userJoined);
  }
};
