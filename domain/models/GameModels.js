// @flow
import type { UserInGameT } from './UserModels';

export type GameT = {
  round: number,
  turn: number,
  users: Array<UserInGameT>,
};

export type QuestionT = string;

export type AnswerT = 'yes' | 'no' | 'done';

export type TryT = {|
  question: QuestionT,
  verdict: AnswerT,
|};

export type TryListT = Array<TryT>;

export type UsernameT = string;

export type TurnT = {|
  user: UsernameT,
  tries: TryListT,
|};

export type TurnListT = Array<TurnT>;

export type CharacterT = string;

export type CharacterAssignationT = { [UsernameT]: CharacterT };

export type GameInAskStageT = {|
  characterAssignation: CharacterAssignationT,
  turns: TurnListT,
  ongoingTurn: TurnT,
|};

export type PartialAnswerListT = { [UsernameT]: ?AnswerT };

export type GameInAnswerStageT = {|
  characterAssignation: CharacterAssignationT,
  turns: TurnListT,
  ongoingTurn: TurnT,
  question: QuestionT,
  answers: PartialAnswerListT,
|};

export type AnswerListT = { [UsernameT]: ?AnswerT };

export type GameInJudgeStageT = {|
  characterAssignation: CharacterAssignationT,
  turns: TurnListT,
  ongoingTurn: TurnT,
  question: QuestionT,
  verdict: AnswerT,
|};
