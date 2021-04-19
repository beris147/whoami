// @flow
import React from 'react';
import routes from './utils/routes';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import SocketProvider from './providers/SocketProvider';
import UserProvider from './providers/UserProvider';


function TemporalLinkLi() {
  return (
    <ul>
      <li><Link to="/">Home</Link></li>
      <li><Link to="/create">Create new room</Link></li>
      <li><Link to="/join">Join room</Link></li>
    </ul>
  );
}

function MySwitch() {
  return (
    <Switch>
      {
        Object.keys(routes).map(
          path => (
            <Route exact path={path} component={routes[path]} key={path} />
          )
        )
      }
    </Switch>
  );
}

function App(): React$Element<any> {
  return (
    <UserProvider>
      <SocketProvider>
        <Router>
          <TemporalLinkLi />
          <MySwitch />
        </Router>
      </SocketProvider>
    </UserProvider>
  );
}

export default App;
