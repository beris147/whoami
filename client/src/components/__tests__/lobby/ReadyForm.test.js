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
  const socket = io.connect();
  const elementToRender: React$Element<any> = (
    <ElementWithProviders 
      ui={<ReadyForm />}
      mockUserState={{ user: null, setUser: null }}
      socket={socket}
    />
  );
  afterEach(() => {
    cleanup();
    cleanSocket();
  });
  test('button ready is disabled if no character is given', (): void => {
    render(elementToRender);
    const readyButton = screen.getByRole('button', { name: /Ready/i });
    expect(readyButton).toBeDisabled();
  });
  test('button ready is enabled if a character is given', (): void => {
    render(elementToRender);
    const characterInput = screen.getByRole('textbox', {type: 'text'});
    const readyButton = screen.getByRole('button', { name: /Ready/i });
    fireEvent.change(characterInput, { target: { value: 'Linus' } });
    expect(readyButton).toBeEnabled();
  });
  test(
    'when we click on ready button, the server should receive a message ' +
    'titled set-ready-lobby, with the character, and the change button ' +
    'should appear in the render', 
    (): void => {
      const character: string = 'Linus Torvalds'; 
      // mock of what the server should do. 
      serverSocket.on('set-ready-lobby', (writtenCharacter: string) => {
        expect(writtenCharacter).toEqual(character);
      });
      render(elementToRender);
      const characterInput = screen.getByRole('textbox', {type: 'text'});
      const readyButton = screen.getByRole('button', { name: /Ready/i });
      fireEvent.change(characterInput, { target: { value: character } });
      expect(readyButton).toBeEnabled();
      fireEvent.keyDown(characterInput, {keyCode: ENTER_KEY_CODE});
      expect(characterInput).toBeDisabled();
      const changeButton = screen.getByRole('button', { name: /Change/i });
      expect(changeButton).toBeEnabled();
      fireEvent.click(changeButton);
      expect(characterInput).toBeEnabled();
    }
  );
});