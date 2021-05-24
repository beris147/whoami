// @flow
import React from 'react'
import MockRouter from 'components/__mocks__/MockRouter';
import ElementWithProviders from 'components/__mocks__/ElementWithProviders';
import { renderHook, act, cleanup } from '@testing-library/react-hooks/dom';
import { test, expect, describe, jest, beforeEach, afterEach } from '@jest/globals';
import { createMemoryHistory } from 'history';
import { useJoinRoomApp } from 'app/JoinRoomApp';
import { useJoinRoomServer } from 'sockets/__mocks__/MockedJoinRoomServer';

import type { JoinRoomAppT } from 'app/JoinRoomApp';

const PATH = '/join';
const history = createMemoryHistory();
const serverSocket = useJoinRoomServer();
let app: JoinRoomAppT;

beforeEach(() => {
  history.push(PATH);
  const wrapper = ({children}) => <ElementWithProviders>
    <MockRouter history={history} path={PATH}>
      {children}
    </MockRouter>
  </ElementWithProviders>
  app = renderHook(() => useJoinRoomApp(), {wrapper}).result.current;
});
afterEach(() => {
  cleanup();
})
describe('useCreateApp hook', () => {
  beforeEach((): void => {
    app.subscribeToEvents();
    serverSocket.subscribeToEvents();
  });
  afterEach((): void => {
    app.unsubscribeFromEvents();
    serverSocket.unsubscribeFromEvents();
  });
  test('should redirect to the room page', () => {
    expect(history.location.pathname).toBe(PATH);
    act(() => {
      app.joinRoomRequest('username', 'roomid');
    });
    expect(history.location.pathname).toMatch(/room/);
  });
});
