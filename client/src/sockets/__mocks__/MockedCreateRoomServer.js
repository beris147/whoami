// @flow
import { serverSocket } from 'utils/__mocks__/MockedSocketIO';
import { room } from 'utils/__mocks__/mockedRoomState';
import { user } from 'utils/__mocks__/mockedUserState';

import type { CreateRoomRequestT } from 'common/types';

type CreateRoomServerT = { 
  onEvents: () => void,
  offEvents: () => void,
}

export const useCreateRoomServer = (): CreateRoomServerT => {
  const onEvents = () => {
    serverSocket.on('create-room', (data: CreateRoomRequestT) => {
      serverSocket.emit('joined-room', {room, user});
    });
  }
  const offEvents = () => {
    serverSocket.off('create-room');
  }
  return {
    onEvents,
    offEvents,
  };
}
