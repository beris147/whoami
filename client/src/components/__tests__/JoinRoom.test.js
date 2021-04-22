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
import { MemoryRouter, Route } from 'react-router-dom';
import JoinRoom from '../JoinRoom';
import io, { serverSocket, cleanSocket } from 'utils/__mocks__/MockedSocketIO';
import ElementWithProviders from 'components/__mocks__/ElementWithProviders';
import type { UserT, RoomT, JoinRoomRequestT } from 'common/types';

import '@testing-library/jest-dom';

// Join room needs useParams hook, with this personalized router we can have
// it in test enviroment

type CustomMemoryRouterT = {
  ui: React$Element<any>,
  initialEntries: [string],
  path: string,
};

function CustomMemoryRouter(props: CustomMemoryRouterT): React$Element<any>{
  return (
    <MemoryRouter initialEntries={props.initialEntries}>
      <Route path={props.path}>
        {props.ui}
      </Route>
    </MemoryRouter>
  );
}

describe('JoinRoom component', (): void => {

  const socket = io.connect();
  let user: ?UserT;

  const setUser: mixed = (user: UserT): void => { user = user; };

  const ui = (
    <CustomMemoryRouter 
      ui={<JoinRoom/>}
      initialEntries={['join']}
      path={'join'}
    />
  );

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

  test('JoinRoom renders wihtout crashing', (): void => {
    render(
      <ElementWithProviders 
        ui={ui}
        mockUserState={mockedUserState()}
        socket={socket}
      />
    );
    expect(
      screen.getByRole(
        'button', 
        { name: /Join Room/i }
      )
    ).toBeInTheDocument();
  });
  
  test('join room button disabled if not username or not roomid', (): void => {
    render(
      <ElementWithProviders 
        ui={ui}
        mockUserState={mockedUserState()}
        socket={socket}
      />
    );
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
    'room request should be sent with a joined room response', 
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
      socket.on('join-room', (data: JoinRoomRequestT) => {
        fakeRoom.users.push(data.username);
        serverSocket.emit('joined-room', fakeRoom);
      });
      socket.on('joined-room', (room: RoomT) => {
        expect(room).toBe(fakeRoom);
        expect(room.users).toContain(username);
      });
      render(
        <ElementWithProviders 
          ui={ui}
          mockUserState={mockedUserState()}
          socket={socket}
        />
      );
      const joinButton = screen.getByRole('button', { name: /Join Room/i });
      const userNameInput = screen.getByTestId('username');
      const roomIdInput = screen.getByTestId('roomid');
      fireEvent.change(userNameInput, { target: { value: username } });
      fireEvent.change(roomIdInput, { target: { value: roomid } });
      expect(joinButton).toBeEnabled();
      fireEvent.click(joinButton);
      expect(socket.has('joined-room')).toBe(true);
    }
  );
});
