// @flow
import React from 'react';
import { 
  render, 
  screen, 
  cleanup, 
  fireEvent,
  queryByText,
} from '@testing-library/react';
import {
  test,
  expect,
  describe,
  afterEach,
  beforeEach,
  jest,
} from '@jest/globals';
import Lobby from 'components/lobby/Lobby';
import io, { serverSocket, cleanSocket } from 'utils/__mocks__/MockedSocketIO';
import ElementWithProviders from 'components/__mocks__/ElementWithProviders';
import SocketContext from 'contexts/SocketContext';
import type { 
  UserT, 
  UserIsReadyT, 
  UserIsNotReadyT,
  UserInLobbyT,
  ErrorCallBackT,
  UsersInLobbyCallbackT,
} from 'common/types';

import '@testing-library/jest-dom';

let socket;
const user: UserT = { id: 'userid', roomId: 'roomid', username: 'test-user' };

describe('user is ready functionality', () => {
  beforeEach(() => {
    socket = io.connect();
    const mockUsers: Array<UserInLobbyT> = [
      { username: 'test-user' },
    ];
    serverSocket.on(
      'get-users-in-lobby',
      (
        errorCallBack: ErrorCallBackT,
        succesCallback: UsersInLobbyCallbackT
      ) => {
        succesCallback(mockUsers);
      }
    );
    serverSocket.on('set-ready-lobby', (writtenCharacter: string) => {
      const userIsReady: UserIsReadyT = {
        username: user.username,
        writtenCharacter,
      }
      serverSocket.emit('user-is-ready', userIsReady);
    });
    serverSocket.on(
      'change-not-ready-lobby', (): void => {
        const userIsNotReady: UserIsNotReadyT = {
          username: user.username,
        } 
        serverSocket.emit('user-is-not-ready', userIsNotReady);
      }
    );
    render(
      <SocketContext.Provider value={socket}>
        <Lobby />
      </SocketContext.Provider>
    );
  });
  describe('the user is not ready yet', () => {
    test('the user must appear in the userList', (): void => {
      const userDiv = screen.getByText(/test-user/);
      expect(userDiv).not.toBeNull();
    });
    test('the user must appear as waiting inside the userList', (): void => {
      const userDiv = screen.getByText(/test-user/);
      const waitingDiv = queryByText(userDiv, /Waiting/i);
      expect(waitingDiv).not.toBeNull();
    });
  });
  describe('when the user clicks on ready', (): void => {
    beforeEach(() => {
      const characterInput = screen.getByRole('textbox', {type: 'text'});
      const readyButton = screen.getByRole('button', { name: /Ready/i });
      fireEvent.change(characterInput, { target: { value: 'Linus Torvalds' } });
      fireEvent.click(readyButton);
    });
    test('the user must appear as ready inside the userList', (): void => {
      const userDiv = screen.getByText(/test-user/);
      const readyDiv = queryByText(userDiv, /Ready/i);
      expect(readyDiv).not.toBeNull();
    });
    describe('if the user clicks on change', (): void => {
      let changeButton;
      beforeEach(() => {
        changeButton = screen.getByRole('button', { name: /Change/i });
        fireEvent.click(changeButton);
      });
      test('the user must appear as waiting inside the userList', (): void => {
        const userDiv = screen.getByText(/test-user/i);
        const waitingDiv = queryByText(userDiv, /Waiting/i);
        expect(waitingDiv).not.toBeNull();
      });
    });
  });
});