// @flow
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { test, expect, describe, beforeEach } from '@jest/globals';
import CreateRoom from 'components/CreateRoom';

import '@testing-library/jest-dom';

describe('CreateRoom component', (): void => {
  let joinButton;
  let userNameInput;
  beforeEach((): void => {
    render(<CreateRoom />);
    joinButton = screen.getByRole('button', { name: /Create Room/i });
    userNameInput = screen.getByRole('textbox', {type: 'text'});
  });
  test('CreateRoom renders wihtout crashing', (): void => {
    expect(joinButton).toBeInTheDocument();
  });
  test('create room button disabled if not username is given', (): void => {
    expect(joinButton).toBeDisabled();
    fireEvent.change(userNameInput, { target: { value: 'username' } });
    expect(joinButton).toBeEnabled();
  });  
});
