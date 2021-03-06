// @flow
const { getUser } = require('utils/userUtils');
const { emitToRoom } = require('utils/roomUtils');
import type { GameT, RoomSetT, UserSetT, ErrorCallBackT } from 'common/types';

module.exports = (
  io: Object,
  socket: Object,
  rooms: RoomSetT,
  users: UserSetT,
) => {
  const startGameHandler = (
    game: GameT,
    errorCallBack: ErrorCallBackT,
  ) => {
    const user = getUser(socket.id, users);
    if(!user) return errorCallBack({error: 'connection error, user not found'});
    emitToRoom(user.roomId, 'game-started', game, io);
  };

  const nextTurnHandler = (
    errorCallBack: ErrorCallBackT,
  ) => {
    const user = getUser(socket.id, users);
    if(!user) return errorCallBack({error: 'connection error, user not found'});
    emitToRoom(user.roomId, 'next-turn', null, io);
  };

  const gameOverHandler = (
    errorCallBack: ErrorCallBackT,
  ) => {
    const user = getUser(socket.id, users);
    if(!user) return errorCallBack({error: 'connection error, user not found'});
    emitToRoom(user.roomId, 'game-over', null, io);
  };

  const sendAnswerHanlder = (
    answer: bool,
    errorCallBack: ErrorCallBackT,
  ) => {
    const user = getUser(socket.id, users);
    if(!user) return errorCallBack({error: 'connection error, user not found'});
    // TODO if we store the sockets id in the room, we can comunicate directly
    // to the user that is currently playing instead of sending this to the room
    emitToRoom(user.roomId, 'send-answer', answer, io);
  };

  const userGotItHandler = (
    username: string,
    errorCallBack: ErrorCallBackT,
  ) => {
    const user = getUser(socket.id, users);
    if(!user) return errorCallBack({error: 'connection error, user not found'});
    // TODO if we store the sockets id in the room, we can comunicate directly
    // to the user that is currently playing instead of sending this to the room
    emitToRoom(user.roomId, 'user-got-it', username, io);
  }
  
  socket.on('start-game', startGameHandler);
  socket.on('next-turn', nextTurnHandler);
  socket.on('game-over', gameOverHandler);
  socket.on('send-answer', sendAnswerHanlder);
  socket.on('user-got-it', userGotItHandler);
}
