// @flow

const handleOnEnter = (e: KeyboardEvent, func: () => void): void => {
  if(e.keyCode === 13) func();
}

export default handleOnEnter;