// @flow
import errorCallBack from 'utils/errorCallBack';
import type { CreateRoomRequestT, UserJoinedRoomT } from 'common/types';

type CreateRoomSocketT = {
  subscribeToJoinedRoom: (callback: (data: UserJoinedRoomT) => void) => void,
  unsubscribeFromJoinedRoom: () => void,
  emitCreateRoom: (data: CreateRoomRequestT) => void,
}

export const useCreateRoomSocket = (socket: any): CreateRoomSocketT => {
  const emitCreateRoom = (data) => {
    socket.emit('create-room', data, errorCallBack);
  };
  const subscribeToJoinedRoom = (callback) => {
    socket.on('joined-room', callback);
  };
  const unsubscribeFromJoinedRoom = () => {
    socket.off('joined-room');
  };
  return {
    emitCreateRoom,
    subscribeToJoinedRoom,
    unsubscribeFromJoinedRoom,
  }
}
