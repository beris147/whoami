// @flow
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const { v4: uuidv4 } = require('uuid');

import type { RoomT } from './types/roomType';
import type { UserT } from './types/userType';
import type { CallBackT } from './types/callBackType';
import type { JoinRoomT } from './types/joinRoomType';
import type { JoinRequestT } from './types/joinRequestType';
import type { ErrorT } from './types/errorType.js';

const port = process.env.PORT || 9000;
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const rooms: { [string]: RoomT } = {};
const users: { [string]: UserT } = {};

io.on('connection', (socket: any): void => {
  console.log(`New client connected with socket ${socket.id}`);

  socket.on('disconnect', (): void => {
    console.log(`Client ${socket.id} disconnected`);
    try {
      const user = users[socket.id];
      removeUserFromRoom(user);
      removeUser(user);
      if (!rooms[user.roomId].users.length) {
        console.log(`removing room ${user.roomId}`);
        removeRoom(rooms[user.roomId]);
      }
      else emitRoomUpdate(rooms[user.roomId]);
    } catch (error) {
      console.log(error);
    }
  });

  socket.on('create-room', (data: any, callback: CallBackT): void => {
    const newRoom = createRoom(data.username);
    const user = createUser(socket.id, data.username, newRoom.id);
    const { room, error } = joinRoom(socket, newRoom, user);
    if (error) return callback(error);
    socket.emit('joined-room', rooms[room.id]);
  });

  socket.on('join-room', (data: JoinRoomT, callback: CallBackT): void => {
      const user = createUser(socket.id, data.username, data.room.id);
      const { room, error } = joinRoom(socket, data.room, user);
      if (error) return callback(error);
      socket.emit('joined-room', room);
    }
  );
});

const canJoinRoom = (room: RoomT, user: UserT): ?ErrorT => {
  if(!rooms[room.id]) { 
    return { error: `no room with id ${room.id}` };
  }
  if(rooms[room.id].users.includes(user.username)) {
    return { error: `username ${user.username} already in use` };
  }
}

const joinRoom = (
    socket: any,
    room: RoomT,
    user: UserT,
  ): JoinRequestT => {
  const error = canJoinRoom(room, user);
  if(error) return { room, error };
  rooms[room.id].users.push(user.username);
  io.in(room.id).emit('room-update', rooms[room.id]);
  socket.join(room.id);
  console.log(`User ${socket.id} joined room ${room.id}`);
  return { room: rooms[room.id], error: undefined };
}

const removeUserFromRoom = (user: UserT): void => {
  const room = userRoom(user);
  rooms[room.id].users = room.users.filter(name => name != user.username);
}

const userRoom = (user: UserT): RoomT => {
  return rooms[user.roomId];
}

const removeUser = (user: UserT): void => {
  delete users[user.id];
}

const removeRoom = (room: RoomT): void => {
  delete rooms[room.id];
}

const emitRoomUpdate = (room: RoomT) => {
  io.in(room.id).emit('room-update', rooms[room.id]);
}


const createRoom = (owner: string): RoomT => {
  const id = uuidv4();
  return rooms[id] = {
    id,
    users: Array(),
    owner,
    round: 1,
    time: 30,
  };
}

const createUser = (id: string, username: string, roomId: string): UserT => {
  return users[id] = { id, username, roomId };
}
 
const emitError = (socket, error): void  => {
  socket.emit('error', error);
};

app.get('/', (req, res): void => {
    res.send({ response: 'I am alive' }).status(200);
});

process.on('uncaughtException', (err, origin) => {
  console.error(err);
});

server.listen(port, (): void => console.log(`Listening on port ${port}`));