// @flow
import React from 'react';
import GameContext from 'contexts/GameContext';
import RoomContext from 'contexts/RoomContext';
import SocketContext from 'contexts/SocketContext';
import UserContext from 'contexts/UserContext';
import MockedProvider from 'providers/__mocks__/MockedProvider';
import mockedGameState from 'utils/__mocks__/mockedGameState';
import mockedRoomState from 'utils/__mocks__/mockedRoomState';
import mockedUserState from 'utils/__mocks__/mockedUserState';
import io from 'utils/__mocks__/MockedSocketIO';

import type { GameT } from 'domain/models/GameModels';
import type { RoomT } from 'domain/models/RoomModels';
import type { UserT } from 'domain/models/UserModels';
type ElementWithProvidersT = {|
  children: React$Element<any>,
  mockedRoomState?: ?{ room: ?RoomT, setRoom: (r: ?RoomT) => void },
  mockedUserState?: ?{ user: ?UserT, setUser: (u: ?UserT) => void },
  mockedGameState?: ?{ game: ?GameT, setGame: (g: ?GameT) => void },
  socket?: ?Object,
|};

function ElementWithProviders(
  props: ElementWithProvidersT
): React$Element<any> {
  const gameState = props.mockedGameState || mockedGameState;
  const roomState = props.mockedRoomState || mockedRoomState;
  const userState = props.mockedUserState || mockedUserState;
  const socket = props.socket || io.connect();
  return (
    <MockedProvider value={roomState} context={RoomContext}>
      <MockedProvider value={userState} context={UserContext}>
        <MockedProvider value={socket} context={SocketContext}>
          <MockedProvider value={gameState} context={GameContext}>
            {props.children}
          </MockedProvider>
        </MockedProvider>
      </MockedProvider>
    </MockedProvider>
  );
}

export default ElementWithProviders;
