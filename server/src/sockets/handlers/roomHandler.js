// @flow
const {
  createRoom,
  removeRoom,
  emitRoomMessage,
  joinUserToRoomById,
} = require('utils/roomUtils');

const {
  createUser,
  removeUserFromRoom,
  removeUser,
  getUserRoom,
  removeUserById,
  getOwner,
  getUser,
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
  UserInLobbyT,
  UsersInLobbyCallbackT,
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
    removeUserById(data.user.id, users, rooms, io);
    socket.emit('left-room');
  }

  const sendMessageHandler = (
    data: MessageT,
    callback: ErrorCallBackT,
  ): void => {
    if(!users[data.sender.id]) return callback({error: 'disconnection error'});
    const room = getUserRoom(data.sender, rooms);
    if(!room) return callback({error: 'disconnection error'});
    emitRoomMessage(room, data, socket);
  }

  const getOwnerSocket = (roomId: string): ?any => {
    const owner = getOwner(roomId, users, rooms);
    if (!owner) return null;
    return io.sockets.sockets.get(owner.id);
  };

  const getUsersInLobbyHandler = (
    errorCallback: ErrorCallBackT,
    successCallback: UsersInLobbyCallbackT
  ): void => {
    const user = getUser(socket.id, users);
    if (!user) return console.error({ error: "couldn't find user" });
    const ownerSocket = getOwnerSocket(user.roomId);
    if (!ownerSocket)
      return errorCallback({ error: "couldn't get owner socket" });
    ownerSocket.emit("get-users-in-lobby", (response: Array<UserInLobbyT>) => {
      successCallback(response);
    });
  };

  socket.on('create-room', createRoomHandler);
  socket.on('join-room', joinRoomHandler);
  socket.on('leave-room', leaveRoomHandler);
  socket.on('send-message', sendMessageHandler);
  socket.on('get-users-in-lobby', getUsersInLobbyHandler);
}