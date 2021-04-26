// @flow

type eventQueueT = {[string]: any}

let EVENTS: eventQueueT = {};
let EMITTED: eventQueueT = {};

const push = (queue: eventQueueT, event: string, arg: any) => {
    if (queue[event]) {
      return queue[event].push(arg);
    }
    queue[event] = [arg];
};

function emit(event: string, ...args: any) {
  EVENTS[event].map(func => func(...args));
}

const socket = {
  on(event: string, func) {
    push(EVENTS, event, func);
  },
  emit(event: string, data: any) {
    push(EMITTED, event, data);
  },
  has(event: string) {
    return (EVENTS[event]) ? true : false;
  },
  hasEmitted(event: string) {
    return (EMITTED[event]) ? true : false;
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