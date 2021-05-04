//@flow

import React from 'react';
import {
  render,
  screen,
  cleanup,
  queryByText,
  act,
} from '@testing-library/react';
import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import io, { cleanSocket, serverSocket } from 'utils/__mocks__/MockedSocketIO';
import MockRouter from 'components/__mocks__/MockRouter';
import Room from 'components/Room';
import ElementWithProviders from 'components/__mocks__/ElementWithProviders';
import { room, setRoom, ROOMID } from 'utils/__mocks__/mockedRoomState';
import type {
  RoomT,
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
    });
    afterEach(() => {
      cleanup();
      cleanSocket();
    });
    describe('When the leaver is a regular user', () => {
      beforeEach(() => {
        render(
          <ElementWithProviders socket={socket}>
            <MockRouter initialEntries={[`/room/${ROOMID}`]} path={'/room/:id'}>
              <Room />
            </MockRouter>
          </ElementWithProviders>
        );
        act(() => {
          socket.emit('leave-room');
        });
      });
      test('Removes one item from the user list', () => {
        const users = screen.getAllByRole('listitem');
        expect(users.length).toBe(mockUsers.length - 1);
      });
      test('Does not includes the username', () => {
        const userDiv = screen.queryByText(/test-leaver/);
        expect(userDiv).toBeNull();
      });
    });
    describe('When the leaver is the owner', () => {
      let mockedUsernames: Array<string>;
      beforeEach(() => {
        mockedUsernames = mockUsers.map((user: UserInLobbyT) => user.username);
        let testRoom: RoomT = {
          id: ROOMID,
          owner: leaverUsername,
          users: mockedUsernames,
          round: 0,
          time: 30,
        };
        setRoom(testRoom);
        serverSocket.on('leave-room', (errorCallback: ErrorCallBackT) => {
          if(room) {
            const newOwner: string = room.users[0];
            testRoom.owner = newOwner;
            setRoom(testRoom);
            serverSocket.emit('room-owner-changed', newOwner);
          }
          else return errorCallback({ error: 'room not found'});
        });
        render(
          <ElementWithProviders 
            socket={socket} 
            mockedRoomState={{room, setRoom}}
          >
            <MockRouter initialEntries={[`/room/${ROOMID}`]} path={'/room/:id'}>
              <Room />
            </MockRouter>
          </ElementWithProviders>
        );
        act(() => {
          socket.emit('leave-room');
        });
      });
      test('the owner should change to the next one in the list', () => {
        const newOwnerRegex = new RegExp(mockedUsernames[0]);
        const ownerDiv = screen.getByText(newOwnerRegex);
        const ownerStar = queryByText(ownerDiv, /⭐/);
        expect(room?.owner).toBe(mockedUsernames[0]);
        expect(ownerStar).not.toBeNull();
      });
    });
  });
});
