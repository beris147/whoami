// @flow
import React from 'react'
import MockRouter from 'components/__mocks__/MockRouter';
import ElementWithProviders from 'components/__mocks__/ElementWithProviders';
import { renderHook, cleanup } from '@testing-library/react-hooks/dom';
import { test, expect, describe, jest, beforeEach, afterEach } from '@jest/globals';
import { createMemoryHistory } from 'history';
import { useRoomApp } from 'app/RoomApp';
import { useRoomServer } from 'sockets/__mocks__/MockedRoomServer';
import { room, setRoom } from 'utils/__mocks__/mockedRoomState';

import type { RoomAppT } from 'app/RoomApp';

const PATH = `/room/${room?.id || 'roomid'}`;
const history = createMemoryHistory();
const serverSocket = useRoomServer();
let app: RoomAppT;

beforeEach(() => {
  history.push(PATH);
  const wrapper = ({children}) => (
    <ElementWithProviders mockedRoomState={{room, setRoom}}>
      <MockRouter history={history} path={PATH}>
        {children}
      </MockRouter>
    </ElementWithProviders>
  );
  app = renderHook(() => useRoomApp(), {wrapper}).result.current;
});
afterEach(() => {
  cleanup();
})
describe('useRoomApp hook should change the room inside the context', () => {
  beforeEach((): void => {
    app.subscribeToEvents();
  });
  afterEach((): void => {
    app.unsubscribeFromEvents();
  });
  test('should render the room view without redirecting', () => {
    expect(history.location.pathname).toBe(PATH);
  });
  test('the roomid should match the mocked room state', () => {
    expect(app.roomId).toBe(room?.id);
  });
  describe('left room', () => {
    beforeEach(() => {
      serverSocket.emitLeftRoom();
    });
    test('should be redirected to (home)', () => {
      expect(history.location.pathname).not.toBe(PATH);
      expect(history.location.pathname).toBe('/')
    });
  });
  describe('new user joined', () => {
    const TESTUSER = 'test-user-1';
    beforeEach(() => {
      serverSocket.emitUserJoined(TESTUSER);
    });
    test('should be added to the users array of the room context', () => {
      expect(room?.users).toContain(TESTUSER);
    });
    describe('owner left', () => {
      const OLDOWNER = room?.owner || 'owner';
      beforeEach(() => {
        serverSocket.emitUserLeft(OLDOWNER);
        serverSocket.emitRoomOwnerChanged(TESTUSER);
      });
      test('should be removed',() => {
        expect(room?.users).not.toContain(OLDOWNER);
      });
      test('the room owner should be TESTUSER', () => {
        expect(room?.owner).toBe(TESTUSER);
      });
    });
  })
});
