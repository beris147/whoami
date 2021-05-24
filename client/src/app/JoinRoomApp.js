// @flow
import { useContext } from 'react';
import RoomContext from 'contexts/RoomContext';
import UserContext from 'contexts/UserContext';
import SocketContext from 'contexts/SocketContext';
import { useHistory } from 'react-router-dom';
import { useJoinRoomSocket } from 'sockets/JoinRoomSocket';

import type { JoinRoomRequestT, UserJoinedRoomT } from 'common/types';

export type JoinRoomAppT = {
  joinRoomRequest: (username: string, roomId: string) => void,
  subscribeToEvents: () => void,
  unsubscribeFromEvents: () => void,
}

export const useJoinRoomApp = (): JoinRoomAppT => {
  const roomContext = useContext(RoomContext);
  const userContext = useContext(UserContext);
  const socketContext = useContext(SocketContext);
  const history = useHistory();

  const socket = useJoinRoomSocket(socketContext);
  const joinRoom = ({ room, user }: UserJoinedRoomT) => {
    roomContext.setRoom(room);
    userContext.setUser(user);
    history.push(`/room/${room.id}`);
  }
  const joinRoomRequest = (username: string, roomId: string ) => {
    const data: JoinRoomRequestT = { username, roomId }; 
    socket.emitJoinRoom(data);
  }
  const subscribeToEvents = () => {
    socket.subscribeToJoinedRoom(joinRoom);
  }
  const unsubscribeFromEvents = () => {
    socket.unsubscribeFromJoinedRoom();
  }
  return {
    joinRoomRequest,
    subscribeToEvents,
    unsubscribeFromEvents,
  };
}
