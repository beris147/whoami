// @flow
import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { test, expect, describe, afterEach, beforeEach } from '@jest/globals';
import MockedProvider from 'providers/__mocks__/MockedProvider'
import '@testing-library/jest-dom';

describe('Mocked provider', () => {
  test('Mocked provider renders wihtout crashing', () => {
    const MockContext: React$Context<any> = React.createContext();
    render(
      <MockedProvider value={'test'} context={MockContext}>
        <h1>Test</h1>
      </MockedProvider>
    );
    expect(screen.getByText(/Test/i)).toBeInTheDocument();
  });
});