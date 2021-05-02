// @flow
import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import RoomContext from 'contexts/RoomContext';
import SocketContext from 'contexts/SocketContext';
import UserContext from 'contexts/UserContext';
import errorCallBack from 'utils/errorCallBack';
import { toast } from 'react-toastify';
import handleOnEnter from 'utils/handleOnEnter';

import type { CreateRoomRequestT, RoomT } from 'common/types';

function CreateRoom(): React$Element<any> {
  const history: any = useHistory();
  const socket: any = useContext(SocketContext);
  const { setRoom } = useContext(RoomContext);
  const { setUser } = useContext(UserContext);
  const [username: string, setUsername: mixed] = useState('');

  const handleCreateRoom = (): void => {
    const data: CreateRoomRequestT = { username };
    socket.emit('create-room', data, errorCallBack);
  }

  useEffect((): any => {
    socket.on('joined-room', (room: RoomT): void => {
      toast.success('Room created!');
      setRoom(room);
      setUser({ username, roomId: room.id, id: socket.id });
      history.push(`/room/${room.id}`);
    });

    return function cleanup() {
      socket.off('joined-room');
    };
  }, [history, setUser, socket, username]);

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
