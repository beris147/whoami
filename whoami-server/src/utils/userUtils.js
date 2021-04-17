// @flow
import type { RoomT } from '../types/roomType';
import type { RoomSetT } from '../types/roomSetType';
import type { UserT } from '../types/userType';
import type { UserSetT } from '../types/userSetType';

const createUser = (
    id: string, 
    username: string, 
    roomId: string,
    users: UserSetT,
): UserT => {
  return users[id] = { id, username, roomId };
}

const removeUserFromRoom = (user: UserT, rooms: RoomSetT): void => {
  const room = userRoom(user, rooms);
  rooms[room.id].users = room.users.filter(name => name != user.username);
}

const userRoom = (user: UserT, rooms: RoomSetT): RoomT => {
  return rooms[user.roomId];
}

const removeUser = (user: UserT, users: UserSetT): void => {
  delete users[user.id];
}


module.exports = {
    createUser,
    removeUser,
    removeUserFromRoom,
    userRoom,
};