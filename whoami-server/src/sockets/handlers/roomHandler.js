// @flow
const roomUtils = require('../../utils/roomUtils');
const userUtils = require('../../utils/userUtils');

import type { CallBackT } from '../../types/callBackType';
import type { JoinRoomT } from '../../types/joinRoomType';
import type { RoomT } from '../../types/roomType';

const { createRoom, removeRoom, emitRoomUpdate, joinRoom, rooms } = roomUtils;
const { createUser, removeUserFromRoom, removeUser } = userUtils;


module.exports = (
        io: Object, 
        socket: Object,
) => {
    const createRoomHandler = (data: any, callback: CallBackT): void => {
        const newRoom = createRoom(data.username);
        const user = createUser(socket.id, data.username, newRoom.id);
        const { room, error } = joinRoom(socket, newRoom, user, io);
        if (error) return callback(error);
        socket.emit('joined-room', rooms[room.id]);
    }

    const joinRoomHandler =  (data: JoinRoomT, callback: CallBackT): void => {
        const user = createUser(socket.id, data.username, data.room.id);
        const { room, error } = joinRoom(socket, data.room, user, io);
        if (error) return callback(error);
        socket.emit('joined-room', room);
    }

    socket.on('create-room', createRoomHandler);
    socket.on('join-room', joinRoomHandler);
}