// @flow
import React from 'react';

import type { RoomT } from 'common/types';

export type RoomContextT = {
  room: ?RoomT,
  setRoom: (r: ?RoomT) => void,
}

const RoomContext: React$Context<RoomContextT> = 
  React.createContext<RoomContextT>({
    room: undefined,
    setRoom: (r: ?RoomT): void => {},
  });

export default RoomContext;