// @flow
import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { test, expect, describe, afterEach, beforeEach } from '@jest/globals';
import '@testing-library/jest-dom';

type MockProviderT = {|
  context: React$Context<any>,
  children: any,
  value: any,
|};

const MockedProvider = (props: MockProviderT): React$Element<any> => {
  return (
    <props.context.Provider value={props.value}>
      {props.children}
    </props.context.Provider>
  );
}

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


export default MockedProvider;