// @flow
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import GameProvider from 'providers/GameProvider';
import RoomProvider from 'providers/RoomProvider';
import SocketProvider from 'providers/SocketProvider';
import UserProvider from 'providers/UserProvider';
import './index.css';
import App from './App';
import reportWebVitals from './vitals/reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <RoomProvider>
      <UserProvider>
        <SocketProvider>
          <GameProvider>
            <Router>
              <App />
            </Router>
          </GameProvider>
        </SocketProvider>
      </UserProvider>
    </RoomProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
