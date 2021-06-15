// @flow
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

type DisplayErrorPropsT = {
  error: string,
  redirectTo?: string,
};

function DisplayError(props: DisplayErrorPropsT): React$Element<any> {
  const history = useHistory();
  useEffect(() => {
    if (props.redirectTo) history.push(props.redirectTo);
  }, [history, props.redirectTo]);
  return <p>{props.error}</p>;
}
export default DisplayError;
