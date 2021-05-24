// @flow
import React from 'react'
import ElementWithProviders from 'components/__mocks__/ElementWithProviders';
import io from 'utils/__mocks__/MockedSocketIO';
import { renderHook, act, cleanup } from '@testing-library/react-hooks/dom';
import { test, expect, describe, jest, beforeEach, afterEach } from '@jest/globals';
import { useJoinRoomSocket } from 'sockets/JoinRoomSocket';
import { useJoinRoomServer } from 'sockets/__mocks__/MockedJoinRoomServer';

import type { RoomT, UserT, UserJoinedRoomT } from 'common/types';
import type { JoinRoomSocketT } from 'sockets/JoinRoomSocket';

const socketContext = io.connect();
const serverSocket = useJoinRoomServer();

let socket: JoinRoomSocketT;

beforeEach(() => {
  const wrapper = ({children}) => <ElementWithProviders socket={socketContext}>
    {children}
  </ElementWithProviders>
  socket = renderHook(
    () => useJoinRoomSocket(socketContext),
    {wrapper},
  ).result.current;
  serverSocket.subscribeToEvents();
});
afterEach(() => {
  cleanup();
  serverSocket.unsubscribeFromEvents();
})
describe('useJoinRoomSocket hook', () => {
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
  describe('on emitJoinRoom', () => {
    beforeEach(() => {
      act(() => {
        socket.emitJoinRoom({ username: 'testUser', roomId: 'roomid' });
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
