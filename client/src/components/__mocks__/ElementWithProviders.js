// @flow
import React from 'react';
import RoomContext from 'contexts/RoomContext';
import SocketContext from 'contexts/SocketContext';
import UserContext from 'contexts/UserContext';
import type { RoomT, UserT } from 'common/types';
import MockedProvider from 'providers/__mocks__/MockedProvider';
import mockedRoomState from 'utils/__mocks__/mockedRoomState';
import mockedUserState from 'utils/__mocks__/mockedUserState';
import io from 'utils/__mocks__/MockedSocketIO';

type ElementWithProvidersT = {|
  children: React$Element<any>,
  mockedRoomState?: ?{ room: ?RoomT, setRoom: (r: ?RoomT) => void },
  mockedUserState?: ?{ user: ?UserT, setUser: (u: ?UserT) => void },
  socket?: ?Object,
|};

function ElementWithProviders (
  props: ElementWithProvidersT
): React$Element<any> {
  const roomState = props.mockedRoomState || mockedRoomState;
  const userState = props.mockedUserState || mockedUserState;
  const socket = props.socket || io.connect();
  return (
    <MockedProvider value={roomState} context={RoomContext}>
      <MockedProvider value={userState} context={UserContext}>
        <MockedProvider value={socket} context={SocketContext}>
          {props.children}
        </MockedProvider>
      </MockedProvider>
    </MockedProvider>
  );
}

export default ElementWithProviders;