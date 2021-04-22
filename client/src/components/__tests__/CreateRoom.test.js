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
import MockedProvider from 'providers/__mocks__/MockedProvider';
import SocketContext from 'contexts/SocketContext';
import UserContext from 'contexts/UserContext';
import CreateRoom from '../CreateRoom';
import io, { serverSocket, cleanSocket } from 'utils/__mocks__/MockedSocketIO';
import type { UserT, RoomT, CreateRoomRequestT } from 'common/types';

import '@testing-library/jest-dom';

const customRender = (
  ui: React$Element<any>,
  mockUserState: { user: ?UserT, setUser: mixed },
  socket: Object,
): React$Element<any> => {
  return render(
    <MockedProvider value={mockUserState} context={UserContext}>
      <MockedProvider value={socket} context={SocketContext}>
        {ui}
      </MockedProvider>
    </MockedProvider>
  );
}

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
    customRender(<CreateRoom />, mockedUserState(), socket);
    expect(
      screen.getByRole(
        'button', 
        { name: /Create Room/i }
      )
    ).toBeInTheDocument();
  });

  test('create room button disabled if not username', (): void => {
    customRender(<CreateRoom />, mockedUserState(), socket);
    expect(
      screen.getByRole(
        'button', 
        { name: /Create Room/i, disabled: true }
      )
    ).toBeDisabled();
  });


  test('create room button enabled if username', (): void => {
    customRender(<CreateRoom />, mockedUserState(), socket);
    const userNameInput = screen.getByRole('textbox', {type: 'text'});
    fireEvent.change(userNameInput, { target: { value: 'a' } });
    expect(
      screen.getByRole(
        'button', 
        { name: /Create Room/i, disabled: false }
      )
    ).toBeEnabled();
  });

  test('create and join room sockets test', (): void => {
    const username = 'owner';
    let fakeRoom: RoomT = {
      id: 'my-id',
      users: [ ],
      owner: '',
      round: 1,
      time: 30,
    };
    socket.on('create-room', (data: CreateRoomRequestT) => {
      fakeRoom.users = [data.username];
      fakeRoom.owner = data.username;
      serverSocket.emit('joined-room', fakeRoom);
    });
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
    customRender(ui, mockedUserState(), socket);
    const userNameInput = screen.getByRole('textbox', {type: 'text'});
    const button = screen.getByRole('button', { name: /Create Room/i });
    fireEvent.change(userNameInput, { target: { value: username } });
    expect(button).toBeEnabled();
    fireEvent.click(button);
    expect(socket.has('joined-room')).toBe(true);
  });

});
