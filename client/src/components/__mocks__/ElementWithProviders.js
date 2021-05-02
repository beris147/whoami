// @flow
import React from 'react';
import RoomContext from 'contexts/RoomContext';
import SocketContext from 'contexts/SocketContext';
import UserContext from 'contexts/UserContext';
import type { RoomT, UserT } from 'common/types';
import MockedProvider from 'providers/__mocks__/MockedProvider';

type ElementWithProvidersT = {|
  children: React$Element<any>,
  mockedRoomState?: ?{ room: ?RoomT, setRoom: (r: ?RoomT) => void },
  mockedUserState?: ?{ user: ?UserT, setUser: (u: ?UserT) => void },
  socket?: ?Object,
|};

function ElementWithProviders (
  props: ElementWithProvidersT
): React$Element<any> {
  return (
    <MockedProvider value={props.mockedUserState} context={UserContext}>
      <MockedProvider value={props.socket} context={SocketContext}>
        <MockedProvider value={props.mockedRoomState} context={RoomContext}>
          {props.children}
        </MockedProvider>
      </MockedProvider>
    </MockedProvider>
  );
}

export default ElementWithProviders;