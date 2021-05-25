// @flow
export type RoomSocketT = {
  emitLeaveRoom: () => void,
  onUserJoined: (callback: (data: any) => void) => void,
  onUserLeft:  (callback: (data: any) => void) => void,
  onLeftRoom: (callback: (data: any) => void) => void,
  onRoomOwnerChanged: (callback: (data: any) => void) => void,
  offUserJoined: () => void,
  offUserLeft: () => void,
  offLeftRoom: () => void,
  offRoomOwnerChanged: () => void,
}

export const useRoomSocket = (socket: any): RoomSocketT => {
  const emitLeaveRoom = () => socket.emit('leave-room');
  const onUserJoined = (callback) => socket.on('user-joined', callback);
  const onUserLeft = (callback) => socket.on('user-left', callback);
  const onLeftRoom = (callback) => socket.on('left-room', callback);
  const onRoomOwnerChanged = (callback) => 
    socket.on('room-owner-changed', callback);
  const offUserJoined = () => socket.off('user-joined');
  const offUserLeft = () => socket.off('user-left');
  const offLeftRoom = () => socket.off('left-room');
  const offRoomOwnerChanged = () => socket.off('room-owner-changed');
  return {
    emitLeaveRoom,
    onUserJoined,
    onUserLeft,
    onLeftRoom,
    onRoomOwnerChanged,
    offUserJoined,
    offUserLeft,
    offLeftRoom,
    offRoomOwnerChanged,
  }
}
