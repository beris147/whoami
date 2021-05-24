// @flow
import React from 'react';
import { render, screen } from '@testing-library/react';
import { test, expect, describe, beforeEach } from '@jest/globals';
import Lobby from 'components/lobby/Lobby';
import ElementWithProviders from 'components/__mocks__/ElementWithProviders';
import LobbyContext from 'contexts/Lobby/LobbyContext';
import { userList, setUserList } from 'utils/__mocks__/Lobby/mockedUserListState';

import '@testing-library/jest-dom';

describe('Lobby component', (): void => {
  const TESTUSER = 'test-username';
  beforeEach(() => {
    setUserList([ { username: TESTUSER }]);    
  });
  describe('user and room are not defined', () => {
    beforeEach(() => {
      render(
        <LobbyContext.Provider value={{ userList, setUserList }}>
          <Lobby />
        </LobbyContext.Provider>
      );
    });
    test('Lobby does not render, display error', (): void => {
      expect(screen.getByText(/room or user is undefined/)).toBeInTheDocument();
    });
  });
  describe('user and room are defined', () => {
    beforeEach(() => {
      render(
        <ElementWithProviders>
          <LobbyContext.Provider value={{ userList, setUserList }}>
            <Lobby />
          </LobbyContext.Provider>
        </ElementWithProviders>
      );
    });
    test('Lobby renders, userList contains TESTUSER', () => {
      expect(userList.map(user => user.username)).toContain(TESTUSER);
      expect(screen.getByText(new RegExp(TESTUSER))).toBeInTheDocument();
    });
  });
});
