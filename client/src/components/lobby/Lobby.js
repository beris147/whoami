//@flow

import React, { useEffect, useContext, useState } from "react";
import type { UserInLobbyT } from "common/types";
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

const Lobby = (): React$Element<any> => {
  const socket = useContext(SocketContext);
  const [userList: Array<UserInLobbyT>, setUserList] = useState(mockUsers);

  useEffect(() => {
    socket.on("user-joined", (username: string) => {
      const userInLobby: UserInLobbyT = {
        username: username,
        state: "Waiting",
      };
      const updatedUserList: Array<UserInLobbyT> = [...userList, userInLobby];
      setUserList(updatedUserList);
    });
    socket.emit("get-users-in-lobby", errorCallBack, setUserList);
  }, [socket, userList, setUserList]);
  return (
    <div>
      <ReadyButton />
      <UserList users={userList} />
      <PlayButton />
    </div>
  );
};

export default Lobby;
