// @flow
import { test, expect, describe, beforeEach, afterEach } from '@jest/globals';
import { userList, setUserList } from 'utils/__mocks__/Lobby/mockedUserListState';
import { 
  addUserToLobbyList,
  removeUserFromLobbyList,
  updateUserInList,
} from 'domain/logic/LobbyDomainLogic';

import type { UserInLobbyT } from 'common/types';

describe('LobbyDomainLogic functions', () => {
  const TESTUSER = 'test-user';
  describe('addUserToLobbyList function',() => {
    beforeEach(() => {
      const updatedList = addUserToLobbyList(TESTUSER, userList);
      setUserList(updatedList);
    });
    test('userList should contain TESTUSER', () => {
      expect(userList.map(user => user.username)).toContain(TESTUSER);
    });
    describe('removeUserFromLobbyList function', () => {
      beforeEach(() => {
        const updatedList = removeUserFromLobbyList(TESTUSER, userList);
        setUserList(updatedList);
      });
      test('userList should not contain TESTUSER', () => {
        expect(userList.map(user => user.username)).not.toContain(TESTUSER);
      });
    });
    describe('updateUserInList function', () => {
      const readyUser = { username: TESTUSER, writtenCharacter: 'character'};
      beforeEach(() => {
        const updatedList = updateUserInList(readyUser, userList);
        setUserList(updatedList);
      });
      test('TESTUSER should be ready', () => {
        const readyUsers = userList
          .filter(user => 'writtenCharacter' in user)
          .map(user => user.username);
        expect(readyUsers).toContain(TESTUSER);
      });
    }); 
  });
});

