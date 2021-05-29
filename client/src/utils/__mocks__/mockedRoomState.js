// @flow
import { USERNAME } from './mockedUserState';

import type { RoomT } from 'domain/models/RoomModels';

export const ROOMID = 'roomId';

export let room: ?RoomT = {
  id: ROOMID,
  owner: USERNAME,
  users: [USERNAME],
};
export const setRoom = (r: ?RoomT): void => {
  room = r;
};

const mockedRoomState = { room, setRoom };

export default mockedRoomState;
