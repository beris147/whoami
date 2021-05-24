// @flow
import type { RoomT } from 'common/types';

export const addUserToRoom = (username: string, room: RoomT): RoomT => {
  return {...room, users: [...room.users, username]};
}

export const removeUserFromRoom = (username: string, room: RoomT): RoomT => {
  return {
    ...room,
    users: room.users.filter(
      (roomUsername: string) => roomUsername !== username
    )
  };
}

export const changeRoomOwner = (username: string, room: RoomT): RoomT => {
  return {...room, owner: username};
}

export const removeRoom = (room: RoomT): null => null;
