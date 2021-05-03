// @flow
const { v4: uuidv4 } = require('uuid');

import type { 
  ErrorT,
  JoinRoomResponseT,
  RoomT,
  RoomSetT,
  UserT,
  UserSetT,
  MessageT,
} from 'common/types';

const canUserJoinRoom = (
  roomId: string, 
  user: UserT, 
  rooms: RoomSetT
): ?ErrorT => {
  if(!rooms[roomId]) { 
    return { error: `no room with id ${roomId}` };
  }
  if(rooms[roomId].users.includes(user.username)) {
    return { error: `username ${user.username} already in use` };
  }
}

const joinUserToRoomById = (
  socket: any,
  roomId: string,
  user: UserT,
  io: any,
  rooms: RoomSetT,
): JoinRoomResponseT => {
  const error = canUserJoinRoom(roomId, user, rooms);
  if(error) return { room: undefined, error };
  rooms[roomId].users.push(user.username);
  io.in(roomId).emit('room-update', rooms[roomId]);
  socket.join(roomId);
  console.log(`User ${socket.id} joined room ${roomId}`);
  return { room: rooms[roomId], error: undefined };
}


const createRoom = (owner: string, rooms: RoomSetT): RoomT => {
  const id = uuidv4();
  return rooms[id] = {
    id,
    users: Array(),
    owner,
    round: 1,
    time: 30,
  };
}

const removeRoom = (room: RoomT, rooms: RoomSetT): void => {
  delete rooms[room.id];
}

const transferOwnership = (
  room: RoomT,
  newOwnerUsername: string,
  io: any, 
): RoomT => {
  if(io) emitToRoom(room.id, 'room-owner-changed', newOwnerUsername, io);
  return {
    ...room,
    owner: newOwnerUsername,
  };
};

const emitToRoom = (roomId: string, petition: string, data: any, io: any) => {
  io.in(roomId).emit(petition, data);
}

const emitRoomMessage = (room: RoomT, message: MessageT, socket: any) => {
  socket.to(room.id).emit('new-message', message);
}

module.exports = {
  createRoom,
  emitRoomMessage,
  emitToRoom,
  joinUserToRoomById,
  removeRoom,
  transferOwnership,
};