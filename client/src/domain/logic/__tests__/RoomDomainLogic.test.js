// @flow
import { test, expect, describe, beforeEach, afterEach } from '@jest/globals';
import { room, setRoom } from 'utils/__mocks__/mockedRoomState';
import {
  addUserToRoom,
  removeUserFromRoom,
  changeRoomOwner,
  removeRoom,
} from 'domain/logic/RoomDomainLogic';

describe('RoomDomainLogic functions', () => {
  if(!room) return;
  const TESTUSER = 'test-user';
  const OWNER = room.owner;
  describe('addUserToRoom function', () => {
    if(!room) return;
    beforeEach(() => {
      const updatedRoom = addUserToRoom(TESTUSER, room);
      setRoom(updatedRoom);
    });
    test('TESTUSER should be added to the room', () => {
      expect(room.users).toContain(TESTUSER);
    });
    describe('removeUserFromRoom function', () => {
      beforeEach(() => {
        const updatedRoom = removeUserFromRoom(OWNER, room);
        setRoom(updatedRoom);
      });
      test('OWNER should not be part of the room anymore', () => {
        expect(room.users).not.toContain(OWNER);
      });
      describe('changeRoomOwner function', () => {
        beforeEach(() => {
          const updatedRoom = changeRoomOwner(TESTUSER, room);
          setRoom(updatedRoom);
        });
        test('TESTUSER should be the new room owner', () => {
          expect(room.owner).toBe(TESTUSER);
        });
      });
    });
  });
});
