// @flow
import { test, expect, describe, jest } from '@jest/globals';
import handleOnEnter from 'utils/handleOnEnter';

import '@testing-library/jest-dom';

const mockCallback = jest.fn(x => x + 1);
const enter: KeyboardEvent = new KeyboardEvent('keydown', {'keyCode': 13});
const space: KeyboardEvent = new KeyboardEvent('keydown', {'keyCode': 32}); 

describe('handle on enter function', (): void => {
  test('should call the callback with the keyboard event enter', (): void => {
    handleOnEnter(enter, mockCallback);
    expect(mockCallback).toHaveBeenCalled();
  });
  test('shouldn\'t run the callback with another event', (): void => {
    handleOnEnter(space, mockCallback);
    expect(mockCallback).not.toHaveBeenCalled();
  });
});