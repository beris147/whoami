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
import JoinRoom from 'components/JoinRoom';
import io, { serverSocket, cleanSocket } from 'utils/__mocks__/MockedSocketIO';
import ElementWithProviders from 'components/__mocks__/ElementWithProviders';
import MockRouter from 'components/__mocks__/MockRouter';
import { createMemoryHistory } from 'history';
import { ENTER_KEY_CODE } from 'utils/keycodes';

import type { UserT, RoomT, JoinRoomRequestT } from 'common/types';

import '@testing-library/jest-dom';

describe('JoinRoom component', (): void => {

  const socket = io.connect();
  let user: ?UserT;
  let history: any;
  let ui: React$Element<any>;
  let elementToRender: React$Element<any>;

  const setUser: mixed = (user: UserT): void => { user = user; };

  beforeEach((): void => {
    user = undefined;
    history = createMemoryHistory();
    history.push('/join');
    ui = (
      <MockRouter 
        ui={<JoinRoom/>}
        history={history}
        path={'/join'}
      />
    );
    elementToRender = (
      <ElementWithProviders 
        ui={ui}
        mockUserState={{ user, setUser }}
        socket={socket}
      />
    );
  });

  afterEach(() => {
    cleanup();
    cleanSocket();
  });

  test('JoinRoom renders wihtout crashing', (): void => {
    render(elementToRender);
    const joinButton = screen.getByRole('button', { name: /Join Room/i });
    expect(joinButton).toBeInTheDocument();
  });
  
  test('join room button disabled if not username or not roomid', (): void => {
    render(elementToRender);
    const joinButton = screen.getByRole('button', { name: /Join Room/i });
    const userNameInput = screen.getByTestId('username');
    const roomIdInput = screen.getByTestId('roomid');
    expect(joinButton).toBeDisabled();
    fireEvent.change(userNameInput, { target: { value: 'username' } });
    expect(joinButton).toBeDisabled();
    fireEvent.change(roomIdInput, { target: { value: 'roomid' } });
    expect(joinButton).toBeEnabled();
  });
  
  test(
    'when the client clicks on join room, if the button is enabled, the join ' +
    'room request should be sent with a joined room response, and redirects ' +
    'user to /room/:roomid (the room route)', 
    (): void => {
      const username = 'owner';
      const roomid = 'my-id';
      let fakeRoom: RoomT = {
        id: roomid,
        users: [ ],
        owner: '',
        round: 1,
        time: 30,
      };
      serverSocket.on('join-room', (data: JoinRoomRequestT) => {
        fakeRoom.users.push(data.username);
        serverSocket.emit('joined-room', fakeRoom);
      });
      socket.on('joined-room', (room: RoomT) => {
        expect(room).toBe(fakeRoom);
        expect(room.users).toContain(username);
      });
      render(elementToRender);
      const joinButton = screen.getByRole('button', { name: /Join Room/i });
      const userNameInput = screen.getByTestId('username');
      const roomIdInput = screen.getByTestId('roomid');
      fireEvent.change(userNameInput, { target: { value: username } });
      fireEvent.change(roomIdInput, { target: { value: roomid } });
      expect(joinButton).toBeEnabled();
      fireEvent.keyDown(userNameInput, {keyCode: ENTER_KEY_CODE});
      expect(socket.has('joined-room')).toBe(true);
      expect(history.location.pathname).toBe(`/room/${roomid}`);
    }
  );
});
