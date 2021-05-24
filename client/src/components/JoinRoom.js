// @flow
import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import handleOnEnter from 'utils/handleOnEnter';
import { useJoinRoomApp } from 'app/JoinRoomApp';

function JoinRoom(): React$Element<any> {
  const { id } = useParams();
  const [username: string, setUsername ] = useState('');
  const [roomId: string, setRoomId ] = useState('');
  const app = useJoinRoomApp();

  const handleJoinRoom = useCallback(() => {
    app.joinRoomRequest(username, roomId);
  }, [app, roomId, username]);

  useEffect((): any => {
    if(id) setRoomId(id);
  }, [id]);

  useEffect((): any => {
    app.subscribeToEvents();
    return () => app.unsubscribeFromEvents();
  }, [app]);

  return (
    <div>
      <h1>Join Room</h1>
      <div>
        <input 
          type='text' 
          data-testid="username"
          placeholder='User Name'
          value={username}
          onChange={e => setUsername(e.target.value)}
          onKeyDown={
            e => {
              if(username !== '' && roomId!=='') 
                handleOnEnter(e, handleJoinRoom);
            }
          }
        /><br/>
        <input 
          type='text'
          data-testid="roomid"
          placeholder='Room id'
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
          onKeyDown={
            e => {
              if(username !== '' && roomId!=='') 
                handleOnEnter(e, handleJoinRoom);
            }
          }
        /><br/>
        <button onClick={handleJoinRoom} disabled={username===''||roomId===''}>
          Join Room
        </button>
      </div>
    </div>
  );
}

export default JoinRoom;