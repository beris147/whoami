// @flow
const {
  createRoom,
  removeRoom,
  emitRoomMessage,
  joinUserToRoomById,
  emitToRoom,
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
  MessageT, 
  UserInLobbyT,
  UsersInLobbyCallbackT,
  UserIsReadyT,
  UserIsNotReadyT,
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
    errorCallback: ErrorCallBackT,
  ): void => {
    const user = getUser(socket.id, users);
    if(!user) return errorCallback({error: 'connection error, user not found'});
    removeUserById(user.id, users, rooms, io);
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

  const userJoinedLobbyHandler = (
  ): void => {
    const user = getUser(socket.id, users);
    if (!user) return console.error({ error: "couldn't find user" });
    emitToRoom(user.roomId, "user-joined", user.username, io);
  }

  const setReadyInLobbyHandler = (
    writtenCharacter: string,
    errorCallBack: ErrorCallBackT,
  ): void => {
    const user = getUser(socket.id, users);
    if(!user) return errorCallBack({error: 'connection error, user not found'});
    const userIsReady: UserIsReadyT = {
      username: user.username,
      writtenCharacter,
    }
    emitToRoom(user.roomId, 'user-is-ready', userIsReady, io);
  }

  const changeNotReadyInLobbyHandler = (
    errorCallBack: ErrorCallBackT
  ): void => {
    const user = getUser(socket.id, users);
    if(!user) return errorCallBack({error: 'connection error, user not found'});
    const userIsNotReady: UserIsNotReadyT = {
      username: user.username,
    }
    emitToRoom(user.roomId, 'user-is-not-ready', userIsNotReady, io);
  }

  const startGameHandler = (
    errorCallBack: ErrorCallBackT,
  ) => {
    const user = getUser(socket.id, users);
    if(!user) return errorCallBack({error: 'connection error, user not found'});
    emitToRoom(user.roomId, 'game-started', null, io);
  };

  socket.on('create-room', createRoomHandler);
  socket.on('join-room', joinRoomHandler);
  socket.on('leave-room', leaveRoomHandler);
  socket.on('send-message', sendMessageHandler);
  socket.on('get-users-in-lobby', getUsersInLobbyHandler);
  socket.on('user-joined', userJoinedLobbyHandler);
  socket.on('set-ready-lobby', setReadyInLobbyHandler);
  socket.on('change-not-ready-lobby', changeNotReadyInLobbyHandler);
  socket.on('start-game', startGameHandler);
}