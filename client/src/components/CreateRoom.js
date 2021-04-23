// @flow
import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import SocketContext from 'contexts/SocketContext';
import UserContext from 'contexts/UserContext';
import errorCallBack from 'utils/errorCallBack';

import type { CreateRoomRequestT, RoomT, UserT } from 'common/types';

function CreateRoom(): React$Element<any> {
  const history: any = useHistory();
  const socket: any = useContext(SocketContext);
  const { user, setUser } = useContext(UserContext);
  const [username: string, setUsername: mixed] = useState('');

  const handleCreateRoom: mixed = (): void => {
    const data: CreateRoomRequestT = { username };
    socket.emit('create-room', data, errorCallBack);
  }

  useEffect((): any => {
    socket.on('joined-room', (room: RoomT): void => {
      setUser({ username, roomId: room.id});
      history.push(`/room/${room.id}`);
    });

    return function cleanup() {
      socket.off('joined-room');
    };
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
