// @flow
import React from 'react';
import JoinRoom from 'components/JoinRoom';
import MockRouter from 'components/__mocks__/MockRouter';
import ElementWithProviders from 'components/__mocks__/ElementWithProviders';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { test, expect, describe, beforeEach } from '@jest/globals';
import '@testing-library/jest-dom';

describe('JoinRoom component', (): void => {
  let joinButton;
  let userNameInput;
  let roomIdInput;
  beforeEach((): void => {
    render(
      <ElementWithProviders>
        <MockRouter initialEntries={['/join']} path={'/join'}>
          <JoinRoom />
        </MockRouter>
      </ElementWithProviders>
    );
    joinButton = screen.getByRole('button', { name: /Join Room/i });
    userNameInput = screen.getByTestId('username');
    roomIdInput = screen.getByTestId('roomid');
  });
  test('JoinRoom renders wihtout crashing', (): void => {
    expect(joinButton).toBeInTheDocument();
  });
  test('join room button disabled if not username or not roomid', (): void => {
    expect(joinButton).toBeDisabled();
    fireEvent.change(userNameInput, { target: { value: 'username' } });
    expect(joinButton).toBeDisabled();
    fireEvent.change(roomIdInput, { target: { value: 'roomid' } });
    expect(joinButton).toBeEnabled();
  });
});
