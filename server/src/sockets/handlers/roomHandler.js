// @flow
const {
  createRoom,
  removeRoom,
  emitRoomMessage,
  emitRoomUpdate,
  joinUserToRoomById,
} = require('utils/roomUtils');

const {
  createUser,
  removeUserFromRoom,
  removeUser,
  getUserRoom,
} = require('utils/userUtils');

import type {
  ErrorCallBackT,
  JoinRoomRequestT,
  RoomT,
  RoomSetT,
  UserSetT,
  CreateRoomRequestT,
  LeaveRoomRequestT,
  MessageT, 
} from 'common/types';

module.exports = (
  io: Object, 
  socket: Object,
  rooms: RoomSetT,
  users: UserSetT,
) => {
  const createRoomHandler = (
    data: CreateRoomRequestT, 
    callback: ErrorCallBackT,
  ): void => {
    const newRoom = createRoom(data.username, rooms);
    const user = createUser(socket.id, data.username, newRoom.id, users);
    const { room, error } = joinUserToRoomById(
      socket,
      newRoom.id,
      user,
      io,
      rooms,
    );
    if (error) return callback(error);
    socket.emit('joined-room', room);
  }

  const joinRoomHandler = (
    data: JoinRoomRequestT, 
    callback: ErrorCallBackT,
  ): void => {
    const user = createUser(socket.id, data.username, data.roomId, users);
    const { room, error } = joinUserToRoomById(
      socket,
      data.roomId,
      user,
      io,
      rooms
    );
    if (error) return callback(error);
    socket.emit('joined-room', room);
  }

  const leaveRoomHandler = (
    data: LeaveRoomRequestT,
    callback: ErrorCallBackT,
  ): void => {
    removeUserFromRoom(data.user, rooms);
    socket.emit('left-room');
  }

  const sendMessageHandler = (
    data: MessageT,
    callback: ErrorCallBackT,
  ): void => {
    if(!users[socket.id]) return callback({error: 'disconnection error'});
    const user = users[socket.id];
    const room = getUserRoom(user, rooms);
    if(!room) return callback({error: 'disconnection error'});
    emitRoomMessage(room, data, io);
  }

  socket.on('create-room', createRoomHandler);
  socket.on('join-room', joinRoomHandler);
  socket.on('leave-room', leaveRoomHandler);
  socket.on('send-message', sendMessageHandler);
}