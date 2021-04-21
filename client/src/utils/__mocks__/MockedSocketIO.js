// @flow
const EVENTS: {[string]: any} = {};

function emit(event: string, ...args: any) {
  EVENTS[event].foreach(func => func(...args));
}

const socket = {
  on(event, func) {
    if (EVENTS[event]) {
      return EVENTS[event].push(func);
    }
    EVENTS[event] = [func];
  },
  emit
};

export const io = {
 connect(): any {
  return socket;
 }
};

// emulate server emit
export const serverSocket = { emit };
 
// cleanup helper
export function cleanup() {
  for (let event in EVENTS) {
    if (EVENTS.hasOwnProperty(event)) {
      delete EVENTS[event];
    }
  }
}

export default io;