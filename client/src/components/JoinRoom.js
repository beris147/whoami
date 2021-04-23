// @flow
import React, { useContext, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import SocketContext from 'contexts/SocketContext';
import UserContext from 'contexts/UserContext';
import errorCallBack from 'utils/errorCallBack';
import { toast } from 'react-toastify';

import type { JoinRoomRequestT, RoomT } from 'common/types';

function JoinRoom(): React$Element<any> {
  const { id } = useParams();
  const history = useHistory();
  const socket = useContext(SocketContext);
  const { user, setUser } = useContext(UserContext);
  const [username: string, setUsername: mixed] = useState('');
  const [roomId: string, setRoomId: mixed] = useState('');

  const handleJoinRoom: mixed = (): void => {
    const data: JoinRoomRequestT = { username, roomId };
    socket.emit('join-room', data, errorCallBack);
  }

  useEffect((): void => {
    if(id) setRoomId(id);
  }, [id]);

  useEffect((): any => {
    socket.on('joined-room', (room: RoomT): void => {
      toast.success('Hey you joined!');
      setUser({ username, roomId: room });
      history.push(`/room/${room.id}`);
    });

    return function cleanup() {
      socket.off('joined-room');
    };
  }, [socket, history]);

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
        /><br/>
        <input 
          type='text'
          data-testid="roomid"
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