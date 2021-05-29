// @flow
import {
  createRoom,
  removeRoom,
  emitRoomMessage,
  joinUserToRoomById,
  emitToRoom,
} from 'utils/roomUtils';

import {
  createUser,
  removeUserFromRoom,
  removeUser,
  getUserRoom,
  removeUserById,
  getOwner,
  getUser,
  emitUserJoinedRoom,
} from 'utils/userUtils';

import type { ErrorCallbackT } from 'domain/models/ErrorModels';
import type { MessageT } from 'domain/models/MessageModels';
import type {
  CreateRoomRequestT,
  JoinRoomRequestT,
  RoomT,
  RoomSetT,
} from 'domain/models/RoomModels';
import type {
  UserT,
  UserSetT,
  UsersInLobbyListT,
  UsersInLobbyCallbackT,
  UserIsReadyT,
  UserIsNotReadyT,
} from 'domain/models/UserModels';

const roomHandler = (
  io: Object,
  socket: Object,
  rooms: RoomSetT,
  users: UserSetT
) => {
  const createRoomHandler = (
    data: CreateRoomRequestT,
    callback: ErrorCallbackT
  ): void => {
    const newRoom = createRoom(data.username, rooms);
    const user = createUser(socket.id, data.username, newRoom.id, users);
    const { room, error } = joinUserToRoomById(
      socket,
      newRoom.id,
      user,
      io,
      rooms
    );
    if (error) return callback(error);
    if (room) emitUserJoinedRoom(room, user, socket);
  };

  const joinRoomHandler = (
    data: JoinRoomRequestT,
    callback: ErrorCallbackT
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
    if (room) emitUserJoinedRoom(room, user, socket);
  };

  const leaveRoomHandler = (errorCallback: ErrorCallbackT): void => {
    const user = getUser(socket.id, users);
    if (!user) return errorCallback('connection error, user not found');
    removeUserById(user.id, users, rooms, io);
    socket.emit('left-room');
  };

  const sendMessageHandler = (
    data: MessageT,
    callback: ErrorCallbackT
  ): void => {
    if (!users[data.sender.id]) return callback('disconnection error');
    const room = getUserRoom(data.sender, rooms);
    if (!room) return callback('disconnection error');
    emitRoomMessage(room, data, socket);
  };

  const getOwnerSocket = (roomId: string): ?any => {
    const owner = getOwner(roomId, users, rooms);
    if (!owner) return null;
    return io.sockets.sockets.get(owner.id);
  };

  const getUsersInLobbyHandler = (
    errorCallback: ErrorCallbackT,
    successCallback: UsersInLobbyCallbackT
  ): void => {
    const user = getUser(socket.id, users);
    if (!user) return console.error("couldn't find user");
    const ownerSocket = getOwnerSocket(user.roomId);
    if (!ownerSocket) return errorCallback("couldn't get owner socket");
    ownerSocket.emit('get-users-in-lobby', (response: UsersInLobbyListT) => {
      successCallback(response);
    });
  };

  const userJoinedLobbyHandler = (): void => {
    const user = getUser(socket.id, users);
    if (!user) return console.error("couldn't find user");
    emitToRoom(user.roomId, 'user-joined', user.username, io);
  };

  const setReadyInLobbyHandler = (
    writtenCharacter: string,
    errorCallback: ErrorCallbackT
  ): void => {
    const user = getUser(socket.id, users);
    if (!user) return errorCallback('connection error, user not found');
    const userIsReady: UserIsReadyT = {
      username: user.username,
      writtenCharacter,
    };
    emitToRoom(user.roomId, 'user-is-ready', userIsReady, io);
  };

  const changeNotReadyInLobbyHandler = (
    errorCallback: ErrorCallbackT
  ): void => {
    const user = getUser(socket.id, users);
    if (!user) return errorCallback('connection error, user not found');
    const userIsNotReady: UserIsNotReadyT = {
      username: user.username,
    };
    emitToRoom(user.roomId, 'user-is-not-ready', userIsNotReady, io);
  };

  socket.on('create-room', createRoomHandler);
  socket.on('join-room', joinRoomHandler);
  socket.on('leave-room', leaveRoomHandler);
  socket.on('send-message', sendMessageHandler);
  socket.on('get-users-in-lobby', getUsersInLobbyHandler);
  socket.on('user-joined', userJoinedLobbyHandler);
  socket.on('set-ready-lobby', setReadyInLobbyHandler);
  socket.on('change-not-ready-lobby', changeNotReadyInLobbyHandler);
};

export default roomHandler;
