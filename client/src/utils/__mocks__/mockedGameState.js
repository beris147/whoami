// @flow
import { USERNAME } from './mockedUserState';
import type { GameT, UserInGameT } from 'common/types';

const userInGame: UserInGameT = {
  username: USERNAME, 
  assignedCharacter: 'character1',
  points: 0,
}

export let game: ?GameT = {
  turn: 0,
  round: 0,
  users: [userInGame]
};

export const setGame = (g: ?GameT): void => { game = g };

const mockedGameState = { game, setGame}; 

export default mockedGameState;