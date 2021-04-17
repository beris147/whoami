// @flow
const { v4: uuidv4 } = require('uuid');

import type { ErrorT } from '../types/errorType';
import type { JoinRequestT } from '../types/joinRequestType';
import type { RoomT } from '../types/roomType';
import type { RoomSetT } from '../types/roomSetType';
import type { UserT } from '../types/userType';
import type { UserSetT } from '../types/userSetType';

const canJoinRoom = (room: RoomT, user: UserT, rooms: RoomSetT): ?ErrorT => {
  if(!rooms[room.id]) { 
    return { error: `no room with id ${room.id}` };
  }
  if(rooms[room.id].users.includes(user.username)) {
    return { error: `username ${user.username} already in use` };
  }
}

const joinRoom = (
    socket: any,
    room: RoomT,
    user: UserT,
    io: any,
    rooms: RoomSetT,
): JoinRequestT => {
  const error = canJoinRoom(room, user, rooms);
  if(error) return { room, error };
  rooms[room.id].users.push(user.username);
  io.in(room.id).emit('room-update', rooms[room.id]);
  socket.join(room.id);
  console.log(`User ${socket.id} joined room ${room.id}`);
  return { room: rooms[room.id], error: undefined };
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

module.exports = {
    canJoinRoom,
    createRoom,
    emitRoomUpdate,
    joinRoom,
    removeRoom,
};