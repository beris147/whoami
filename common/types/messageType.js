// @flow
import type { UserT } from './userType';
export type MessageT = {|
  message: string,
  sender: UserT, 
|};