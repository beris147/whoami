// @flow
import React from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { test, expect, describe, afterEach, beforeEach } from '@jest/globals';
import ElementWithProviders from 'components/__mocks__/ElementWithProviders';
import io, { serverSocket, cleanSocket } from 'utils/__mocks__/MockedSocketIO';
import Chat from 'components/Chat/Chat';

import type { UserT, MessageT } from 'common/types';

import '@testing-library/jest-dom';

describe('Chat component', (): void => {

  const socket = io.connect();
  let user: ?UserT = { username: 'user', id: 'id', roomId: 'roomid' };
  let ui: React$Element<any>;

  const setUser = (newUser: ?UserT): void => { user = newUser; };

  beforeEach(() => {
    ui = (
      <ElementWithProviders 
        ui={<Chat/>}
        mockUserState={{ user, setUser }}
        socket={socket}
      />
    );
  });

  afterEach(() => {
    cleanup();
    cleanSocket();
  });

  test('Chat renders wihtout crashing', (): void => {
    render(ui);
    expect(screen.getByText(/Chat/i)).toBeInTheDocument();
  });

  test('Chat message is sent to the room', (): void => {
    // mock of what the server should do. TODO replace with serverSocket
    socket.on('send-message', (newMessage: MessageT) => {
      serverSocket.emit('new-message', newMessage);
    });
    render(ui);
    const messageInput = screen.getByRole('textbox', {type: 'text'});
    const button = screen.getByRole('button', { name: /Send/i });
    expect(button).toBeDisabled();
    fireEvent.change(messageInput, { target: { value: 'new message' } });
    expect(button).toBeEnabled();
    fireEvent.click(button);
    expect(screen.getByText(/new message/i)).toBeInTheDocument();
  });
});