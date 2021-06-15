// @flow
import { removeUserById } from 'utils/userUtils';

import type { RoomSetT } from 'domain/models/RoomModels';
import type { UserSetT } from 'domain/models/UserModels';

const userHandler = (
  io: Object,
  socket: Object,
  rooms: RoomSetT,
  users: UserSetT
) => {
  const disconnect = (): void => {
    console.log(`Client ${socket.id} disconnected`);
    removeUserById(socket.id, users, rooms, io);
  };

  socket.on('disconnect', disconnect);
};

export default userHandler;
