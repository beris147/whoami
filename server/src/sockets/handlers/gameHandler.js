// @flow
import { getUser } from 'utils/userUtils';
import { emitToRoom } from 'utils/roomUtils';

import type { ErrorCallbackT } from 'domain/models/ErrorModels';
import type { GameT } from 'domain/models/GameModels';
import type { RoomSetT } from 'domain/models/RoomModels';
import type { UserSetT } from 'domain/models/UserModels';

const gameHandler = (
  io: Object,
  socket: Object,
  rooms: RoomSetT,
  users: UserSetT
) => {
  const startGameHandler = (game: GameT, errorCallback: ErrorCallbackT) => {
    const user = getUser(socket.id, users);
    if (!user) return errorCallback('connection error, user not found');
    emitToRoom(user.roomId, 'game-started', game, io);
  };

  const nextTurnHandler = (errorCallback: ErrorCallbackT) => {
    const user = getUser(socket.id, users);
    if (!user) return errorCallback('connection error, user not found');
    emitToRoom(user.roomId, 'next-turn', null, io);
  };

  const gameOverHandler = (errorCallback: ErrorCallbackT) => {
    const user = getUser(socket.id, users);
    if (!user) return errorCallback('connection error, user not found');
    emitToRoom(user.roomId, 'game-over', null, io);
  };

  const sendAnswerHanlder = (
    answer: boolean,
    errorCallback: ErrorCallbackT
  ) => {
    const user = getUser(socket.id, users);
    if (!user) return errorCallback('connection error, user not found');
    // TODO if we store the sockets id in the room, we can comunicate directly
    // to the user that is currently playing instead of sending this to the room
    emitToRoom(user.roomId, 'send-answer', answer, io);
  };

  const userGotItHandler = (
    username: string,
    errorCallback: ErrorCallbackT
  ) => {
    const user = getUser(socket.id, users);
    if (!user) return errorCallback('connection error, user not found');
    // TODO if we store the sockets id in the room, we can comunicate directly
    // to the user that is currently playing instead of sending this to the room
    emitToRoom(user.roomId, 'user-got-it', username, io);
  };

  socket.on('start-game', startGameHandler);
  socket.on('next-turn', nextTurnHandler);
  socket.on('game-over', gameOverHandler);
  socket.on('send-answer', sendAnswerHanlder);
  socket.on('user-got-it', userGotItHandler);
};

export default gameHandler;
