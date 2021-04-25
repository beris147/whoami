//@flow

import React from "react";
import type { UserInLobbyT } from "common/types";
import type { UserPropsT } from "./User";
import User from "./User";

export type UserListPropsT = {|
  users: Array<UserInLobbyT>,
|};

const UserList = (props: UserListPropsT): React$Element<any> => {
  return (
    <ul>
      {props.users.map((user) => (
        <li key={user.username}><User user={user} /></li>
      ))}
    </ul>
  );
};

export default UserList;
