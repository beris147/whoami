// @flow
import { serverSocket } from 'utils/__mocks__/MockedSocketIO';
import { room } from 'utils/__mocks__/mockedRoomState';
import { user } from 'utils/__mocks__/mockedUserState';

import type { JoinRoomRequestT } from 'common/types';

type JoinRoomServerT = { 
  subscribeToEvents: () => void,
  unsubscribeFromEvents: () => void,
}

export const useJoinRoomServer = (): JoinRoomServerT => {
  const subscribeToEvents = () => {
    serverSocket.on('join-room', (data: JoinRoomRequestT) => {
      serverSocket.emit('joined-room', {room, user});
    });
  }
  const unsubscribeFromEvents = () => {
    serverSocket.off('join-room');
  }
  return {
    subscribeToEvents,
    unsubscribeFromEvents,
  };
}
