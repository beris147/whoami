// @flow
import React from 'react';
import { MemoryRouter, Route, Router } from 'react-router-dom';

type MockRouterT = {
  children: React$Element<any>,
  initialEntries?: [string],
  path: string,
  history?: any,
};

function MockRouter(props: MockRouterT): React$Element<any>{
  if(props.history) {
    return (
      <Router history={props.history}>
        <Route path={props.path}>
          {props.children}
        </Route>
      </Router>
    );
  }
  return (
    <MemoryRouter initialEntries={props.initialEntries}>
      <Route path={props.path}>
        {props.children}
      </Route>
    </MemoryRouter>
  );
}

export default MockRouter;