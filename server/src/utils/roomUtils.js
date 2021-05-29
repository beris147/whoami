// @flow
import type { ErrorT } from 'domain/models/ErrorModels';
import type { MessageT } from 'domain/models/MessageModels';
import type {
  RoomT,
  RoomSetT,
  RoomIdT,
  JoinRoomResponseT,
} from 'domain/models/RoomModels';
import type {
  UserT,
  UserIdT,
  UsernameT,
  UserJoinedRoomT,
  UserSetT,
} from 'domain/models/UserModels';

export const canUserJoinRoom = (
  roomId: string,
  user: UserT,
  rooms: RoomSetT
): ?ErrorT => {
  if (!rooms[roomId]) {
    return `no room with id ${roomId}`;
  }
  if (rooms[roomId].users.includes(user.username)) {
    return `username ${user.username} already in use`;
  }
};

export const joinUserToRoomById = (
  socket: any,
  roomId: string,
  user: UserT,
  io: any,
  rooms: RoomSetT
): JoinRoomResponseT => {
  const error = canUserJoinRoom(roomId, user, rooms);
  if (error) return { room: undefined, error };
  rooms[roomId].users.push(user.username);
  io.in(roomId).emit('room-update', rooms[roomId]);
  socket.join(roomId);
  console.log(`User ${socket.id} joined room ${roomId}`);
  return { room: rooms[roomId], error: undefined };
};

export const createRoom = (owner: UsernameT, rooms: RoomSetT): RoomT => {
  const size = Object.keys(rooms).length;
  const id = (100000000 + size).toString(36);
  return (rooms[id] = {
    id,
    users: Array(),
    owner,
  });
};

export const removeRoom = (room: RoomT, rooms: RoomSetT): void => {
  delete rooms[room.id];
};

export const transferOwnership = (
  room: RoomT,
  newOwnerUsername: string,
  io: any
): RoomT => {
  if (io) emitToRoom(room.id, 'room-owner-changed', newOwnerUsername, io);
  return {
    ...room,
    owner: newOwnerUsername,
  };
};

export const emitToRoom = (
  roomId: string,
  petition: string,
  data: any,
  io: any
) => {
  io.in(roomId).emit(petition, data);
};

export const emitRoomMessage = (
  room: RoomT,
  message: MessageT,
  socket: any
) => {
  socket.to(room.id).emit('new-message', message);
};
