// @flow
import { describe, it, expect } from '@jest/globals';
import { removeUser } from 'utils/userUtils';

import type { RoomT, RoomSetT } from 'domain/models/RoomModels';
import type { UserT, UserSetT } from 'domain/models/UserModels';

describe('removeUser', () => {
  describe('Given a user in the user set', () => {
    it('Removes the user from the user set', () => {
      const user: UserT = {
        id: 'user-id',
        roomId: 'room-id',
        username: 'user-username',
      };
      const remainingUsers: UserSetT = {
        'user-id-2': {
          id: 'user-id-2',
          roomId: 'room-id',
          username: 'user-username-2',
        },
      };
      const users: UserSetT = {
        ...remainingUsers,
        [user.id]: user,
      };
      removeUser(user, users);
      expect(users).toStrictEqual(remainingUsers);
    });
  });
  describe('Given a user not in the user set', () => {
    it('Does nothing', () => {
      const user: UserT = {
        id: 'user-id',
        roomId: 'room-id',
        username: 'user-username',
      };
      const users: UserSetT = {
        'user-id-2': {
          id: 'user-id-2',
          roomId: 'room-id',
          username: 'user-username-2',
        },
      };
      const usersCopy = users;
      removeUser(user, users);
      expect(users).toStrictEqual(usersCopy);
    });
  });
});
