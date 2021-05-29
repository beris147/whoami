// @flow
import React, { useState } from 'react';
import RoomContext from 'contexts/RoomContext';

import type { RoomT } from 'domain/models/RoomModels';

const RoomProvider = ({ children }: any): React$Element<any> => {
  const [room: ?RoomT, setRoom: (r: RoomT) => void] = useState(undefined);
  return (
    <RoomContext.Provider value={{ room, setRoom }}>
      {children}
    </RoomContext.Provider>
  );
};

export default RoomProvider;
