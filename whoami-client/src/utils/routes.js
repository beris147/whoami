import React from 'react';
import CreateRoom from '../components/CreateRoom';
import Home from '../components/Home';
import JoinRoom from '../components/JoinRoom';

const routes = {
  '/': Home,
  '/create': CreateRoom,
  '/join': JoinRoom,
  '/join/:id': JoinRoom,
};

export default routes;