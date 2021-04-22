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
import Room from '../Room';
import io, { serverSocket, cleanSocket } from 'utils/__mocks__/MockedSocketIO';
import ElementWithProviders from 'components/__mocks__/ElementWithProviders';
import MockRouter from 'components/__mocks__/MockRouter';
import { createMemoryHistory } from "history";
import type { UserT, RoomT } from 'common/types';
import '@testing-library/jest-dom';


describe('Room component', (): void => {

  const socket = io.connect();
  let user: ?UserT;

  const setUser = (newUser: ?UserT): void => { user = newUser; };

  const roomId = '1234';

  beforeEach((): void => {
    user = undefined;
  });

  afterEach(() => {
    cleanup();
    cleanSocket();
  });

  test('Load room view if the user is defined', (): void => {
    const ui = (
      <MockRouter 
        ui={<Room />}
        initialEntries={[`room/${roomId}`]}
        path={'room/:id'}
      />
    );
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
  
  test('Do not load room view if the user is undefined', (): void => {
    const history = createMemoryHistory();
    history.push(`/room/${roomId}`);
    const ui = (
      <MockRouter 
        ui={<Room />}
        history={history}
        path={'/room/:id'}
      />
    );
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
