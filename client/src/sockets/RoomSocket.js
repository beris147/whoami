// @flow
export type RoomSocketT = {
  subscribeToUserJoined: (callback: (data: any) => void) => void,
  subscribeToUserLeft:  (callback: (data: any) => void) => void,
  subscribeToLeftRoom: (callback: (data: any) => void) => void,
  subscribeToRoomOwnerChanged: (callback: (data: any) => void) => void,
  unsubscribeFromUserJoined: () => void,
  unsubscribeFromUserLeft: () => void,
  unsubscribeFromLeftRoom: () => void,
  unsubscribeFromRoomOwnerChanged: () => void,
}

export const useRoomSocket = (socket: any): RoomSocketT => {
  const subscribeToUserJoined = (callback) => {
    socket.on('user-joined', callback);    
  }
  const subscribeToUserLeft = (callback) => {
    socket.on('user-left', callback);
  }
  const subscribeToLeftRoom = (callback) => {
    socket.on('left-room', callback);
  }
  const subscribeToRoomOwnerChanged = (callback) => {
    socket.on('room-owner-changed', callback);
  }
  const unsubscribeFromUserJoined = () => {
    socket.off('user-joined');
  }
  const unsubscribeFromUserLeft = () => {
    socket.off('user-left');
  }
  const unsubscribeFromLeftRoom = () => {
    socket.off('left-room');
  }
  const unsubscribeFromRoomOwnerChanged = () => {
    socket.off('room-owner-changed');
  }
  return {
    subscribeToUserJoined,
    subscribeToUserLeft,
    subscribeToLeftRoom,
    subscribeToRoomOwnerChanged,
    unsubscribeFromUserJoined,
    unsubscribeFromUserLeft,
    unsubscribeFromLeftRoom,
    unsubscribeFromRoomOwnerChanged,
  }
}
