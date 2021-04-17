import React from 'react';
import { useParams } from 'react-router-dom';

import './JoinRoom.css';

function JoinRoom(props) {
  const { id } = useParams();
  return (id) ? <h1>Joining room {id}</h1> : <h1>Join Room</h1>;
}

export default JoinRoom;