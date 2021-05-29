// @flow
import type { ErrorCallbackT, ErrorT } from 'domain/models/ErrorModels';
import { toast } from 'react-toastify';

const errorCallBack: ErrorCallbackT = (error: ?ErrorT): void => {
  if (error) {
    toast.error(error);
  }
};

export default errorCallBack;
