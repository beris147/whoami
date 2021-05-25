// @flow
import { useContext } from 'react';
import SocketContext from 'contexts/SocketContext';
import { useCreateRoomSocket } from 'sockets/CreateRoomSocket';

import type { CreateRoomRequestT } from 'common/types';

export type CreateRoomAppT = {
  createRoom: (username: string) => void,
}

export const useCreateRoomApp = (): CreateRoomAppT => {
  const socketContext = useContext(SocketContext);
  const socket = useCreateRoomSocket(socketContext);
  const createRoom = (username: string) => {
    const data: CreateRoomRequestT = { username }; 
    socket.emitCreateRoom(data);
  }
  return {
    createRoom,
  };
}
