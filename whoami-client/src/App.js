import React from 'react';
import CreateRoom from './components/CreateRoom';
import Home from './components/Home';
import JoinRoom from './components/JoinRoom';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/create">Create new room</Link></li>
          <li><Link to="/join">Join room</Link></li>
        </ul>
        <Switch>
          <Route exact path="/"><Home /></Route>
          <Route path="/create"><CreateRoom /></Route>
          <Route path="/join"><JoinRoom /></Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
