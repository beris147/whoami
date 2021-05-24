// @flow
import { useContext } from 'react';
import RoomContext from 'contexts/RoomContext';
import UserContext from 'contexts/UserContext';
import SocketContext from 'contexts/SocketContext';
import { useHistory } from 'react-router-dom';
import { useCreateRoomSocket } from 'sockets/CreateRoomSocket';

import type { CreateRoomRequestT, UserJoinedRoomT } from 'common/types';

export type CreateRoomAppT = {
  createRoom: (username: string) => void,
  subscribeToEvents: () => void,
  unsubscribeFromEvents: () => void,
}

export const useCreateRoomApp = (): CreateRoomAppT => {
  const roomContext = useContext(RoomContext);
  const userContext = useContext(UserContext);
  const socketContext = useContext(SocketContext);
  const history = useHistory();
  
  const socket = useCreateRoomSocket(socketContext);
  const joinRoom = ({ room, user }: UserJoinedRoomT) => {
    roomContext.setRoom(room);
    userContext.setUser(user);
    history.push(`/room/${room.id}`);
  }
  const createRoom = (username: string) => {
    const data: CreateRoomRequestT = { username }; 
    socket.emitCreateRoom(data);
  }
  const subscribeToEvents = () => {
    socket.subscribeToJoinedRoom(joinRoom);
  }
  const unsubscribeFromEvents = () => {
    socket.unsubscribeFromJoinedRoom();
  }
  return {
    createRoom,
    subscribeToEvents,
    unsubscribeFromEvents,
  };
}
