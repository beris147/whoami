// @flow
import React, { useState } from 'react';
import handleOnEnter from 'utils/handleOnEnter';
import { useCreateRoomApp } from 'app/CreateRoomApp';
import { useJoinRoomApp } from 'app/JoinRoomApp';

function CreateRoom(): React$Element<any> {
  const [username: string, setUsername: mixed] = useState('');
  const app = useCreateRoomApp(); useJoinRoomApp();
  const handleCreateRoom = () => {
    app.createRoomRequest(username);
  }
  return (
    <div>
      <h1>Create Room</h1>
      <div>
        <input 
          type='text' 
          value={username} 
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={
            (e) => {
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
