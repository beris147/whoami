import React, { useContext, useEffect } from 'react';
import SocketContext from '../contexts/SocketContext';

import './CreateRoom.css';

function CreateRoom() {
  const socket = useContext(SocketContext);
  useEffect(() => {
    const data = { username: 'Edgar' };
    
    socket.emit('create-room', data, error => {
      if(error) {
        console.log(error);
      } 
    });

    socket.on('joined-room', data => {
      console.log(data);
    });

    socket.on('room-update', data => {
      console.log('room updated + ', data);
    });
    
  }, []);

  return <h1>Create Room</h1>;
}

export default CreateRoom;
