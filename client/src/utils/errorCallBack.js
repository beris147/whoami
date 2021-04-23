// @flow
import type { ErrorCallBackT, ErrorT } from 'common/types';
import { toast } from 'react-toastify';

const errorCallBack: ErrorCallBackT = (error: ?ErrorT): void => {
  if(error) {
    toast.error(error.error);
  }
}

export default errorCallBack;