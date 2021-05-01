//@flow

import React from "react";
import type { UserInLobbyT } from "common/types";

export type UserPropsT = {|
  user: UserInLobbyT,
|};

const isReady = (user: UserInLobbyT): bool => {
  return 'writtenCharacter' in user;
}

const User = (props: UserPropsT): React$Element<any> => {
  return (
    <div>
      {props.user.username} {isReady(props.user) ? 'Ready' : 'Waiting'}
    </div>
  );
};

export default User;
