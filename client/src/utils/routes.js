// @flow
import CreateRoom from 'components/CreateRoom';
import Game from 'components/Game';
import Home from 'components/Home';
import JoinRoom from 'components/JoinRoom';
import Room from 'components/Room';

export const useRoutes = (): {[string]: any} => {
  const routes = {
    '/': Home,
    '/create': CreateRoom,
    '/join': JoinRoom,
    '/join/:id': JoinRoom,
    '/room/:id': Room,
    '/game': Game,
  }
  return routes;
}
