// @flow
import React from 'react';
import { render, screen } from '@testing-library/react';
import { test, expect, describe } from '@jest/globals';
import MessageList from 'components/Chat/MessageList';

import type { MessageT, MessageListT } from 'domain/models/MessageModels';
import type { UserT } from 'domain/models/UserModels';

import '@testing-library/jest-dom';

describe('MessageList component', (): void => {
  test('MessageList render messages in list', (): void => {
    const testUser: UserT = { username: 'testUser', id: 'id', roomId: 'room' };
    const testMessage: MessageT = {
      message: 'expect to found this',
      sender: testUser,
    };
    render(<MessageList messages={[testMessage]} />);
    expect(screen.getByText(/expect to found this/i)).toBeInTheDocument();
  });
});
