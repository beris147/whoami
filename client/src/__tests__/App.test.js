// @flow
import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import {
  test,
  expect,
  describe,
  afterEach,
  beforeEach,
  jest,
} from '@jest/globals';
import { MemoryRouter } from 'react-router-dom';
import io from 'utils/__mocks__/MockedSocketIO';
import App from '../App';
import ElementWithProviders from 'components/__mocks__/ElementWithProviders';
import mockedRoomState from 'utils/__mocks__/mockedRoomState';
import mockedUserState from 'utils/__mocks__/mockedUserState';

import '@testing-library/jest-dom';

describe('App component', () => {

  const socket = io.connect();

  afterEach(cleanup);

  test('App renders wihtout crashing', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText(/Create new room/i)).toBeInTheDocument();
  });

  test('App routing test', () => {
    const mockUserState = {user: undefined, setUser: () => {}};
    render(
      <MemoryRouter initialEntries={['/create']}>
        <ElementWithProviders 
          mockedRoomState={mockedRoomState}
          mockedUserState={mockUserState}
          socket={socket}
        >
          <App/>
        </ElementWithProviders>
      </MemoryRouter>
    );
    expect(
      screen.getByRole(
        'button', 
        { name: /Create Room/i }
      )
    ).toBeInTheDocument();
  });
  
});
