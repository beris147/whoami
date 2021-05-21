// @flow
import { serverSocket } from 'utils/__mocks__/MockedSocketIO';

type RoomServerT = { 
  emitLeftRoom: () => void,
  emitUserLeft: (username: string) => void,
  emitUserJoined: (username: string) => void,
  emitRoomOwnerChanged: (username: string) => void,
}

export const useRoomServer = (): RoomServerT => {
  const emitUserJoined = (username: string) => {
    serverSocket.emit('user-joined', username);
  }
  const emitUserLeft = (username: string) => {
    serverSocket.emit('user-left', username);
  }
  const emitRoomOwnerChanged = (username: string) => {
    serverSocket.emit('room-owner-changed', username);
  }
  const emitLeftRoom = () => {
    serverSocket.emit('left-room');
  }
  return {
    emitLeftRoom,
    emitUserJoined,
    emitUserLeft,
    emitRoomOwnerChanged,
  };
}
