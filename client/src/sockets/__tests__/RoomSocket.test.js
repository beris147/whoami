// @flow
import React from 'react'
import ElementWithProviders from 'components/__mocks__/ElementWithProviders';
import io from 'utils/__mocks__/MockedSocketIO';
import { renderHook, act, cleanup } from '@testing-library/react-hooks/dom';
import { test, expect, describe, jest, beforeEach, afterEach } from '@jest/globals';
import { useRoomSocket } from 'sockets/RoomSocket';
import { useRoomServer } from 'sockets/__mocks__/MockedRoomServer';

import type { RoomSocketT } from 'sockets/RoomSocket';

const socketContext = io.connect();
const serverSocket = useRoomServer();

let socket: RoomSocketT;

beforeEach(() => {
  const wrapper = ({children}) => <ElementWithProviders socket={socketContext}>
    {children}
  </ElementWithProviders>
  socket = renderHook(
    () => useRoomSocket(socketContext),
    {wrapper},
  ).result.current;
});
afterEach(() => {
  cleanup();
})
describe('useRoomSocket hook should call callbacks', () => {
  const callback = jest.fn();
  beforeEach(() => {
    socket.subscribeToLeftRoom(callback);
    socket.subscribeToRoomOwnerChanged(callback);
    socket.subscribeToUserJoined(callback);
    socket.subscribeToUserLeft(callback);
  });
  afterEach((): void => {
    socket.unsubscribeFromLeftRoom();
    socket.unsubscribeFromRoomOwnerChanged();
    socket.unsubscribeFromUserJoined();
    socket.unsubscribeFromUserLeft();
  });
  describe('on emitLeftRoom', () => {
    beforeEach(() => {
      serverSocket.emitLeftRoom();
    });
    test('the callback should be called', () => {
      expect(callback).toHaveBeenCalled();
    });
  });
  describe('on emitRoomOwnerChanged', () => {
    beforeEach(() => {
      serverSocket.emitRoomOwnerChanged('testowner');
    });
    test('the callback should be called', () => {
      expect(callback).toHaveBeenCalled();
    });
  });
  describe('on emitUserJoined', () => {
    beforeEach(() => {
      serverSocket.emitUserJoined('testuser');
    });
    test('the callback should be called', () => {
      expect(callback).toHaveBeenCalled();
    });
  });
  describe('on emitUserLeft', () => {
    beforeEach(() => {
      serverSocket.emitUserLeft('user-left');
    });
    test('the callback should be called', () => {
      expect(callback).toHaveBeenCalled();
    });
  });
});
