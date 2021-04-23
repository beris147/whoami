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
import type { UserT, RoomT } from 'common/types';
import '@testing-library/jest-dom';


describe('Room component', (): void => {

  const socket = io.connect();
  let user: ?UserT;
  let history: any;
  let ui: React$Element<any>;

  const setUser = (newUser: ?UserT): void => { user = newUser; };

  const roomId = '1234';

  beforeEach((): void => {
    user = undefined;
    history = createMemoryHistory();
    history.push(`/room/${roomId}`);
    ui = (
      <MockRouter 
        ui={<Room />}
        history={history}
        path={'/room/:id'}
      />
    );
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
      <ElementWithProviders 
        ui={ui}
        mockUserState={{ user, setUser }}
        socket={socket}
      />
    );
    const re = new RegExp(`Room ${roomId}`);
    const search = screen.getByText(re);
    expect(search).toBeInTheDocument();
  });
  
  test('If user is undefined, redirect to join to ask for it', (): void => {
    setUser(undefined);
    render(
      <ElementWithProviders 
        ui={ui}
        mockUserState={{ user, setUser }}
        socket={socket}
      />
    );
    expect(history.location.pathname).toBe(`/join/${roomId}`);
  });
  
});
