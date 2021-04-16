// @flow
import type { RoomT } from './roomType';
import type { ErrorT } from './errorType';

export type JoinRequestT = {|
  room: RoomT, 
  error: ?ErrorT,
|};