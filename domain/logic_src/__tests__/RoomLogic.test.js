// @flow
import { test, expect, describe, beforeEach, afterEach } from '@jest/globals';
import {
  addUserToRoom,
  removeUserFromRoom,
  changeRoomOwner,
  removeRoom,
} from '../RoomLogic';

import type { RoomT } from '../../models/RoomModels';

let room: RoomT = {
  id: 'roomId',
  users: ['test-user-1'],
  owner: 'test-user-1',
};

describe('RoomDomainLogic functions', () => {
  if (!room) return;
  const TESTUSER = 'test-user';
  const OWNER = room.owner;
  describe('addUserToRoom function', () => {
    beforeEach(() => {
      room = addUserToRoom(TESTUSER, room);
    });
    test('TESTUSER should be added to the room', () => {
      expect(room.users).toContain(TESTUSER);
    });
    describe('removeUserFromRoom function', () => {
      beforeEach(() => {
        room = removeUserFromRoom(OWNER, room);
      });
      test('OWNER should not be part of the room anymore', () => {
        expect(room.users).not.toContain(OWNER);
      });
      describe('changeRoomOwner function', () => {
        beforeEach(() => {
          room = changeRoomOwner(TESTUSER, room);
        });
        test('TESTUSER should be the new room owner', () => {
          expect(room.owner).toBe(TESTUSER);
        });
      });
    });
  });
});
