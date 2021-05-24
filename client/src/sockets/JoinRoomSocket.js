// @flow
import errorCallBack from 'utils/errorCallBack';
import type { JoinRoomRequestT, UserJoinedRoomT } from 'common/types';

export type JoinRoomSocketT = {
  emitJoinRoom: (data: JoinRoomRequestT) => void,
  subscribeToJoinedRoom: (callback: (data: UserJoinedRoomT) => void) => void,
  unsubscribeFromJoinedRoom: () => void, 
}

export const useJoinRoomSocket = (socket: any): JoinRoomSocketT => {
  const emitJoinRoom = (data) => {
    socket.emit('join-room', data, errorCallBack);
  }
  const subscribeToJoinedRoom = (callback) => {
    socket.on('joined-room', callback);
  }
  const unsubscribeFromJoinedRoom = () => {
    socket.off('joined-room');
  }
  return {
    emitJoinRoom,
    subscribeToJoinedRoom,
    unsubscribeFromJoinedRoom,
  }
}
