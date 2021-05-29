// @flow
import { useContext, useEffect } from 'react';
import RoomContext from 'contexts/RoomContext';
import UserContext from 'contexts/UserContext';
import SocketContext from 'contexts/SocketContext';
import { useHistory } from 'react-router-dom';
import { useJoinRoomSocket } from 'sockets/JoinRoomSocket';

import type { JoinRoomRequestT } from 'domain/models/RoomModels';
import type { UserJoinedRoomT } from 'domain/models/UserModels';
export type JoinRoomAppT = {
  joinRoomRequest: (username: string, roomId: string) => void,
};

export const useJoinRoomApp = (): JoinRoomAppT => {
  const roomContext = useContext(RoomContext);
  const userContext = useContext(UserContext);
  const socketContext = useContext(SocketContext);
  const socket = useJoinRoomSocket(socketContext);
  const history = useHistory();

  const joinRoomRequest = (username: string, roomId: string) => {
    const data: JoinRoomRequestT = { username, roomId };
    socket.emitJoinRoom(data);
  };
  useEffect(() => {
    socket.onJoinedRoom(({ room, user }: UserJoinedRoomT) => {
      roomContext.setRoom(room);
      userContext.setUser(user);
      history.push(`/room/${room.id}`);
    });
    return () => {
      socket.offJoinedRoom();
    };
  }, [history, roomContext, socket, userContext]);
  return {
    joinRoomRequest,
  };
};
