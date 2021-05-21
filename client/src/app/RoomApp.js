// @flow
import { useContext } from 'react';
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
} from 'domain/logic/RoomDomainLogic';

import type { RoomT } from 'common/types';

export type RoomAppT = {
  roomId: string,
  subscribeToEvents: () => void,
  unsubscribeFromEvents: () => void,
  room: RoomT,
} 

export const useRoomApp = (): ?RoomAppT => {
  const { room, setRoom } = useContext(RoomContext);
  const socketContext = useContext(SocketContext);
  const socket = useRoomSocket(socketContext);
	const isMounted = useIsMounted();
  const history = useHistory();

  if(!room) return undefined;
  const updateRoom = (newRoom: ?RoomT): void => {
    if(isMounted.current) setRoom(newRoom);
  }
  const userJoined = (username: string) => {
    const updatedRoom = addUserToRoom(username, room);
    updateRoom(updatedRoom);
  }
  const userLeft = (username: string) => {
    const updatedRoom = removeUserFromRoom(username, room);
    updateRoom(updatedRoom);
  }
  const leftRoom = () => {
    const removedRoom = removeRoom(room);
    history.push('/');
    updateRoom(removedRoom);
  }
  const roomOwnerChanged = (username: string) => {
    const updatedRoom = changeRoomOwner(username, room);
    updateRoom(updatedRoom);
  } 
  const subscribeToEvents = () => {
    socket.subscribeToLeftRoom(leftRoom);
    socket.subscribeToRoomOwnerChanged(roomOwnerChanged);
    socket.subscribeToUserJoined(userJoined);
    socket.subscribeToUserLeft(userLeft);
  }
  const unsubscribeFromEvents = () => {
    socket.unsubscribeFromLeftRoom();
    socket.unsubscribeFromRoomOwnerChanged();
    socket.unsubscribeFromUserJoined();
    socket.unsubscribeFromUserLeft();
  }
  return {
    roomId: room.id,
    subscribeToEvents,
    unsubscribeFromEvents,
    room,
  };
}
