//@flow

import React, { useEffect, useContext, useState } from "react";
import type { UserInLobbyT, UserT } from "common/types";
import UserList from "./UserList";
import ReadyButton from "./ReadyButton";
import PlayButton from "./PlayButton";
import SocketContext from "contexts/SocketContext";
import errorCallBack from "utils/errorCallBack";

const mockUsers: Array<UserInLobbyT> = [
  { username: "username1", state: "Ready" },
  { username: "username2", state: "Waiting" },
  { username: "username3", state: "Waiting" },
  { username: "username4", state: "Ready" },
];

export type LobbyPropsT = {|
  roomId: string,
|};

const Lobby = (props: LobbyPropsT): React$Element<any> => {
  const socket = useContext(SocketContext);
  const [userList: Array<UserInLobbyT>, setUserList] = useState(mockUsers);
  const addUserToList = (username: string) => {
    const userInLobby: UserInLobbyT = {
      username: username,
      state: "Waiting",
    };
    const updatedUserList: Array<UserInLobbyT> = [...userList, userInLobby];
    setUserList(updatedUserList);
  };
  useEffect(() => {
    socket.on("user-joined", (username: string) => {
      addUserToList(username);
    });
    socket.emit("get-users-in-lobby", props.roomId, errorCallBack, setUserList);
  });
  return (
    <div>
      <ReadyButton />
      <UserList users={userList} />
      <PlayButton />
    </div>
  );
};

export default Lobby;
