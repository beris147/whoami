//@flow

import React, { useEffect, useContext, useState, useRef } from "react";
import type { UserInLobbyT } from "common/types";
import UserList from "./UserList";
import ReadyButton from "./ReadyButton";
import PlayButton from "./PlayButton";
import SocketContext from "contexts/SocketContext";
import errorCallBack from "utils/errorCallBack";

export type LobbyPropsT = {|
  roomId: string,
|};

const Lobby = (props: LobbyPropsT): React$Element<any> => {
  const socket = useContext(SocketContext);
  const [userList: Array<UserInLobbyT>, setUserList] = useState([]);
  useEffect(() => {
    socket.emit("get-users-in-lobby", errorCallBack, (users)=>{
      setUserList(users);
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
      return ()=>{
        socket.off("user-joined");
      }
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
