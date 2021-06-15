//@flow

import React from 'react';
import UserList from './UserList';
import ReadyForm from './ReadyForm';
import DisplayError from 'components/Error/DisplayError';
import { useLobbyApp } from 'app/Lobby/LobbyApp';

const Lobby = (): React$Element<any> => {
  const app = useLobbyApp();
  if (!app) return <DisplayError error='room or user is undefined' />;
  const handlePlayGame = () => app.playGameRequest();
  return (
    <div>
      <ReadyForm />
      <UserList userList={app.userList} roomOwner={app.roomOwner} />
      {app.amIOwner && (
        <button disabled={!app.isPlayable} onClick={handlePlayGame}>
          Play
        </button>
      )}
    </div>
  );
};

export default Lobby;
