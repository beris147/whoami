// @flow
import errorCallBack from 'utils/errorCallBack';

export type ReadyFormSocketT = {
  emitUserIsReady: (character: string) => void,
  emitUserIsNotReady: () => void,
}

export const useReadyFormSocket = (socket: any): ReadyFormSocketT => {
  const emitUserIsReady = (character) => 
    socket.emit('set-ready-lobby', character, errorCallBack);
  const emitUserIsNotReady = () => 
    socket.emit('change-not-ready-lobby', errorCallBack);
  return {
    emitUserIsReady,
    emitUserIsNotReady,
  }
}
