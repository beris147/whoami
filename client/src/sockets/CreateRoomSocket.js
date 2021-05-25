// @flow
import errorCallBack from 'utils/errorCallBack';
import type { CreateRoomRequestT } from 'common/types';

export type CreateRoomSocketT = {
  emitCreateRoom: (data: CreateRoomRequestT) => void,
}

export const useCreateRoomSocket = (socket: any): CreateRoomSocketT => {
  const emitCreateRoom = (data) => 
    socket.emit('create-room', data, errorCallBack);
  return {
    emitCreateRoom,
  }
}
