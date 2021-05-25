// @flow
import errorCallBack from 'utils/errorCallBack';
import type { JoinRoomRequestT, UserJoinedRoomT } from 'common/types';

export type JoinRoomSocketT = {
  emitJoinRoom: (data: JoinRoomRequestT) => void,
  onJoinedRoom: (callback: (data: UserJoinedRoomT) => void) => void,
  offJoinedRoom: () => void, 
}

export const useJoinRoomSocket = (socket: any): JoinRoomSocketT => {
  const emitJoinRoom = (data) => 
    socket.emit('join-room', data, errorCallBack);
  const onJoinedRoom = (callback) => socket.on('joined-room', callback);
  const offJoinedRoom = () => socket.off('joined-room');
  return {
    emitJoinRoom,
    onJoinedRoom,
    offJoinedRoom,
  }
}
