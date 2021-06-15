// @flow
import { useContext, useEffect, useCallback } from 'react';
import RoomContext from 'contexts/RoomContext';
import SocketContext from 'contexts/SocketContext';
import { useRoomSocket } from 'sockets/RoomSocket';
import { useIsMounted } from 'utils/hooks/mounted';
import { useHistory } from 'react-router-dom';
import {
  addUserToRoom,
  removeUserFromRoom,
  changeRoomOwner,
  removeRoom,
} from 'domain/logic/RoomLogic';

import type { RoomT } from 'domain/models/RoomModels';

export type RoomAppT = {
  leaveRoomRequest: () => void,
  roomId: string,
};

export const useRoomApp = (): ?RoomAppT => {
  const { room, setRoom } = useContext(RoomContext);
  const socketContext = useContext(SocketContext);
  const socket = useRoomSocket(socketContext);
  const isMounted = useIsMounted();
  const history = useHistory();
  const updateRoom = useCallback(
    (newRoom: ?RoomT): void => {
      if (isMounted.current) setRoom(newRoom);
    },
    [isMounted, setRoom]
  );
  const leaveRoomRequest = () => {
    socket.emitLeaveRoom();
  };
  useEffect(() => {
    if (!room) return;
    socket.onLeftRoom(() => {
      const removedRoom = removeRoom(room);
      history.push('/');
      updateRoom(removedRoom);
    });
    socket.onRoomOwnerChanged((username: string) => {
      const updatedRoom = changeRoomOwner(username, room);
      updateRoom(updatedRoom);
    });
    socket.onUserJoined((username: string) => {
      const updatedRoom = addUserToRoom(username, room);
      updateRoom(updatedRoom);
    });
    socket.onUserLeft((username: string) => {
      const updatedRoom = removeUserFromRoom(username, room);
      updateRoom(updatedRoom);
    });
    return () => {
      socket.offLeftRoom();
      socket.offRoomOwnerChanged();
      socket.offUserJoined();
      socket.offUserLeft();
    };
  }, [socket, history, room, setRoom, updateRoom]);
  if (!room) return undefined;
  return {
    leaveRoomRequest,
    roomId: room.id,
  };
};
