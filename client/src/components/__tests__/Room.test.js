// @flow
import React from 'react';
import { render, screen } from '@testing-library/react';
import { test, expect, describe, beforeEach } from '@jest/globals';
import Room from 'components/Room';
import ElementWithProviders from 'components/__mocks__/ElementWithProviders';
import MockRouter from 'components/__mocks__/MockRouter';
import { createMemoryHistory } from 'history';
import { ROOMID } from 'utils/__mocks__/mockedRoomState';
import '@testing-library/jest-dom';


describe('Room component', (): void => {
  const history = createMemoryHistory();
  beforeEach((): void => {
    history.push(`/room/${ROOMID}`);
  });
  describe('app is defined', () => {
    beforeEach(() => {
      const mockApp = {
        roomId: ROOMID,
        subscribeToEvents: () => {},
        unsubscribeFromEvents: () => {},
      }
      render(
        <ElementWithProviders>
          <MockRouter history={history} path={'/room/:id'}>
            <Room app={mockApp}/>
          </MockRouter>
        </ElementWithProviders>
      );
    });
    test('Load room view', () => {
      const re = new RegExp(ROOMID);
      const search = screen.getByText(re);
      expect(search).toBeInTheDocument();
    });
  });
  describe('app is undefined due to room beign undefined', () => {
    beforeEach(() => {
      render(
        <ElementWithProviders>
          <MockRouter history={history} path={'/room/:id'}>
            <Room />
          </MockRouter>
        </ElementWithProviders> 
      );
    });
    test('redirect to join/roomid to define app', () => {
      expect(history.location.pathname).toBe(`/join/${ROOMID}`);
    });
  });
});
