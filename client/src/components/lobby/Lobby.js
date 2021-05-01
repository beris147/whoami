//@flow

import React, { useEffect, useContext, useState, useCallback } from "react";
import UserList from "./UserList";
import ReadyForm from "./ReadyForm";
import PlayButton from "./PlayButton";
import SocketContext from "contexts/SocketContext";
import errorCallBack from "utils/errorCallBack";
import { useIsMounted } from "utils/hooks/mounted";

import type { 
  UserInLobbyT,
  UsersInLobbyCallbackT,
  UserIsReadyT,
  UserIsNotReadyT,
} from "common/types";

const Lobby = (): React$Element<any> => {
  const socket = useContext(SocketContext);
  const isMounted = useIsMounted();
  // TODO?: maybe we can change this array to a map, with the username as a key
  // to avoid iterate through the array to update stuff.
  const [userList: Array<UserInLobbyT>, setUserList] = useState([]);

  const updateUserList = useCallback(
    (updatedUserList: Array<UserInLobbyT>) => {
      if(isMounted.current) setUserList(updatedUserList); 
    },
    [isMounted],
  );

  const updateUserInUserList = useCallback(
    (userToUpdate: UserInLobbyT) => {
      const updatedUserList: Array<UserInLobbyT> = 
        userList.map(
          (userInLobby: UserInLobbyT): UserInLobbyT => 
            userInLobby.username === userToUpdate.username
            ? userToUpdate
            : userInLobby
        );
      updateUserList(updatedUserList);
    },
    [userList, updateUserList],
  );

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
  }, [socket]);

  useEffect(() => {
    socket.on("user-joined", (username: string) => {
      const userInLobby: UserIsNotReadyT = {
        username: username,
      };
      const updatedUserList: Array<UserInLobbyT> = [...userList, userInLobby];
      updateUserList(updatedUserList);
    });
    socket.on("user-is-ready", (userIsReady: UserIsReadyT) => {
      updateUserInUserList(userIsReady);
    });
    socket.on("user-is-not-ready", (userIsNotReady: UserIsNotReadyT) => {
      updateUserInUserList(userIsNotReady);
    });
    return () => {
      socket.off("user-joined");
      socket.off("user-is-ready");
      socket.off("user-is-not-ready");
    };
  });

  return (
    <div>
      <ReadyForm />
      <UserList users={userList} />
      <PlayButton />
    </div>
  );
};

export default Lobby;
