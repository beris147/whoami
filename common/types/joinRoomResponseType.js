// @flow
import type { RoomT } from './roomType';
import type { ErrorT } from './errorType';

export type JoinRoomResponseT = {|
  room: ?RoomT, 
  error: ?ErrorT,
|};