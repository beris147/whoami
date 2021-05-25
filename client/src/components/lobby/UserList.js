//@flow

import React from 'react';
import User from './User';

import type { UsersInLobbyListT } from 'domain/models/LobbyDomainModels';

export type UserListPropsT = {
  userList: UsersInLobbyListT,
  roomOwner: string,
};

const UserList = (props: UserListPropsT): React$Element<any> => {
  return (
    <ul>
      {props.userList.map((user) => (
        <li key={user.username}>
          <User user={user} isOwner={props.roomOwner === user.username}/>
        </li>
      ))}
    </ul>
  );
};

export default UserList;
