//@flow

import React, { useState } from 'react';
import UserList from './UserList';
import ReadyForm from './ReadyForm';
import PlayButton from './PlayButton';
import DisplayError from 'components/Error/DisplayError';
import { useLobbyApp } from 'app/Lobby/LobbyApp';

const Lobby = (): React$Element<any> => {
  const [isPlayable: bool] = useState(false);
  const app = useLobbyApp();
  if(!app) return <DisplayError error='room or user is undefined'/>;
  const handleLeaveRoom = () => {
    app.leaveRoom();
  }
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