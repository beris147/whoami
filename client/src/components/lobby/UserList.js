//@flow

import React, { useContext } from "react";
import RoomContext from "contexts/RoomContext";
import type { UserInLobbyT } from "common/types";
import User from "./User";

export type UserListPropsT = {|
  users: Array<UserInLobbyT>,
|};

const UserList = (props: UserListPropsT): React$Element<any> => {
  const { room } = useContext(RoomContext);
  return (
    <ul>
      {props.users.map((user) => (
        <li key={user.username}>
          <User user={user} isOwner={room?.owner === user.username}/>
        </li>
      ))}
    </ul>
  );
};

export default UserList;
