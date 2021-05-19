// @flow
import { serverSocket } from 'utils/__mocks__/MockedSocketIO';
import { room } from 'utils/__mocks__/mockedRoomState';
import { user } from 'utils/__mocks__/mockedUserState';

type CreateRoomServerT = { 
  subscribeToEvents: () => void,
  unsubscribeFromEvents: () => void,
}

export const useCreateRoomServer = (): CreateRoomServerT => {
  const subscribeToEvents = () => {
    serverSocket.on('create-room', (username) => {
      serverSocket.emit('joined-room', {room, user});
    });
  }
  const unsubscribeFromEvents = () => {
    serverSocket.off('create-room');
  }
  return {
    subscribeToEvents,
    unsubscribeFromEvents,
  };
}
