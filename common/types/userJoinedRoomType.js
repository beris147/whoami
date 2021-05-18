// @flow
import type { RoomT } from './roomType';
import type { UserT } from './userType';

export type UserJoinedRoomT = {
  room: RoomT,
  user: UserT,
}