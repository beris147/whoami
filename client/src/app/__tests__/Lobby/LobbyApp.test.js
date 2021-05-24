// @flow
import React from 'react'
import ElementWithProviders from 'components/__mocks__/ElementWithProviders';
import { renderHook, cleanup } from '@testing-library/react-hooks/dom';
import { test, expect, describe, jest, beforeEach, afterEach } from '@jest/globals';
import { useLobbyApp } from 'app/Lobby/LobbyApp';
import LobbyContext from 'contexts/Lobby/LobbyContext';
import { useLobbyServer } from 'sockets/__mocks__/Lobby/MockedLobbyServer';
import { userList, setUserList } from 'utils/__mocks__/Lobby/mockedUserListState';

import type { UserInLobbyT, UserIsReadyT, UserIsNotReadyT } from 'common/types';
import type { LobbyAppT } from 'app/Lobby/LobbyApp';

describe('useLobbyApp hook should change the userList', () => {
  const serverSocket = useLobbyServer();
  let app: LobbyAppT;
  beforeEach(() => {
    const wrapper = ({children}) => (
      <ElementWithProviders>
        <LobbyContext.Provider value={{ userList, setUserList}}>
          {children}
        </LobbyContext.Provider>
      </ElementWithProviders>
    );
    app = renderHook(() => useLobbyApp(), {wrapper}).result.current;
  });
  describe('the server events should fire the changes', () => {
    beforeEach((): void => {
      app.subscribeToEvents();
    });
    afterEach((): void => {
      app.unsubscribeFromEvents();
    });
    describe('user joins lobby', () => {
      const TESTUSER: UserInLobbyT = { username: 'test-username' }
      beforeEach(() => {
        serverSocket.emitUserJoined(TESTUSER.username);
      });
      test('TESTUSER should be in userList', () => {
        const usernames = userList.map(user => user.username);
        expect(usernames).toContain(TESTUSER.username);
      });
      describe('user is ready', () => {
        const READYUSER: UserIsReadyT = {...TESTUSER, writtenCharacter: 'char'};
        beforeEach(() => {
          serverSocket.emitUserIsReady(READYUSER);
        });
        test('userList should be updated with the ready user', () => {
          const readyUsernames = userList
            .filter(user => 'writtenCharacter' in user)
            .map(user => user.username);
          expect(readyUsernames).toContain(READYUSER.username);
        });
        describe('user is not ready', () => {
          const notReadyUser: UserIsNotReadyT = {username: TESTUSER.username};
          beforeEach(() => {
            serverSocket.emitUserIsNotReady(notReadyUser);
          });
          test('userList should be updated, with the not ready user', () => {
            const notReadyUsernames = userList
              .filter(user => 'writtenCharacter' in user === false)
              .map(user => user.username);
            expect(notReadyUsernames).toContain(READYUSER.username);
          });
        });
      });
      describe('user leaves lobby', () => {
        beforeEach(() => {
          serverSocket.emitUserLeft(TESTUSER.username);
        });
        test('TEST user should not be in the userList', () => {
          const usernames = userList.map(user => user.username);
          expect(usernames).not.toContain(TESTUSER.username);
        });
      });
    });
  });
});
