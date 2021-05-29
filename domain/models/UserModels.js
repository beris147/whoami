// @flow
import type { RoomIdT, RoomT } from './RoomModels';

export type UsernameT = string;
export type UserIdT = string;

export type UserT = {
  id: UserIdT,
  username: UsernameT,
  roomId: RoomIdT,
};

export type UserSetT = { [UsernameT]: UserT };

export type UserJoinedRoomT = {
  room: RoomT,
  user: UserT,
};

export type UserIsNotReadyT = {
  username: UsernameT,
};

export type UserIsReadyT = {
  username: UsernameT,
  writtenCharacter: string,
};

export type UserInLobbyT = UserIsReadyT | UserIsNotReadyT;

export type UsersInLobbyListT = Array<UserInLobbyT>;

export type UsersInLobbyCallbackT = (users: UsersInLobbyListT) => void;

export type UserInGameT = {
  username: UsernameT,
  assignedCharacter: string,
  points: number,
};
