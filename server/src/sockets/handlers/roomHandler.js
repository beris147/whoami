// @flow
const { createRoom, removeRoom, emitRoomUpdate, joinRoom } = require('utils/roomUtils');
const { createUser, removeUserFromRoom, removeUser } = require('utils/userUtils');

import type { CallBackT } from 'types/callBackType';
import type { JoinRoomT } from 'types/joinRoomType';
import type { RoomT } from 'types/roomType';
import type { RoomSetT } from 'types/roomSetType';
import type { UserSetT } from 'types/userSetType';

module.exports = (
    io: Object, 
    socket: Object,
    rooms: RoomSetT,
    users: UserSetT,
) => {
    const createRoomHandler = (data: any, callback: CallBackT): void => {
        const newRoom = createRoom(data.username, rooms);
        const user = createUser(socket.id, data.username, newRoom.id, users);
        const { room, error } = joinRoom(socket, newRoom, user, io, rooms);
        if (error) return callback(error);
        socket.emit('joined-room', rooms[room.id]);
    }

    const joinRoomHandler =  (data: JoinRoomT, callback: CallBackT): void => {
        const user = createUser(socket.id, data.username, data.room.id, users);
        const { room, error } = joinRoom(socket, data.room, user, io, rooms);
        if (error) return callback(error);
        socket.emit('joined-room', room);
    }

    socket.on('create-room', createRoomHandler);
    socket.on('join-room', joinRoomHandler);
}