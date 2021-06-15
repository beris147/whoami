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
import App from '../App';
import ElementWithProviders from 'components/__mocks__/ElementWithProviders';

import '@testing-library/jest-dom';

describe('App component', () => {
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
    render(
      <MemoryRouter initialEntries={['/create']}>
        <ElementWithProviders>
          <App />
        </ElementWithProviders>
      </MemoryRouter>
    );
    expect(
      screen.getByRole('button', { name: /Create Room/i })
    ).toBeInTheDocument();
  });
});
