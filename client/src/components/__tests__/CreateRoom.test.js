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
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history'
import CreateRoom from '../CreateRoom';
import io, { serverSocket, cleanSocket } from 'utils/__mocks__/MockedSocketIO';
import ElementWithProviders from 'components/__mocks__/ElementWithProviders';
import type { UserT, RoomT, CreateRoomRequestT } from 'common/types';

import '@testing-library/jest-dom';

describe('CreateRoom component', (): void => {

  const socket = io.connect();
  let user: ?UserT;

  const setUser: mixed = (user: UserT): void => { user = user; };

  const mockedUserState = () => {
    return { user, setUser }; 
  };

  beforeEach((): void => {
    user = undefined;
  });

  afterEach(() => {
    cleanup();
    cleanSocket();
  });

  test('CreateRoom renders wihtout crashing', (): void => {
    render(
      <ElementWithProviders 
        ui={<CreateRoom />}
        mockUserState={mockedUserState()}
        socket={socket}
      />
    );
    expect(
      screen.getByRole(
        'button', 
        { name: /Create Room/i }
      )
    ).toBeInTheDocument();
  });

  test('create room button disabled if not username', (): void => {
    render(
      <ElementWithProviders 
        ui={<CreateRoom />}
        mockUserState={mockedUserState()}
        socket={socket}
      />
    );
    expect(
      screen.getByRole(
        'button', 
        { name: /Create Room/i, disabled: true }
      )
    ).toBeDisabled();
  });


  test('create room button enabled if username', (): void => {
    render(
      <ElementWithProviders 
        ui={<CreateRoom />}
        mockUserState={mockedUserState()}
        socket={socket}
      />
    );
    const userNameInput = screen.getByRole('textbox', {type: 'text'});
    fireEvent.change(userNameInput, { target: { value: 'a' } });
    expect(
      screen.getByRole(
        'button', 
        { name: /Create Room/i, disabled: false }
      )
    ).toBeEnabled();
  });

  test(
    'when we click on create room button, we expect to received the joined ' +
    'room response, everything should be alright.', 
    (): void => {
      const username = 'owner';
      let fakeRoom: RoomT = {
        id: 'my-id',
        users: [ ],
        owner: '',
        round: 1,
        time: 30,
      };
      // mock of what the server should do. 
      socket.on('create-room', (data: CreateRoomRequestT) => {
        fakeRoom.users = [data.username];
        fakeRoom.owner = data.username;
        serverSocket.emit('joined-room', fakeRoom);
      });
      // still check if the username that created the room is the same
      socket.on('joined-room', (room: RoomT) => {
        expect(room).toBe(fakeRoom);
        expect(room.owner).toBe(username);
      });
      const history = createMemoryHistory();
      const ui = (
        <Router history={history}>
          <CreateRoom />
        </Router>
      );
      render(
        <ElementWithProviders 
          ui={ui}
          mockUserState={mockedUserState()}
          socket={socket}
        />
      );
      const userNameInput = screen.getByRole('textbox', {type: 'text'});
      const button = screen.getByRole('button', { name: /Create Room/i });
      fireEvent.change(userNameInput, { target: { value: username } });
      expect(button).toBeEnabled();
      fireEvent.click(button);
      expect(socket.has('joined-room')).toBe(true);
    }
  );
});
