//@flow

import React from "react";
import type { UserInLobbyT } from "common/types";

export type UserPropsT = {|
  user: UserInLobbyT,
|};

const User = (props: UserPropsT): React$Element<any> => {
  return (
    <div>
      {props.user.username} {props.user.state}
    </div>
  );
};

export default User;
