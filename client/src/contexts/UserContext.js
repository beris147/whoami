// @flow
import React from 'react';

import type { UserT } from 'domain/models/UserModels';

export type UserContextT = {|
  user: ?UserT,
  setUser: (u: ?UserT) => void,
|};

const UserContext: React$Context<UserContextT> =
  React.createContext<UserContextT>({
    user: undefined,
    setUser: (u: ?UserT): void => {},
  });

export default UserContext;
