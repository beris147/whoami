// @flow
import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import SocketContext from '../contexts/SocketContext';


function CreateRoom(): React$Element<any> {
  const history = useHistory();
  const socket = useContext(SocketContext);
  const [username, setUsername] = useState('');

  const handleCreateRoom = (): void => {
    socket.emit('create-room', {username}, error => {
      if(error) {
        console.log(error);
      } 
    });
  }

  useEffect((): void => {
    socket.on('joined-room', data => {
      history.push(`/room/${data.id}`);
    });

    socket.on('error', data => {
      console.log(data);
    });
  }, [socket, history]);

  return (
    <div>
      <h1>Create Room</h1>
      <div>
        <input 
          type='text' 
          value={username} 
          onChange={e => setUsername(e.target.value)}
        />
        <button onClick={handleCreateRoom} disabled={username === ''}>
          Create Room
        </button>
      </div>
    </div>
  );
}

export default CreateRoom;
