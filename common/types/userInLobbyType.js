// @flow
import type { UserReadyStateT } from "./userReadyStateType";

export type UserInLobbyT = {|
  username: string,
  state: UserReadyStateT,
  writtenCharacter?: string,
  assignedCharacter?: string,
|};
