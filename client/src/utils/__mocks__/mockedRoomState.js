// @flow
import type { RoomT } from 'common/types';

export let room: ?RoomT = undefined;
export const setRoom = (r: ?RoomT): void => { room = r };

const mockedRoomState = { room, setRoom}; 

export default mockedRoomState;