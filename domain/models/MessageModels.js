// @flow
import type { UserT } from './UserModels';

export type MessageT = {
  message: string,
  sender: UserT,
};

export type MessageListT = Array<MessageT>;
