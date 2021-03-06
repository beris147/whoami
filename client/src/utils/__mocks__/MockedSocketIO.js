// @flow

type eventQueueT = { [string]: any };

const CLIENT_EVENTS: eventQueueT = {};
const SERVER_EVENTS: eventQueueT = {};

const push = (queue: eventQueueT, event: string, arg: any) => {
  if (queue[event]) {
    return queue[event].push(arg);
  }
  queue[event] = [arg];
};

const remove = (queue: eventQueueT, event: string) => {
  delete queue[event];
}

const clean = (queue: eventQueueT) => {
  for (var event in queue) delete queue[event];
};

type SocketT = {|
  on: any,
  emit: any,
  has: any,
  off: any,
|};

const createSocket = (
  listenedEvents: eventQueueT,
  emittedEvents: eventQueueT
): SocketT => ({
  on(event: string, func) {
    push(listenedEvents, event, func);
  },
  emit(event: string, ...args: any) {
    if (event in emittedEvents) {
      emittedEvents[event].map((func) => func(...args));
    }
  },
  has(event: string) {
    return listenedEvents[event] ? true : false;
  },
  off(event: string) {
    remove(listenedEvents, event);
  },
});

const clientSocket: SocketT = createSocket(SERVER_EVENTS, CLIENT_EVENTS);
export const serverSocket: SocketT = createSocket(CLIENT_EVENTS, SERVER_EVENTS);

export const io = {
  connect(): SocketT {
    return clientSocket;
  },
};

// cleanup helper
export function cleanSocket() {
  clean(CLIENT_EVENTS);
  clean(SERVER_EVENTS);
}

export default io;
