//@flow

import React, { useContext } from "react";
import RoomContext from "contexts/RoomContext";
import User from "./User";

import type { UsersInLobbyListT } from 'domain/models/LobbyDomainModels';

export type UserListPropsT = {
  userList: UsersInLobbyListT,
};

const UserList = (props: UserListPropsT): React$Element<any> => {
  const { room } = useContext(RoomContext);
  return (
    <ul>
      {props.userList.map((user) => (
        <li key={user.username}>
          <User user={user} isOwner={room?.owner === user.username}/>
        </li>
      ))}
    </ul>
  );
};

export default UserList;
