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
import { createMemoryHistory } from 'history';
import ReadyForm from 'components/lobby/ReadyForm';
import io, { serverSocket, cleanSocket } from 'utils/__mocks__/MockedSocketIO';
import ElementWithProviders from 'components/__mocks__/ElementWithProviders';
import { ENTER_KEY_CODE } from 'utils/keycodes';

import type { UserT } from 'common/types';

import '@testing-library/jest-dom';

describe('ReadyForm component', (): void => {
  let socket;
  let characterInput;
  let readyButton;
  const character: string = 'Linus Torvalds'; 
  beforeEach(() => {
    socket = io.connect();
    render(
      <ElementWithProviders 
        ui={<ReadyForm />}
        mockUserState={{ user: null, setUser: null }}
        socket={socket}
      />
    );
    readyButton = screen.getByRole('button', { name: /Ready/i });
    characterInput = screen.getByRole('textbox', {type: 'text'});
  });
  afterEach(() => {
    cleanup();
    cleanSocket();
  });
  test('button ready is disabled if no character is given', (): void => {
    expect(readyButton).toBeDisabled();
  });
  test('button ready is enabled if a character is given', (): void => {
    fireEvent.change(characterInput, { target: { value: character } });
    expect(readyButton).toBeEnabled();
  });
  describe('when user clicks on ready', () => {
    let changeButton;
    beforeEach(() => {
      fireEvent.change(characterInput, { target: { value: character } });
      fireEvent.click(readyButton);
      changeButton = screen.getByRole('button', { name: /Change/i });
    });
    test(
      'the server should receive a message titled set-ready-lobby, with the ' + 
      'character written by the user',
      (): void => {
        serverSocket.on('set-ready-lobby', (writtenCharacter: string) => {
          expect(writtenCharacter).toEqual(character);
        });
      }
    );
    test('the change button should be redered', (): void => {
      expect(changeButton).toBeEnabled();
    });
    describe('after being ready, user clicks on change', (): void => {
      beforeEach(() => {
        fireEvent.click(changeButton);
      });
      test('the character input should be enabled again', (): void => {
        expect(characterInput).toBeEnabled();
      });
    });
  });
});