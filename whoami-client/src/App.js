import React, { useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client';
import logo from './logo.svg';
import './App.css';

const ENDPOINT = 'http://localhost:9000';

function App() {

  const [response, setResponse] = useState('');

  useEffect(() => {
    const socket = socketIOClient(ENDPOINT, {transports: ['websocket']});

    const data = { username: 'Edgar' };

    socket.emit('create-room', data, error => {
      if(error) {
        console.log(error);
      } else {
        console.log('room created');
      }
      setResponse('room created');
    });

    socket.on('joined-room', data => {
      console.log(data);
    });

    socket.on('room-update', data => {
      console.log('room updated + ', data);
    });
  }, []);

  return (
    <div className='App'>
      <header className='App-header'>
        <img src={logo} className='App-logo' alt='logo' />
        <p>{JSON.stringify(response)}</p>
      </header>
    </div>
  );
}

export default App;
