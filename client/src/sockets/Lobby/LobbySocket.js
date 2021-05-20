// @flow
import errorCallBack from 'utils/errorCallBack';

import type { GameT, UserInLobbyT, UsersInLobbyCallbackT } from 'common/types';

type CallbackForUsersInLobbyCallbackT = 
  (callback: UsersInLobbyCallbackT) => void;

export type LobbySocketT = {
  emitGetUsersInLobby: (callback: UsersInLobbyCallbackT) => void,
  emitUserJoined: () => void,
  subscribeToGetUsersInLobby: (callback: CallbackForUsersInLobbyCallbackT) => void,
  subscribeToUserIsNotReady: (callback: (user: UserInLobbyT) => void) => void,
  subscribeToUserIsReady: (callback: (user: UserInLobbyT) => void) => void,
  subscribeToGameStarted: (callback: (game: GameT) => void) => void,
  unsubscribeFromGetUsersInLobby: () => void,
  unsubscribeFromUserIsNotReady: () => void,
  unsubscribeFromUserIsReady: () => void,
  unsubscribeFromGameStarted: () => void,
}

export const useLobbySocket = (socket: any): LobbySocketT => {
  const emitUserJoined = () => {
    socket.emit('user-joined');
  }
  const emitGetUsersInLobby = (callback) => {
    socket.emit('get-users-in-lobby', errorCallBack, callback);
  }
  const subscribeToGetUsersInLobby = (callback) => {
    socket.on('get-users-in-lobby', callback);
  }
  const subscribeToUserIsReady = (callback) => {
    socket.on('user-is-ready', callback);
  }
  const subscribeToUserIsNotReady = (callback) => {
    socket.on('user-is-not-ready', callback);
  }
  const subscribeToGameStarted = (callback) => {
    socket.on('game-started', callback);
  }
  const unsubscribeFromGetUsersInLobby = () => {
    socket.off('get-users-in-lobby');
  }
  const unsubscribeFromUserIsReady = () => {
    socket.off('user-is-ready');
  }
  const unsubscribeFromUserIsNotReady = () => {
    socket.off('user-is-not-ready');
  }
  const unsubscribeFromGameStarted = () => {
    socket.off('game-started');
  }
  return {
    emitGetUsersInLobby,
    emitUserJoined,
    subscribeToGetUsersInLobby,
    subscribeToUserIsNotReady,
    subscribeToUserIsReady,
    subscribeToGameStarted,
    unsubscribeFromGetUsersInLobby,
    unsubscribeFromUserIsNotReady,
    unsubscribeFromUserIsReady,
    unsubscribeFromGameStarted,
  }
}
