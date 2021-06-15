// @flow
import React from 'react';
import ElementWithProviders from 'components/__mocks__/ElementWithProviders';
import { renderHook, cleanup, act } from '@testing-library/react-hooks/dom';
import { test, expect, describe, jest, beforeEach } from '@jest/globals';
import { useLobbyApp } from 'app/Lobby/LobbyApp';
import { useLobbyServer } from 'sockets/__mocks__/Lobby/MockedLobbyServer';

import type {
  UserInLobbyT,
  UserIsReadyT,
  UserIsNotReadyT,
} from 'domain/models/UserModels';
import type { LobbyAppT } from 'app/Lobby/LobbyApp';

describe('useLobbyApp hook should change the userList', () => {
  const serverSocket = useLobbyServer();
  let app: LobbyAppT;
  let hook: any;
  const actAndSetApp = (func: () => void) => {
    act(func);
    app = hook.result.current;
  };
  beforeEach(() => {
    const wrapper = ({ children }) => (
      <ElementWithProviders>{children}</ElementWithProviders>
    );
    hook = renderHook(() => useLobbyApp(), { wrapper });
  });
  describe('the server events should fire the changes', () => {
    describe('user joins lobby', () => {
      const TESTUSER: UserInLobbyT = { username: 'test-username' };
      beforeEach(() => {
        actAndSetApp(() => {
          serverSocket.emitUserJoined(TESTUSER.username);
        });
      });
      test('TESTUSER should be in userList', () => {
        const usernames = app.userList.map((user) => user.username);
        expect(usernames).toContain(TESTUSER.username);
      });
      describe('user is ready', () => {
        const READYUSER: UserIsReadyT = {
          ...TESTUSER,
          writtenCharacter: 'char',
        };
        beforeEach(() => {
          actAndSetApp(() => {
            serverSocket.emitUserIsReady(READYUSER);
          });
        });
        test('userList should be updated with the ready user', () => {
          const readyUsernames = app.userList
            .filter((user) => 'writtenCharacter' in user)
            .map((user) => user.username);
          expect(readyUsernames).toContain(READYUSER.username);
        });
        describe('user is not ready', () => {
          const notReadyUser: UserIsNotReadyT = { username: TESTUSER.username };
          beforeEach(() => {
            actAndSetApp(() => {
              serverSocket.emitUserIsNotReady(notReadyUser);
            });
          });
          test('userList should be updated, with the not ready user', () => {
            const notReadyUsernames = app.userList
              .filter((user) => 'writtenCharacter' in user === false)
              .map((user) => user.username);
            expect(notReadyUsernames).toContain(READYUSER.username);
          });
        });
      });
      describe('user leaves lobby', () => {
        beforeEach(() => {
          actAndSetApp(() => {
            serverSocket.emitUserLeft(TESTUSER.username);
          });
        });
        test('TEST user should not be in the userList', () => {
          const usernames = app.userList.map((user) => user.username);
          expect(usernames).not.toContain(TESTUSER.username);
        });
      });
    });
  });
});
