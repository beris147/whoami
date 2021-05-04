// @flow
import { ROOMID } from './mockedRoomState'; 
import type { UserT } from 'common/types';

export const USERNAME: string = 'mock-username';
export const USERID: string = 'user-id';

export let user: ?UserT = {
  id: USERID,
  username: USERNAME,
  roomId: ROOMID,
};
export const setUser: (u: ?UserT) => void = (u: ?UserT): void => { user = u };

const mockedUserState = { user, setUser };

export default mockedUserState;