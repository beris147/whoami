// @flow
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const connection = require('./sockets/connection');

import type { UserSetT } from './types/userSetType';
import type { RoomSetT } from './types/roomSetType';

const app = express();
const port = process.env.PORT || 9000;
const server = http.createServer(app);
const io = socketIO(server);

const users: UserSetT = {};
const rooms: RoomSetT = {};

connection.connect(io, rooms, users);

app.get('/', (req, res): void => {
    res.send({ response: 'I am alive' }).status(200);
});

process.on('uncaughtException', (err, origin) => {
  console.error(err);
});

server.listen(port, (): void => console.log(`Listening on port ${port}`));