// @flow
import React from 'react';
import PageNotFound from 'components/PageNotFound';
import { Switch, Route, Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { useRoutes } from 'utils/routes';
import 'react-toastify/dist/ReactToastify.css';

function TemporalLinkLi() {
  return (
    <ul>
      <li><Link to="/">Home</Link></li>
      <li><Link to="/create">Create new room</Link></li>
      <li><Link to="/join">Join room</Link></li>
    </ul>
  );
}

function App(): React$Element<any> {
  const routes = useRoutes();
  return (
    <>
      <TemporalLinkLi />
      <Switch>
        {
          Object.keys(routes).map(
            path => (
              <Route exact
                path={path} 
                component={routes[path]}
                key={path}
              />
            )
          )
        }
        <Route component={PageNotFound} />
      </Switch>
      <ToastContainer 
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
      />
    </>
  );
}

export default App;
