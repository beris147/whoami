// @flow
import React from 'react';

type MockProviderT = {|
  context: React$Context<any>,
  children: any,
  value: any,
|};

const MockedProvider = (props: MockProviderT): React$Element<any> => {
  return (
    <props.context.Provider value={props.value}>
      {props.children}
    </props.context.Provider>
  );
}

export default MockedProvider;