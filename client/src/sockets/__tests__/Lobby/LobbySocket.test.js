// @flow
import React from 'react'
import ElementWithProviders from 'components/__mocks__/ElementWithProviders';
import io from 'utils/__mocks__/MockedSocketIO';
import { renderHook, act, cleanup } from '@testing-library/react-hooks/dom';
import { test, expect, describe, jest, beforeEach, afterEach } from '@jest/globals';
import { useLobbySocket } from 'sockets/Lobby/LobbySocket';
import { useLobbyServer } from 'sockets/__mocks__/Lobby/MockedLobbyServer';

import type { LobbySocketT } from 'sockets/Lobby/LobbySocket';

const socketContext = io.connect();
const serverSocket = useLobbyServer();

let socket: LobbySocketT;

beforeEach(() => {
  const wrapper = ({children}) => <ElementWithProviders>
    {children}
  </ElementWithProviders>
  socket = renderHook(
    () => useLobbySocket(socketContext),
    {wrapper},
  ).result.current;
});
afterEach(() => {
  cleanup();
});
describe('useRoomSocket hook should call callbacks', () => {
  const callback = jest.fn();
  const TESTUSER = { username: 'test-user' };
  const READYUSER = { ...TESTUSER, writtenCharacter: 'character' };
  beforeEach(() => {
    socket.subscribeToGameStarted(callback);
    socket.subscribeToGetUsersInLobby(callback);
    socket.subscribeToUserIsNotReady(callback);
    socket.subscribeToUserIsReady(callback);
  });
  afterEach((): void => {
    socket.unsubscribeFromGameStarted();
    socket.unsubscribeFromGetUsersInLobby();
    socket.unsubscribeFromUserIsNotReady();
    socket.unsubscribeFromUserIsReady();
  });
  describe('on emitUserIsNotReady', () => {
    beforeEach(() => {
      serverSocket.emitUserIsNotReady(TESTUSER);
    });
    test('the callback should be called', () => {
      expect(callback).toHaveBeenCalled();
    });
  });
  describe('on emitUserIsReady', () => {
    beforeEach(() => {
      serverSocket.emitUserIsReady(READYUSER);
    });
    test('the callback should be called', () => {
      expect(callback).toHaveBeenCalled();
    });
  });
});
