// @flow
import roomHandler from 'sockets/handlers/roomHandler';
import userHandler from 'sockets/handlers/userHandler';
import gameHandler from 'sockets/handlers/gameHandler';

import type { RoomSetT } from 'domain/models/RoomModels';
import type { UserSetT } from 'domain/models/UserModels';

export const connect = (io: any, rooms: RoomSetT, users: UserSetT) => {
  io.on('connection', (socket: any): void => {
    console.log(`New client connected with socket ${socket.id}`);
    roomHandler(io, socket, rooms, users);
    userHandler(io, socket, rooms, users);
    gameHandler(io, socket, rooms, users);
  });
};
