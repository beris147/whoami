// @flow

export type UsernameT = string;

export type CharacterT = string;

export type CharacterAssignationT = {[UsernameT]: CharacterT};

export type TryStageT = "ask" | "answer" | "judge";

export type TryInAskStageT = {|
    stage: "ask",
|};

export type QuestionT = string;

export type AnswerT = "yes" | "no" | "done";

export type PartialAnswerListT = {[UsernameT]: ?AnswerT};

export type TryInAnswerStageT = {|
    stage: "answer",
    question: QuestionT,
    answers: PartialAnswerListT,
|};

export type TryInJudgeStageT = {|
    stage: "judge",
    question: QuestionT,
    answers: AnswerListT,
|};

export type AnswerListT = {[UsernameT]: AnswerT};

export type OngoingTryT = TryInAskStageT | TryInAnswerStageT | TryInJudgeStageT;

export type TryT = {|
    question: QuestionT,
    verdict: AnswerT,
|}

export type TryListT = Array<TryT>;

export type OngoingTurnT = {|
    user: UsernameT,
    ongoingTry: OngoingTryT, 
    tries: TryListT,
|};

export type TurnT = {|
    user: UsernameT,
    tries: TryListT,
|};

export type TurnListT = Array<TurnT>;

export type UsernameListT = Array<UsernameT>;

export type OngoingGameT = {|
    user: UsernameListT,
    ongoingTurn: OngoingTurnT, 
    turns: TurnListT,
|};