// @flow
import React from 'react';
import { render, screen } from '@testing-library/react';
import { test, expect, describe } from '@jest/globals';
import Home from 'components/Home';

import '@testing-library/jest-dom';

describe('CreateRoom component', (): void => {
  test('Home renders wihtout crashing', (): void => {
    render(<Home />);
    expect(screen.getByText(/Home/i)).toBeInTheDocument();
  });
});
