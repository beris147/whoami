// @flow
import React from 'react';
import { render, screen } from '@testing-library/react';
import { test, expect, describe } from '@jest/globals';
import PageNotFound from 'components/PageNotFound';
import Home from 'components/Home';
import { MemoryRouter, Route, Switch } from 'react-router-dom';

import '@testing-library/jest-dom';

describe('PageNotFound component', (): void => {
  test('PageNotFound renders wihtout crashing', (): void => {
    render(<PageNotFound />);
    expect(screen.getByText(/Page Not Found/i)).toBeInTheDocument();
  });
  
  test('Router redirects to page not found with invalid routes', (): void => {
    render(
      <MemoryRouter initialEntries={['/invalid/route']}>
        <Switch>
          <Route exact path={'/'} component={Home} />
          <Route component={PageNotFound} />
        </Switch>
      </MemoryRouter>
    );
    expect(screen.getByText(/Page Not Found/i)).toBeInTheDocument();
  });

  test('Router works fine with valid routes', (): void => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Switch>
          <Route exact path={'/'} component={Home} />
          <Route component={PageNotFound} />
        </Switch>
      </MemoryRouter>
    );
    expect(screen.getByText(/Home/i)).toBeInTheDocument();
  });
});