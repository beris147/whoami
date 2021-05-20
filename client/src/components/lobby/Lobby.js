//@flow

import React, { useEffect, useState } from "react";
import UserList from "./UserList";
import ReadyForm from "./ReadyForm";
import PlayButton from "./PlayButton";

import type { LobbyAppT } from 'app/Lobby/LobbyApp';
type LobbyPropsT = {
  app?: ?LobbyAppT,
}

const Lobby = (props: LobbyPropsT): React$Element<any> => {
  const [isPlayable: bool] = useState(false);
  const [app] = useState(props.app);
  const handleLeaveRoom = () => {
    app?.leaveRoom();
  }
  useEffect(() => {
    app?.subscribeToEvents();
    app?.getUsers();
    return () => app?.unsubscribeFromEvents();
  }, [app]);
  return (
    <div>
      <button onClick={handleLeaveRoom}>
        Leave
      </button>
      <ReadyForm />
      <UserList userList={app?.userList} />
      {
        app?.amIOwner && 
        <PlayButton userList={app?.userList} disabled={!isPlayable}/>
      }
    </div>
  );
}

export default Lobby;