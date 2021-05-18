// @flow
import React, { useEffect, useState, useCallback } from 'react';
import handleOnEnter from 'utils/handleOnEnter';

import type { CreateRoomAppT } from '../app/CreateRoomApp';

type CreateRoomPropsT = {
  app?: CreateRoomAppT,
}

function CreateRoom(props: CreateRoomPropsT): React$Element<any> {
  const [username: string, setUsername: mixed] = useState('');
  const [app] = useState(props.app);
  
  const handleCreateRoom = useCallback(() => {
    app?.createRoom(username);
  },[app, username]);

  useEffect(() => {
    app?.subscribeToEvents();
    return () => app?.unsubscribeFromEvents();
  }, [app]);

  return (
    <div>
      <h1>Create Room</h1>
      <div>
        <input 
          type='text' 
          value={username} 
          onChange={e => setUsername(e.target.value)}
          onKeyDown={
            e => {
              if(username !== '') handleOnEnter(e, handleCreateRoom);
            }
          }
        />
        <button onClick={handleCreateRoom} disabled={username === ''}>
          Create Room
        </button>
      </div>
    </div>
  );
}

export default CreateRoom;
