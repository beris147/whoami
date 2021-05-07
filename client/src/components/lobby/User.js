//@flow

import React from "react";
import type { UserInLobbyT } from "common/types";

export type UserPropsT = {|
  user: UserInLobbyT,
  isOwner: bool,
|};

const User = (props: UserPropsT): React$Element<any> => {
  const isReady = (user: UserInLobbyT): bool => {
    return 'writtenCharacter' in user;
  }
  return (
    <div>
      {props.user.username}
      {isReady(props.user) ? ' Ready' : ' Waiting'}
      {props.isOwner && '⭐'}
    </div>
  );
};

export default User;
