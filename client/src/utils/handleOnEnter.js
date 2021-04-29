// @flow
import { ENTER_KEY_CODE } from 'utils/keycodes';

const handleOnEnter = (e: KeyboardEvent, func: () => void): void => {
  if(e.keyCode === ENTER_KEY_CODE) func();
}

export default handleOnEnter;