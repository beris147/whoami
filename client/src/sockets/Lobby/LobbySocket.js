// @flow
import errorCallBack from 'utils/errorCallBack';

// @flow
import type { GameT, UserInLobbyT, UsersInLobbyCallbackT } from 'common/types';
type CallbackForUsersInLobbyCallbackT = 
  (callback: UsersInLobbyCallbackT) => void;

export type LobbySocketT = {
  emitGetUsersInLobby: (callback: UsersInLobbyCallbackT) => void,
  emitUserJoined: () => void,
  emitStartGame: (game: GameT) => void,
  onGetUsersInLobby: (callback: CallbackForUsersInLobbyCallbackT) => void,
  onUserIsNotReady: (callback: (user: UserInLobbyT) => void) => void,
  onUserIsReady: (callback: (user: UserInLobbyT) => void) => void,
  onGameStarted: (callback: (game: GameT) => void) => void,
  offGetUsersInLobby: () => void,
  offUserIsNotReady: () => void,
  offUserIsReady: () => void,
  offGameStarted: () => void,
}

export const useLobbySocket = (socket: any): LobbySocketT => {
  const emitUserJoined = () => socket.emit('user-joined');
  const emitStartGame = (game) =>
    socket.emit('start-game', game, errorCallBack);
  const emitGetUsersInLobby = (callback) => 
    socket.emit('get-users-in-lobby', errorCallBack, callback);
  const onGetUsersInLobby = (callback) => 
    socket.on('get-users-in-lobby', callback);
  const onUserIsReady = (callback) => socket.on('user-is-ready', callback);
  const onUserIsNotReady = (callback) => 
    socket.on('user-is-not-ready', callback);
  const onGameStarted = (callback) => socket.on('game-started', callback);
  const offGetUsersInLobby = () => socket.off('get-users-in-lobby');
  const offUserIsReady = () => socket.off('user-is-ready');
  const offUserIsNotReady = () => socket.off('user-is-not-ready');
  const offGameStarted = () => socket.off('game-started');
  return {
    emitGetUsersInLobby,
    emitUserJoined,
    emitStartGame,
    onGetUsersInLobby,
    onUserIsNotReady,
    onUserIsReady,
    onGameStarted,
    offGetUsersInLobby,
    offUserIsNotReady,
    offUserIsReady,
    offGameStarted,
  }
}
