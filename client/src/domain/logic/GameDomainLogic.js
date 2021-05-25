// @flow
import type { GameT, UserInGameT } from 'common/types';

import type {
  CharacterAssignationT,
  GameInAskStageT,
  QuestionT,
  PartialAnswerListT,
  AnswerT,
  UsernameT,
  GameInAnswerStageT,
  GameInJudgeStageT,
  AnswerListT,
  // TurnListT,
  TryT,
  TurnT,
} from 'domain/models/GameDomainModels';

import type { UsersInLobbyListT } from 'domain/models/LobbyDomainModels';

const shuffleList = (list: Array<string>): Array<string> => {
  const len = list.length;
  let shuffledList: Array<string> = list;
  for (let i = 0; i < len - 1; i++) { 
    let j = Math.floor(Math.random() * (len-(i+1)) ) + (i+1);
    let temp = shuffledList[i];
    shuffledList[i] = shuffledList[j];
    shuffledList[j] = temp;
  }
  return shuffledList;
}

export const createGame = (userList: UsersInLobbyListT): GameT => {
  const characters: Array<string> = userList.map(
    (user): string => user.writtenCharacter || 'random character'
  );
  const shuffledCharacters: Array<string> = shuffleList(characters);
  const usersInGame: Array<UserInGameT> =
    shuffledCharacters.map(
      (character, i): UserInGameT => {
        return {
          username: userList[i].username,
          assignedCharacter: character,
          points: 0,
        }
      }
    );
  return {
    round: 0,
    turn: 0,
    users: usersInGame,
  }
}

export const startGame = (
  characterAssignation: CharacterAssignationT
): GameInAskStageT => ({
  characterAssignation: characterAssignation,
  turns: [],
  ongoingTurn: {
    user: Object.keys(characterAssignation)[0],
    tries: [],
  },
});

const createPartialAnswerList = (game: GameInAskStageT): PartialAnswerListT => {
  const answers = Object.keys(game.characterAssignation)
    .filter((user) => user !== game.ongoingTurn.user)
    .reduce(
      (obj: PartialAnswerListT, user): PartialAnswerListT => ({
        ...obj,
        [user]: null,
      }),
      {}
    );
  return answers;
};

export const ask = (
  game: GameInAskStageT,
  question: QuestionT
): GameInAnswerStageT => ({
  ...game,
  question: question,
  answers: createPartialAnswerList(game),
});

const judge = (answers: AnswerListT): AnswerT => {
  const countAnswer = (answers: AnswerListT, targetAnswer: AnswerT) => {
    return Object.values(answers).filter((answer) => answer === targetAnswer)
      .length;
  };
  const yes = countAnswer(answers, 'yes');
  const no = countAnswer(answers, 'no');
  const done = countAnswer(answers, 'done');
  const max = Math.max(yes, no, done);
  if (done === max) return 'done';
  if (yes === max) return 'yes';
  return 'no';
};

const createGameInJudgeStage = (
  game: GameInAnswerStageT,
  verdict: AnswerT
): GameInJudgeStageT => ({
  characterAssignation: game.characterAssignation,
  turns: game.turns,
  ongoingTurn: game.ongoingTurn,
  question: game.question,
  verdict: verdict,
});

export const answer = (
  game: GameInAnswerStageT,
  user: UsernameT,
  answer: AnswerT
): GameInAnswerStageT | GameInJudgeStageT => {
  const answers: PartialAnswerListT = {
    ...game.answers,
    [user]: answer,
  };
  const completeAnswers: AnswerListT = Object.keys(answers).reduce(
    (obj: AnswerListT, user): AnswerListT => {
      const answer: ?AnswerT = answers[user];
      return answer
        ? {
            ...obj,
            user: answer,
          }
        : obj;
    },
    {}
  );
  const gameInAnswerStage: GameInAnswerStageT = {
    ...game,
    answers: answers,
  };
  const gameInJudgeStageT = createGameInJudgeStage(
    game,
    judge(completeAnswers)
  );
  return completeAnswers === answers ? gameInAnswerStage : gameInJudgeStageT;
};

export const nextTry = (game: GameInJudgeStageT): GameInAskStageT => {
  const completedTry: TryT = {
    question: game.question,
    verdict: game.verdict,
  };
  const tries = [...game.ongoingTurn.tries, completedTry];
  const turn: TurnT = {
    ...game.ongoingTurn,
    tries: tries,
  };
  if (game.verdict === 'yes') {
    return {
      characterAssignation: game.characterAssignation,
      turns: game.turns,
      ongoingTurn: turn,
    };
  }
  const usernames = Object.keys(game.characterAssignation);
  const userIdx = usernames.findIndex((user) => user === game.ongoingTurn.user);
  const nextPlayerIdx = (userIdx + 1) % usernames.length; // Doesn't work, need to check if done
  const nextPlayer = usernames[nextPlayerIdx];
  return {
    characterAssignation: game.characterAssignation,
    turns: [...game.turns, turn],
    ongoingTurn: {
      user: nextPlayer,
      tries: [],
    },
  };
};
