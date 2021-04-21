// @flow
import React from 'react';
import routes from 'utils/routes';
import { Switch, Route, Link } from 'react-router-dom';


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
    <>
      <TemporalLinkLi />
      <MySwitch />
    </>
  );
}

export default App;
