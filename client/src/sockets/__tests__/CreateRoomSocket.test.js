// @flow
import React from 'react'
import ElementWithProviders from 'components/__mocks__/ElementWithProviders';
import io from 'utils/__mocks__/MockedSocketIO';
import { renderHook, act, cleanup } from '@testing-library/react-hooks/dom';
import { test, expect, describe, jest, beforeEach, afterEach } from '@jest/globals';
import { useCreateRoomSocket } from 'sockets/CreateRoomSocket';
import { useCreateRoomServer } from 'sockets/__mocks__/MockedCreateRoomServer';

import type { RoomT, UserT, UserJoinedRoomT } from 'common/types';
import type { CreateRoomSocketT } from 'sockets/CreateRoomSocket';

const socketContext = io.connect();
const serverSocket = useCreateRoomServer();

let socket: CreateRoomSocketT;

beforeEach(() => {
  const wrapper = ({children}) => <ElementWithProviders socket={socketContext}>
    {children}
  </ElementWithProviders>
  socket = renderHook(
    () => useCreateRoomSocket(socketContext),
    {wrapper},
  ).result.current;
  serverSocket.subscribeToEvents();
});
afterEach(() => {
  cleanup();
  serverSocket.unsubscribeFromEvents();
})
describe('useCreateRoomSocket hook', () => {
  let testRoom: ?RoomT = undefined;
  let testUser: ?UserT = undefined;
  let callback: () => void;
  beforeEach(() => {
    callback = jest.fn(({room, user}: UserJoinedRoomT) => {
      testRoom = room;
      testUser = user;
    });
    socket.subscribeToJoinedRoom(callback);
  });
  afterEach((): void => {
    socket.unsubscribeFromJoinedRoom();
  });
  describe('on emitCreateRoom', () => {
    beforeEach(() => {
      act(() => {
        socket.emitCreateRoom({ username: 'testUser' });
      });
    });
    test('the callback should be called', () => {
      expect(callback).toHaveBeenCalled();
    });
    test('testRoom and testUser should be defined', () => {
      expect(testRoom).not.toBe(undefined);
      expect(testUser).not.toBe(undefined);
    });
  });
});
