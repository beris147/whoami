// @flow
import React, { useContext } from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { test, expect, describe, afterEach } from '@jest/globals';
import { BrowserRouter, Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import '@testing-library/jest-dom';

import App from '../App';

describe('App component', () => {
  afterEach(cleanup);

  test('App renders wihtout crashing test', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    expect(screen.getByText(/Create new room/i)).toBeInTheDocument();
  });

  test('App routing test', () => {
    const history = createMemoryHistory();
    history.push('/create');
    render(
      <Router history={history}>
        <App />
      </Router>
    );
    expect(
      screen.getByRole(
        'button', 
        { name: /Create Room/i }
      )
    ).toBeInTheDocument();
  });
  
});
