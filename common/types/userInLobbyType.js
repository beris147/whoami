// @flow
import type { UserReadyStateT } from "./userReadyStateType";
import type { UserT } from "./userType";

export type UserInLobbyT = {|
  ...UserT,
  state: UserReadyStateT,
|};
