// @flow
import React from 'react';
import CreateRoom from 'components/CreateRoom';
import Game from 'components/Game';
import Home from 'components/Home';
import JoinRoom from 'components/JoinRoom';
import Room from 'components/Room';
import { useCreateRoomApp } from '../app/CreateRoomApp';

export const useRoutes = (): {[string]: any} => {
  const createRoomApp = useCreateRoomApp();
  const routes = {
    '/': () => <Home />,
    '/create': () => <CreateRoom app={createRoomApp}/>,
    '/join': () => <JoinRoom />,
    '/join/:id': () => <JoinRoom />,
    '/room/:id': () => <Room />,
    '/game': () => <Game />,
  }
  return routes;
}
