// @flow
import React from 'react';
import { render, screen } from '@testing-library/react';
import { test, expect, describe, beforeEach } from '@jest/globals';
import Lobby from 'components/lobby/Lobby';
import ElementWithProviders from 'components/__mocks__/ElementWithProviders';

import '@testing-library/jest-dom';

describe('Lobby component', (): void => {
  describe('user and room are defined', () => {
    beforeEach(() => {
      render(
        <ElementWithProviders>
          <Lobby />
        </ElementWithProviders>
      );
    });
    test('Lobby renders', () => {
      expect(screen.getByText(/Ready/)).toBeInTheDocument();
    });
  });
});
