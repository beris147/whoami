// @flow
import { USERNAME } from './mockedUserState'; 
import type { RoomT } from 'common/types';

export const ROOMID = 'roomId';

export let room: ?RoomT = {
  id: ROOMID,
  owner: USERNAME,
  users: [USERNAME],
  round: 0,
  time: 30,
};
export const setRoom = (r: ?RoomT): void => { room = r };

const mockedRoomState = { room, setRoom}; 

export default mockedRoomState;