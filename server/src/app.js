// @flow
import express from 'express';
import http from 'http';
import socketIO from 'socket.io';
import * as connection from 'sockets/connection';

import type { RoomSetT } from 'domain/models/RoomModels';
import type { UserSetT } from 'domain/models/UserModels';

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
