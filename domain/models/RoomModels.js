// @flow
import type { ErrorT } from './ErrorModels';
import type { UsernameT } from './UserModels';

export type RoomIdT = string;

export type RoomT = {
  id: RoomIdT,
  users: Array<UsernameT>,
  owner: UsernameT,
};

export type RoomSetT = { [RoomIdT]: RoomT };

export type CreateRoomRequestT = {
  username: UsernameT,
};

export type JoinRoomRequestT = {
  username: UsernameT,
  roomId: RoomIdT,
};

export type JoinRoomResponseT = {
  room: ?RoomT,
  error: ?ErrorT,
};
