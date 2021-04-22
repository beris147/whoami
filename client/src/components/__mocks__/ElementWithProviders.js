// @flow
import React from 'react';
import SocketContext from 'contexts/SocketContext';
import UserContext from 'contexts/UserContext';
import type { UserT } from 'common/types';
import MockedProvider from 'providers/__mocks__/MockedProvider';

type ElementWithProvidersT = {|
  ui: React$Element<any>,
  mockUserState: { user: ?UserT, setUser: mixed },
  socket: Object,
|};

function ElementWithProviders (
  props: ElementWithProvidersT
): React$Element<any> {
  return (
    <MockedProvider value={props.mockUserState} context={UserContext}>
      <MockedProvider value={props.socket} context={SocketContext}>
        {props.ui}
      </MockedProvider>
    </MockedProvider>
  );
}

export default ElementWithProviders;