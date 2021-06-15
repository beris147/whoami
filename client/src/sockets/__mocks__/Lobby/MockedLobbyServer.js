// @flow
import { serverSocket } from 'utils/__mocks__/MockedSocketIO';

import type {
  UserIsNotReadyT,
  UserIsReadyT,
  UsersInLobbyCallbackT,
} from 'domain/models/UserModels';

type LobbyServerT = {
  emitUserJoined: (username: string) => void,
  emitUserLeft: (username: string) => void,
  emitUserIsNotReady: (user: UserIsNotReadyT) => void,
  emitUserIsReady: (user: UserIsReadyT) => void,
};

export const useLobbyServer = (): LobbyServerT => {
  const emitUserJoined = (username: string) => {
    serverSocket.emit('user-joined', username);
  };
  const emitUserLeft = (username: string) => {
    serverSocket.emit('user-left', username);
  };
  const emitUserIsReady = (user: UserIsReadyT) => {
    serverSocket.emit('user-is-ready', user);
  };
  const emitUserIsNotReady = (user: UserIsNotReadyT) => {
    serverSocket.emit('user-is-not-ready', user);
  };
  return {
    emitUserIsNotReady,
    emitUserIsReady,
    emitUserJoined,
    emitUserLeft,
  };
};
