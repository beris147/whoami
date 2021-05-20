//@flow

import React from 'react';

import type { UsersInLobbyListT } from 'domain/models/LobbyDomainModels';
type PlayButtonT = {
  userList: ?UsersInLobbyListT,
  disabled: bool,
}

const PlayButton = (props: PlayButtonT): React$Element<any> => { 
  const handlePlayGame = () => {
  }
  return (
    <button onClick={handlePlayGame} disabled={props.disabled}>Play</button>
  );
};

export default PlayButton;
