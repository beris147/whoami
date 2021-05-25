// @flow
import { serverSocket } from 'utils/__mocks__/MockedSocketIO';
import { room } from 'utils/__mocks__/mockedRoomState';
import { user } from 'utils/__mocks__/mockedUserState';

import type { JoinRoomRequestT } from 'common/types';

type JoinRoomServerT = { 
  onEvents: () => void,
  offEvents: () => void,
}

export const useJoinRoomServer = (): JoinRoomServerT => {
  const onEvents = () => {
    serverSocket.on('join-room', (data: JoinRoomRequestT) => {
      serverSocket.emit('joined-room', {room, user});
    });
  }
  const offEvents = () => {
    serverSocket.off('join-room');
  }
  return {
    onEvents,
    offEvents,
  };
}
