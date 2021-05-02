// @flow
import React from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import {
  test,
  expect,
  describe,
  afterEach,
  beforeEach,
  jest,
} from '@jest/globals';
import Room from 'components/Room';
import io, { serverSocket, cleanSocket } from 'utils/__mocks__/MockedSocketIO';
import ElementWithProviders from 'components/__mocks__/ElementWithProviders';
import MockRouter from 'components/__mocks__/MockRouter';
import { createMemoryHistory } from 'history';
import { user, setUser } from 'utils/__mocks__/mockedUserState';
import '@testing-library/jest-dom';


describe('Room component', (): void => {
  const socket = io.connect();
  const roomId = '1234';
  let history: any;
  beforeEach((): void => {
    history = createMemoryHistory();
    history.push(`/room/${roomId}`);
  });

  afterEach(() => {
    cleanup();
    cleanSocket();
  });

  test('Load room view if the user is defined', (): void => {
    const fakeUser = {
      id: 'mock-id',
      username: 'mock-username',
      roomId: 'mock-roomId',
    }
    setUser(fakeUser);
    render(
      <ElementWithProviders mockedUserState={{ user, setUser }} socket={socket}>
        <MockRouter history={history} path={'/room/:id'}>
          <Room />
        </MockRouter>
      </ElementWithProviders>
    );
    const re = new RegExp(`Room ${roomId}`);
    const search = screen.getByText(re);
    expect(search).toBeInTheDocument();
  });
  
  test('If user is undefined, redirect to join to ask for it', (): void => {
    setUser(undefined);
    render(
      <ElementWithProviders mockedUserState={{ user, setUser }} socket={socket}>
        <MockRouter history={history} path={'/room/:id'}>
          <Room />
        </MockRouter>
      </ElementWithProviders>
    );
    expect(history.location.pathname).toBe(`/join/${roomId}`);
  });
  
});
