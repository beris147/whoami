//@flow

import React, { useEffect, useContext, useState, useRef } from "react";
import type { UserInLobbyT, UsersInLobbyCallbackT } from "common/types";
import UserList from "./UserList";
import ReadyButton from "./ReadyButton";
import PlayButton from "./PlayButton";
import SocketContext from "contexts/SocketContext";
import errorCallBack from "utils/errorCallBack";

const Lobby = (): React$Element<any> => {
  const socket = useContext(SocketContext);
  const [userList: Array<UserInLobbyT>, setUserList] = useState([]);

  useEffect(() => {
    socket.on("get-users-in-lobby", (callback: UsersInLobbyCallbackT) => {
      callback(userList);
    });
    return () => {
      socket.off("get-users-in-lobby");
    };
  });

  useEffect(() => {
    socket.emit("get-users-in-lobby", errorCallBack, (users) => {
      setUserList(users);
      socket.emit("user-joined");
    });
  }, []);

  const firstUpdate = useRef(true);
  useEffect(() => {
    if (!firstUpdate.current) {
      socket.on("user-joined", (username: string) => {
        const userInLobby: UserInLobbyT = {
          username: username,
          state: "Waiting",
        };
        const updatedUserList: Array<UserInLobbyT> = [...userList, userInLobby];
        setUserList(updatedUserList);
      });
      return () => {
        socket.off("user-joined");
      };
    }
    firstUpdate.current = false;
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
