// @flow
import React from 'react'
import MockRouter from 'components/__mocks__/MockRouter';
import ElementWithProviders from 'components/__mocks__/ElementWithProviders';
import { renderHook, act, cleanup } from '@testing-library/react-hooks/dom';
import { test, expect, describe, jest, beforeEach, afterEach } from '@jest/globals';
import { createMemoryHistory } from 'history';
import { useCreateRoomApp } from 'app/CreateRoomApp';
import { useCreateRoomServer } from 'sockets/__mocks__/MockedCreateRoomServer';

const PATH = '/create';
const history = createMemoryHistory();
const serverSocket = useCreateRoomServer();
let app: any;

beforeEach(() => {
  history.push(PATH);
  const wrapper = ({children}) => <ElementWithProviders>
    <MockRouter history={history} path={PATH}>
      {children}
    </MockRouter>
  </ElementWithProviders>
  app = renderHook(() => useCreateRoomApp(), {wrapper}).result.current;
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
      app.createRoom('username');
    });
    expect(history.location.pathname).toMatch(/room/);
  });
});
