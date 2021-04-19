// @flow
import type { ErrorCallBackT, ErrorT } from 'common/types';

const errorCallBack: ErrorCallBackT = (error: ?ErrorT): void => {
  if(error) {
    console.log(error);
  }
}

export default errorCallBack;