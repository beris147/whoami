// @flow
import { test, expect, describe, beforeEach, afterEach } from '@jest/globals';
import {
  addUserToLobbyList,
  removeUserFromLobbyList,
  updateUserInList,
} from '../LobbyLogic';

import type { UserInLobbyT } from '../../models/UserModels';

let userList = [];
describe('LobbyDomainLogic functions', () => {
  const TESTUSER = 'test-user';
  describe('addUserToLobbyList function', () => {
    beforeEach(() => {
      userList = addUserToLobbyList(TESTUSER, userList);
    });
    test('userList should contain TESTUSER', () => {
      expect(userList.map((user) => user.username)).toContain(TESTUSER);
    });
    describe('removeUserFromLobbyList function', () => {
      beforeEach(() => {
        userList = removeUserFromLobbyList(TESTUSER, userList);
      });
      test('userList should not contain TESTUSER', () => {
        expect(userList.map((user) => user.username)).not.toContain(TESTUSER);
      });
    });
    describe('updateUserInList function', () => {
      const readyUser = { username: TESTUSER, writtenCharacter: 'character' };
      beforeEach(() => {
        userList = updateUserInList(readyUser, userList);
      });
      test('TESTUSER should be ready', () => {
        const readyUsers = userList
          .filter((user) => 'writtenCharacter' in user)
          .map((user) => user.username);
        expect(readyUsers).toContain(TESTUSER);
      });
    });
  });
});
