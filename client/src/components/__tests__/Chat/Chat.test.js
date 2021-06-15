// @flow
import React from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { test, expect, describe, afterEach, beforeEach } from '@jest/globals';
import ElementWithProviders from 'components/__mocks__/ElementWithProviders';
import io, { serverSocket, cleanSocket } from 'utils/__mocks__/MockedSocketIO';
import { user, setUser } from 'utils/__mocks__/mockedUserState';
import Chat from 'components/Chat/Chat';

import type { MessageT } from 'domain/models/MessageModels';
import type { UserT } from 'domain/models/UserModels';

import '@testing-library/jest-dom';

describe('Chat component', (): void => {
  const socket = io.connect();

  beforeEach(() => {
    const auxUser: ?UserT = { username: 'user', id: 'id', roomId: 'roomid' };
    setUser(auxUser);
    render(
      <ElementWithProviders socket={socket} mockedUserState={{ user, setUser }}>
        <Chat />
      </ElementWithProviders>
    );
  });

  afterEach(() => {
    cleanup();
    cleanSocket();
  });

  test('Chat renders wihtout crashing', (): void => {
    expect(screen.getByText(/Chat/i)).toBeInTheDocument();
  });

  test('Chat message is sent to the room', (): void => {
    // mock of what the server should do. TODO replace with serverSocket
    socket.on('send-message', (newMessage: MessageT) => {
      serverSocket.emit('new-message', newMessage);
    });
    const messageInput = screen.getByRole('textbox', { type: 'text' });
    const button = screen.getByRole('button', { name: /Send/i });
    expect(button).toBeDisabled();
    fireEvent.change(messageInput, { target: { value: 'new message' } });
    expect(button).toBeEnabled();
    fireEvent.click(button);
    expect(screen.getByText(/new message/i)).toBeInTheDocument();
  });
});
