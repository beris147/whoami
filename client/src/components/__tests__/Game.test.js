// @flow
import React from 'react';
import { render, screen, cleanup, act } from '@testing-library/react';
import { test, expect, describe, afterEach, beforeEach } from '@jest/globals';
import Game from 'components/Game';
import ElementWithProviders from 'components/__mocks__/ElementWithProviders';
import io, { serverSocket, cleanSocket } from 'utils/__mocks__/MockedSocketIO';
import { game, setGame } from 'utils/__mocks__/mockedGameState';
import type { UserInGameT } from 'domain/models/UserModels';
import '@testing-library/jest-dom';

describe('Game component test', (): void => {
  const socket = io.connect();
  const testUser1: UserInGameT = {
    username: 'username1',
    assignedCharacter: 'character1',
    points: 0,
  };
  const testUser2: UserInGameT = {
    username: 'username',
    assignedCharacter: 'character2',
    points: 0,
  };
  if (game) setGame({ ...game, users: [testUser1, testUser2] });
  beforeEach(() => {
    serverSocket.on('next-turn', () => {
      serverSocket.emit('next-turn');
    });
    serverSocket.on('user-got-it', (username: string) => {
      serverSocket.emit('user-got-it', username);
    });
    render(
      <ElementWithProviders socket={socket} mockedGameState={{ game, setGame }}>
        <Game />
      </ElementWithProviders>
    );
  });
  afterEach(() => {
    cleanup();
    cleanSocket();
  });
  describe('on next-turn', () => {
    beforeEach(() => {
      act(() => {
        socket.emit('next-turn');
      });
    });
    test('On next-turn, the game turn increases', (): void => {
      expect(game?.turn).toBe(1);
    });
    test('After two turns, the round should change', (): void => {
      expect(game?.round).toBe(1);
      expect(game?.turn).toBe(0);
    });
  });
  describe('when user gets it right', () => {
    beforeEach(() => {
      act(() => {
        socket.emit('user-got-it', testUser1.username);
      });
    });
    test('it should get points', () => {
      expect(game?.users[0].points).not.toBe(0);
    });
  });
});
