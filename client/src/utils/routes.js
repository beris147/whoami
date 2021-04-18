// @flow
import CreateRoom from '../components/CreateRoom';
import Home from '../components/Home';
import JoinRoom from '../components/JoinRoom';
import Room from '../components/Room';

const routes = {
  '/': Home,
  '/create': CreateRoom,
  '/join': JoinRoom,
  '/join/:id': JoinRoom,
  '/room/:id': Room,
};

export default routes;