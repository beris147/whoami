// @flow
import React from 'react';
import CreateRoom from 'components/CreateRoom';
import Game from 'components/Game';
import Home from 'components/Home';
import JoinRoom from 'components/JoinRoom';
import Room from 'components/Room';
import { useCreateRoomApp } from 'app/CreateRoomApp';
import { useJoinRoomApp } from 'app/JoinRoomApp';

export const useRoutes = (): {[string]: any} => {
  const createRoomApp = useCreateRoomApp();
  const joinRoomApp = useJoinRoomApp();
  const routes = {
    '/': () => <Home />,
    '/create': () => <CreateRoom app={createRoomApp}/>,
    '/join': () => <JoinRoom app={joinRoomApp}/>,
    '/join/:id': () => <JoinRoom app={joinRoomApp}/>,
    '/room/:id': () => <Room />,
    '/game': () => <Game />,
  }
  return routes;
}
