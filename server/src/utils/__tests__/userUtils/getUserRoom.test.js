// @flow
import { describe, it, expect } from '@jest/globals';
import { getUserRoom } from 'utils/userUtils';

import type { ErrorT } from 'domain/models/ErrorModels';
import type { RoomT, RoomSetT } from 'domain/models/RoomModels';
import type { UserT, UserSetT } from 'domain/models/UserModels';

describe('getUserRoom', () => {
  describe('Given a user whose room appears in the room set', () => {
    it('Returns the room', () => {
      const roomId = 'room-id';
      const user: UserT = {
        id: 'user-id',
        roomId: roomId,
        username: 'user-username',
      };
      const expectedRoom: RoomT = {
        id: roomId,
        owner: 'owner-id',
        users: ['username-1', 'username-2'],
      };
      const rooms: RoomSetT = {
        [roomId]: expectedRoom,
      };
      const room = getUserRoom(user, rooms);
      expect(room).toStrictEqual(expectedRoom);
    });
  });
  describe("Given a user whose room doesn't appear in the room set", () => {
    it('Returns undefined', () => {
      const user: UserT = {
        id: 'user-id',
        roomId: 'room-id',
        username: 'user-username',
      };
      const rooms: RoomSetT = {};
      const room = getUserRoom(user, rooms);
      expect(room).toBeUndefined();
    });
  });
});
