// @flow
import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import SocketContext from '../contexts/SocketContext';
import errorCallBack from '../utils/errorCallBack'

import type { CreateRoomT, RoomT } from 'common/types';

function CreateRoom(): React$Element<any> {
  const history: any = useHistory();
  const socket: any = useContext(SocketContext);
  const [username: string, setUsername: mixed] = useState('');

  const handleCreateRoom: mixed = (): void => {
    const data: CreateRoomT = { username };
    socket.emit('create-room', data, errorCallBack);
  }

  useEffect((): void => {
    socket.on('joined-room', (data: RoomT): void => {
      history.push(`/room/${data.id}`);
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
