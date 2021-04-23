// @flow
let EVENTS: {[string]: any} = {};

function emit(event: string, ...args: any) {
  EVENTS[event].map(func => func(...args));
}

const socket = {
  on(event: string, func) {
    if (EVENTS[event]) {
      return EVENTS[event].push(func);
    }
    EVENTS[event] = [func];
  },
  emit,
  has(event: string) {
    return (EVENTS[event]) ? true : false;
  },
  off(event: string) {
    // with tests we need to check if the event was called, so we do not 
    // remove the event with this mock of socketio
    return;
  } 
};

export const io = {
 connect(): any {
  return socket;
 }
};

// emulate server emit
export const serverSocket = { emit };
 
// cleanup helper
export function cleanSocket() {
  EVENTS = {};
}

export default io;