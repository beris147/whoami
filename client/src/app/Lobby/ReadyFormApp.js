// @flow
import { useContext } from 'react';
import SocketContext from 'contexts/SocketContext';
import { useReadyFormSocket } from 'sockets/Lobby/ReadyFormSocket';

export type ReadyFormAppT = {
  userIsReady: () => void,
  userIsNotReady: () => void,
}

export const useReadyFormApp = (
  character: string, 
): ReadyFormAppT => {
  const socketContext = useContext(SocketContext);
  const socket = useReadyFormSocket(socketContext);
  const userIsReady = () => socket.emitUserIsReady(character);
  const userIsNotReady = () => socket.emitUserIsNotReady();
  return {
    userIsReady,
    userIsNotReady,
  }
}