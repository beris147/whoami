// @flow
import React, { useContext, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import SocketContext from '../contexts/SocketContext';
import errorCallBack from '../utils/errorCallBack';

import type { JoinRoomRequestT, RoomT } from 'common/types';

function JoinRoom(): React$Element<any> {
  const socket = useContext(SocketContext);
  const history = useHistory();
  const { id } = useParams();
  const [username: string, setUsername: mixed] = useState('');
  const [roomId: string, setRoomId: mixed] = useState('');

  const handleJoinRoom: mixed = (): void => {
    const data: JoinRoomRequestT = { username, roomId };
    socket.emit('join-room', data, errorCallBack);
  }

  useEffect((): void => {
    if(id) setRoomId(id);
  }, [id]);

  useEffect((): void => {
    socket.on('joined-room', (data: RoomT): void => {
      history.push(`/room/${data.id}`);
    });
  }, [socket, history]);

  return (
    <div>
      <h1>Join Room</h1>
      <div>
        <input 
          type='text' 
          placeholder='User Name'
          value={username}
          onChange={e => setUsername(e.target.value)}
        /><br/>
        <input 
          type='text'
          placeholder='Room id'
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        /><br/>
        <button onClick={handleJoinRoom} disabled={username===''||roomId===''}>
          Join Room
        </button>
      </div>
    </div>
  );
}

export default JoinRoom;