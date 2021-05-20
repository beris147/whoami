//@flow

import React, { useEffect, useState } from "react";
import UserList from "./UserList";
import ReadyForm from "./ReadyForm";
import PlayButton from "./PlayButton";
import DisplayError from 'components/Error/DisplayError';
import { useLobbyApp } from 'app/Lobby/LobbyApp';

const Lobby = (): React$Element<any> => {
  const [isPlayable: bool] = useState(false);
  const app = useLobbyApp();
  const handleLeaveRoom = () => {
    app?.leaveRoom();
  }
  useEffect(() => {
    app?.subscribeToEvents();
    app?.getUsers();
    return () => app?.unsubscribeFromEvents();
  }, [app]);
  if(!app) return <DisplayError error='room or user is undefined'/>;
  return (
    <div>
      <button onClick={handleLeaveRoom}>
        Leave
      </button>
      <ReadyForm />
      <UserList userList={app.userList} />
      {
        app.amIOwner && 
        <PlayButton userList={app.userList} disabled={!isPlayable}/>
      }
    </div>
  );
}

export default Lobby;