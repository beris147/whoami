// @flow
import { useCallback } from 'react';
import errorCallBack from 'utils/errorCallBack';
import type { CreateRoomRequestT, UserJoinedRoomT } from 'common/types';

type CreateRoomSocketT = {
  subscribeToJoinedRoom: (callback: (data: UserJoinedRoomT) => void) => void,
  unsubscribeFromJoinedRoom: () => void,
  emitCreateRoom: (data: CreateRoomRequestT) => void,
}

export const useCreateRoomSocket = (socket: any): CreateRoomSocketT => {
  const emitCreateRoom = useCallback((data) => {
    socket.emit('create-room', data, errorCallBack);
  }, [socket]);
  const subscribeToJoinedRoom = useCallback((callback) => {
    socket.on('joined-room', callback);
  }, [socket]);
  const unsubscribeFromJoinedRoom = useCallback(() => {
    socket.off('joined-room');
  }, [socket]);
  return {
    emitCreateRoom,
    subscribeToJoinedRoom,
    unsubscribeFromJoinedRoom,
  }
}
