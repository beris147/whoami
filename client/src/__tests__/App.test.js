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
import MockedProvider from 'providers/__mocks__/MockedProvider';
import SocketContext from 'contexts/SocketContext';
import UserContext from 'contexts/UserContext';
import io from 'utils/__mocks__/MockedSocketIO';
import App from '../App';

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
      <MockedProvider value={mockUserState} context={UserContext}>
        <MockedProvider value={socket} context={SocketContext}>
          <MemoryRouter initialEntries={['/create']}>
            <App />
          </MemoryRouter>
        </MockedProvider>
      </MockedProvider>
    );
    expect(
      screen.getByRole(
        'button', 
        { name: /Create Room/i }
      )
    ).toBeInTheDocument();
  });
  
});
