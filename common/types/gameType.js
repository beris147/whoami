// @flow
import type { UserInGameT } from './userInGameType';

export type GameT = {
  round: number,
  turn: number,
  users: Array<UserInGameT>,
}