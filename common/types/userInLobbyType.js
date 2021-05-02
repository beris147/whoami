// @flow
import type { UserIsReadyT } from "./userIsReadyType";
import type { UserIsNotReadyT } from "./userIsNotReadyType";


export type UserInLobbyT = UserIsReadyT | UserIsNotReadyT;
