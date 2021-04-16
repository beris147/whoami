const express = require('express');

const http = require('http');

const socketIO = require('socket.io');

const {
  v4: uuidv4
} = require('uuid');

const RoomT1 = require('./types/roomtype.js');

const port = process.env.PORT || 9000;
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const aux = typeof RoomT1;
var obj = {
  id: 2139812
};
console.log(typeof obj === typeof RoomT1);
const rooms = {};
const users = {};
io.on('connection', socket => {
  console.log(`New client connected with socket ${socket.id}`);
  socket.on('disconnect', () => {
    console.log(`Client ${socket.id} disconnected`);

    try {
      const user = users[socket.id];
      removeUserFromRoom(user);
      removeUser(user);

      if (!rooms[user.roomId].users.length) {
        console.log(`removing room ${user.roomId}`);
        removeRoom(rooms[user.roomId]);
      } else emitRoomUpdate(rooms[user.roomId]);
    } catch (error) {
      console.log(error);
    }
  });
  socket.on('create-room', (data, callback) => {
    const newRoom = createRoom(data.username);
    const user = createUser(socket.id, data.username, newRoom.id);
    const {
      room,
      error
    } = joinRoom(socket, newRoom, user);
    if (error) return callback(error);
    socket.emit('joined-room', rooms[room.id]);
  });
  socket.on('join-room', (data, callback) => {
    const user = createUser(socket.id, data.username, data.room.id);
    const {
      room,
      error
    } = joinRoom(socket, data.room, user);
    if (error) return callback(error);
    socket.emit('joined-room', room);
  });
});

const canJoinRoom = (room, user) => {
  if (!rooms[room.id]) {
    return {
      error: `no room with id ${room.id}`
    };
  }

  if (rooms[room.id].users.includes(user.username)) {
    return {
      error: `username ${user.username} already in use`
    };
  }
};

const joinRoom = (socket, room, user) => {
  const error = canJoinRoom(room, user);
  if (error) return {
    room,
    error
  };
  rooms[room.id].users.push(user.username);
  io.in(room.id).emit('room-update', rooms[room.id]);
  socket.join(room.id);
  console.log(`User ${socket.id} joined room ${room.id}`);
  return {
    room: rooms[room.id],
    error: undefined
  };
};

const removeUserFromRoom = user => {
  const room = userRoom(user);
  rooms[room.id].users = room.users.filter(name => name != user.username);
};

const userRoom = user => {
  return rooms[user.roomId];
};

const removeUser = user => {
  delete users[user.id];
};

const removeRoom = room => {
  delete rooms[room.id];
};

const emitRoomUpdate = room => {
  io.in(room.id).emit('room-update', rooms[room.id]);
};

const createRoom = owner => {
  const id = uuidv4();
  return rooms[id] = {
    id,
    users: Array(),
    owner,
    round: 1,
    time: 30
  };
};

const createUser = (id, username, roomId) => {
  return users[id] = {
    id,
    username,
    roomId
  };
};

const emitError = (socket, error) => {
  socket.emit('error', error);
};

app.get('/', (req, res) => {
  res.send({
    response: 'I am alive'
  }).status(200);
});
process.on('uncaughtException', (err, origin) => {
  console.error(err);
});
server.listen(port, () => console.log(`Listening on port ${port}`));