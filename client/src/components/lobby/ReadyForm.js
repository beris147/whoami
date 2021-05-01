//@flow

import React, { useState, useContext } from 'react';
import handleOnEnter from 'utils/handleOnEnter';
import SocketContext from 'contexts/SocketContext';
import errorCallBack from 'utils/errorCallBack';

const ReadyForm = (): React$Element<any> => {
  const socket = useContext(SocketContext);
  const [character: string, setCharacter: (c: string) => void] = useState('');
  const [isReady: boolean, setReady] = useState(false);

  const handleReady = (): void => {
    socket.emit('set-ready-lobby', character, errorCallBack);
    setReady(true);
  }

  const handleChange = (): void => {
    setReady(false);
  }

  return (
    <div>
      <input 
        type='text' 
        value={character} 
        onChange={e => setCharacter(e.target.value)}
        disabled={isReady}
        onKeyDown={
          e => {
            if(character !== '') handleOnEnter(e, handleReady);
          }
        }
      />
      {
        isReady
        ? (
          <button onClick={handleChange}>
            Change
          </button>
        )
        : (
          <button disabled={character === ''} onClick={handleReady}>
            Ready
          </button>
        )
      }
    </div>
  );
};

export default ReadyForm;
