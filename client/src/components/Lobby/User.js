//@flow

import React from 'react';
import type { UserInLobbyT } from 'domain/models/UserModels';

export type UserPropsT = {|
  user: UserInLobbyT,
  isOwner: boolean,
|};

const User = (props: UserPropsT): React$Element<any> => {
  const isReady = (user: UserInLobbyT): boolean => {
    return 'writtenCharacter' in user;
  };
  return (
    <div>
      {props.user.username}
      {isReady(props.user) ? ' Ready' : ' Waiting'}
      {props.isOwner && '⭐'}
    </div>
  );
};

export default User;
