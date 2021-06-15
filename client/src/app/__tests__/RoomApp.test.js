// @flow
import React from 'react';
import MockRouter from 'components/__mocks__/MockRouter';
import ElementWithProviders from 'components/__mocks__/ElementWithProviders';
import { renderHook } from '@testing-library/react-hooks/dom';
import { test, expect, describe, beforeEach } from '@jest/globals';
import { createMemoryHistory } from 'history';
import { useRoomApp } from 'app/RoomApp';
import { useRoomServer } from 'sockets/__mocks__/MockedRoomServer';
import { room, setRoom } from 'utils/__mocks__/mockedRoomState';

import type { RoomAppT } from 'app/RoomApp';

describe('', () => {
  if (!room) return;
  const PATH = `/room/${room.id}`;
  const history = createMemoryHistory();
  const serverSocket = useRoomServer();
  let app: RoomAppT;
  beforeEach(() => {
    history.push(PATH);
    const wrapper = ({ children }) => (
      <ElementWithProviders mockedRoomState={{ room, setRoom }}>
        <MockRouter history={history} path={PATH}>
          {children}
        </MockRouter>
      </ElementWithProviders>
    );
    app = renderHook(() => useRoomApp(), { wrapper }).result.current;
  });
  describe('useRoomApp hook should change the room inside the context', () => {
    test('should render the room view without redirecting', () => {
      expect(history.location.pathname).toBe(PATH);
    });
    test('the roomid should match the mocked room state', () => {
      expect(app.roomId).toBe(room.id);
    });
  });
});
