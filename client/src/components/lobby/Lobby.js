//@flow

import React, { useEffect, useContext, useState } from "react";
import type { UserInLobbyT, UserT } from "common/types";
import UserList from "./UserList";
import ReadyButton from "./ReadyButton";
import PlayButton from "./PlayButton";
import SocketContext from "contexts/SocketContext";

const mockUsers: Array<UserInLobbyT> = [
  { id: "id1", username: "username1", roomId: "room", state: "Ready" },
  { id: "id2", username: "username2", roomId: "room", state: "Waiting" },
  { id: "id3", username: "username3", roomId: "room", state: "Waiting" },
  { id: "id4", username: "username4", roomId: "room", state: "Ready" },
];

const Lobby = (): React$Element<any> => {
  const socket = useContext(SocketContext);
  const [userList: Array<UserInLobbyT>, setUserList] = useState(mockUsers);
  const addUserToList = (user: UserT) => {
    const userInLobby: UserInLobbyT = {
      ...user,
      state: "Waiting",
    };
    const updatedUserList: Array<UserInLobbyT> = [...userList, userInLobby];
    setUserList(updatedUserList);
  };
  useEffect(() => {
    socket.on("user-joined", (user: UserT) => {
      addUserToList(user);
    });
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
