// @flow
import React from 'react';

import type { UsersInLobbyListT } from 'domain/models/LobbyDomainModels';

export type LobbyContextT = {
  userList: UsersInLobbyListT,
  setUserList: (ul: UsersInLobbyListT) => void,
}

const LobbyContext: React$Context<LobbyContextT> = 
  React.createContext<LobbyContextT>({
    userList: [],
    setUserList: (ul: UsersInLobbyListT): void => {},
  });

export default LobbyContext;