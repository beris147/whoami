// @flow
import { useContext } from 'react';
import SocketContext from 'contexts/SocketContext';
import { useCreateRoomSocket } from 'sockets/CreateRoomSocket';

import type { CreateRoomRequestT } from 'domain/models/RoomModels';

export type CreateRoomAppT = {
  createRoomRequest: (username: string) => void,
};

export const useCreateRoomApp = (): CreateRoomAppT => {
  const socketContext = useContext(SocketContext);
  const socket = useCreateRoomSocket(socketContext);
  const createRoomRequest = (username: string) => {
    const data: CreateRoomRequestT = { username };
    socket.emitCreateRoom(data);
  };
  return {
    createRoomRequest,
  };
};
