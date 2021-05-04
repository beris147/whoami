//@flow

import React, { useContext, useEffect } from 'react';
import SocketContext from 'contexts/SocketContext';
import errorCallBack from "utils/errorCallBack";

type PlayButtonT = {
  disabled: bool,
}

const PlayButton = (props: PlayButtonT): React$Element<any> => {
  const socket = useContext(SocketContext);
  useEffect(() => {
    socket.on('game-started', () => {
      console.log('this should start the game');
    })
    return () => {
      socket.off('game-started');
    }
  }, [socket]);
  const handlePlayGame = () => {
    socket.emit('start-game', errorCallBack);
  }
  return (
    <button onClick={handlePlayGame} disabled={props.disabled}>Play</button>
  );
};

export default PlayButton;
