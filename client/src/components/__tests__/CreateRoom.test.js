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
import { createMemoryHistory } from 'history';
import CreateRoom from 'components/CreateRoom';
import MockRouter from 'components/__mocks__/MockRouter';
import io, { serverSocket, cleanSocket } from 'utils/__mocks__/MockedSocketIO';
import ElementWithProviders from 'components/__mocks__/ElementWithProviders';
import type { UserT, RoomT, CreateRoomRequestT } from 'common/types';
import { ENTER_KEY_CODE } from 'utils/keycodes';

import '@testing-library/jest-dom';

describe('CreateRoom component', (): void => {

  const socket = io.connect();
  let history: any;
  let ui: React$Element<any>;
  let elementToRender: React$Element<any>;

  beforeEach((): void => {
    history = createMemoryHistory();
    history.push('/create');
    elementToRender = (
      <ElementWithProviders socket={socket}>
        <MockRouter history={history} path={'/create'}>
          <CreateRoom/>
        </MockRouter>
      </ElementWithProviders>
    );
  });

  afterEach(() => {
    cleanup();
    cleanSocket();
  });

  test('CreateRoom renders wihtout crashing', (): void => {
    render(elementToRender);
    const button = screen.getByRole('button', { name: /Create Room/i });
    expect(button).toBeInTheDocument();
  });

  test('create room button disabled if not username', (): void => {
    render(elementToRender);
    const button = screen.getByRole('button', { name: /Create Room/i });
    expect(button).toBeDisabled();
  });


  test('create room button enabled if username', (): void => {
    render(elementToRender);
    const userNameInput = screen.getByRole('textbox', {type: 'text'});
    const button = screen.getByRole('button', { name: /Create Room/i });
    fireEvent.change(userNameInput, { target: { value: 'a' } });
    expect(button).toBeEnabled();
  });

  test(
    'when we click on create room button, or hit enter, we expect to ' +
    'receive the joined room response, everything should be alright.', 
    (): void => {
      const username = 'owner';
      let fakeRoom: RoomT = {
        id: 'my-id',
        users: [ ],
        owner: '',
      };
      // mock of what the server should do. 
      serverSocket.on('create-room', (data: CreateRoomRequestT) => {
        fakeRoom.users = [data.username];
        fakeRoom.owner = data.username;
        serverSocket.emit('joined-room', fakeRoom);
      });
      // still check if the username that created the room is the same
      socket.on('joined-room', (room: RoomT) => {
        expect(room).toBe(fakeRoom);
        expect(room.owner).toBe(username);
      });
      render(elementToRender);
      const userNameInput = screen.getByRole('textbox', {type: 'text'});
      const button = screen.getByRole('button', { name: /Create Room/i });
      fireEvent.change(userNameInput, { target: { value: username } });
      expect(button).toBeEnabled();
      fireEvent.keyDown(userNameInput, {keyCode: ENTER_KEY_CODE});
      expect(socket.has('joined-room')).toBe(true);
      expect(history.location.pathname).toBe(`/room/${fakeRoom.id}`);
    }
  );
});
