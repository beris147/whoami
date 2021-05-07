//@flow

import React from 'react';
import {
  render,
  screen,
  cleanup,
  queryByText,
  act,
  fireEvent,
} from '@testing-library/react';
import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import io, { cleanSocket, serverSocket } from 'utils/__mocks__/MockedSocketIO';
import MockRouter from 'components/__mocks__/MockRouter';
import Room from 'components/Room';
import ElementWithProviders from 'components/__mocks__/ElementWithProviders';
import { room, setRoom } from 'utils/__mocks__/mockedRoomState';
import { user, setUser } from 'utils/__mocks__/mockedUserState';
import { createMemoryHistory } from 'history';
import type {
  RoomT,
  UserT,
  UserInLobbyT,
  ErrorCallBackT,
  UsersInLobbyCallbackT,
} from 'common/types';
import '@testing-library/jest-dom';

describe('When all the users in the lobby are ready', () => {
  const owner: UserT = {
    id: 'ownerid',
    username: 'owner',
    roomId: room?.id || 'room-id',
  };
  const notOwner: UserT = {
    id: 'userid',
    username: 'not-owner',
    roomId: room?.id || 'room-id',
  }
  const socket = io.connect();
  let playButton;
  const mockUsers: Array<UserInLobbyT> = [
    { username: owner.username, writtenCharacter: 'character1' },
    { username: notOwner.username, writtenCharacter: 'character2' },
  ];
  const history = createMemoryHistory();
  beforeEach(() => {
    if(room) {
      setRoom({...room, owner: owner.username});
      history.push(`/room/${room.id}`);
    }
    serverSocket.on(
      'get-users-in-lobby',
      (
        errorCallBack: ErrorCallBackT,
        succesCallback: UsersInLobbyCallbackT
      ) => {
        succesCallback(mockUsers);
      }
    );
    serverSocket.on('start-game', (errorCallBack: ErrorCallBackT) => {
      serverSocket.emit('game-started');
    });
  });
  afterEach(() => {
    cleanup();
    cleanSocket();
  });
  describe('When the user is not the owner', () => {
    beforeEach(() => {
      setUser(notOwner);
      render(
        <ElementWithProviders 
          socket={socket} 
          mockedUserState={{user, setUser}}
          mockedRoomState={{room, setRoom}}
        >
          <MockRouter history={history} path={'/room/:id'}>
            <Room />
          </MockRouter>
        </ElementWithProviders>
      );
      playButton = screen.queryByText(/Play/i);
    });
    test('Play button should not be in the document', () => {
      expect(playButton).toBeNull();
    });
  });
  describe('When the user is the owner', () => {
    beforeEach(() => {
      setUser(owner);
      render(
        <ElementWithProviders 
          socket={socket} 
          mockedUserState={{user, setUser}}
          mockedRoomState={{room, setRoom}}
        >
          <MockRouter history={history} path={'/room/:id'}>
            <Room />
          </MockRouter>
        </ElementWithProviders>
      );
      playButton = screen.getByRole('button', { name: /Play/i });
    });
    test('Play button should be in the document and enabled', () => {
      expect(playButton).toBeEnabled();
    });
    test('Click on play button should initialize the game', () => {
      fireEvent.click(playButton);
      expect(history.location.pathname).toBe('/game');
    });
  });
});