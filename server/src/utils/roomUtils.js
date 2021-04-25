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

const emitRoomUpdate = (room: RoomT, io: any) => {
  io.in(room.id).emit('room-update', room);
}

const emitRoomMessage = (room: RoomT, message: MessageT, socket: any) => {
  socket.to(room.id).emit('new-message', message);
}

module.exports = {
  createRoom,
  emitRoomMessage,
  emitRoomUpdate,
  joinUserToRoomById,
  removeRoom,
};