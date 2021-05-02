// @flow
import type { UserT } from 'common/types';

export let user: ?UserT = undefined;
export const setUser: (u: ?UserT) => void = (u: ?UserT): void => { user = u };

const mockedUserState = { user, setUser };

export default mockedUserState;