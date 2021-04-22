// @flow
import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';

type MockRouterT = {
  ui: React$Element<any>,
  initialEntries: [string],
  path: string,
};

function MockRouter(props: MockRouterT): React$Element<any>{
  return (
    <MemoryRouter initialEntries={props.initialEntries}>
      <Route path={props.path}>
        {props.ui}
      </Route>
    </MemoryRouter>
  );
}

export default MockRouter;