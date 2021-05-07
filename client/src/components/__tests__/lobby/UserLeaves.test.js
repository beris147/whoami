//@flow

import React from 'react';
import {
  render,
  screen,
  cleanup,
  act,
} from '@testing-library/react';
import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import io, { cleanSocket, serverSocket } from 'utils/__mocks__/MockedSocketIO';
import MockRouter from 'components/__mocks__/MockRouter';
import Room from 'components/Room';
import ElementWithProviders from 'components/__mocks__/ElementWithProviders';
import { user, setUser } from 'utils/__mocks__/mockedUserState';
import type {
  UserT,
  UserInLobbyT,
  ErrorCallBackT,
  UsersInLobbyCallbackT,
} from 'common/types';
import '@testing-library/jest-dom';

describe('When a user in lobby leaves', () => {
  const socket = io.connect();
  describe('Given a room with more than one user', () => {
    const leaverUsername = 'test-leaver';
    const mockUsers: Array<UserInLobbyT> = [
      { username: 'test-user-1' },
      { username: 'test-user-2' },
      { username: leaverUsername },
    ];
    beforeEach(() => {
      serverSocket.on(
        'get-users-in-lobby',
        (
          errorCallBack: ErrorCallBackT,
          succesCallback: UsersInLobbyCallbackT
        ) => {
          succesCallback(mockUsers);
        }
      );
      serverSocket.on('leave-room', (errorCallback: ErrorCallBackT) => {
        serverSocket.emit('user-left', leaverUsername);
      });
      const fakeUser: UserT = {
        id: 'id',
        username: 'username',
        roomId: 'roomId',
      }
      setUser(fakeUser);
      render(
        <ElementWithProviders socket={socket} mockedUserState={{user, setUser}}>
          <MockRouter initialEntries={['/room/1234']} path={'/room/:id'}>
            <Room />
          </MockRouter>
        </ElementWithProviders>
      );
      act(() => {
        socket.emit('leave-room');
      });
    });
    afterEach(() => {
      cleanup();
      cleanSocket();
    });
    test('Removes one item from the user list', () => {
      const users = screen.getAllByRole('listitem');
      expect(users.length).toBe(mockUsers.length - 1);
    });
    test('Does not include the username', () => {
      const userDiv = screen.queryByText(/test-leaver/);
      expect(userDiv).toBeNull();
    });
  });
});
