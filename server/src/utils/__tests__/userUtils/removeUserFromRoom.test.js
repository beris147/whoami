// @flow
const { describe, it, expect, beforeEach } = require("@jest/globals");
const { removeUserFromRoom } = require("utils/userUtils");

import type { RoomT, RoomSetT, UserT, UserSetT, ErrorT } from "common/types";

const user: UserT = {
  id: "user-id",
  username: "user-username",
  roomId: "room-id",
};

const roomTemplate: RoomT = {
  id: user.roomId,
  owner: "owner-id",
  users: ["username-1", "username-2", "username-3"],
};

describe("When removing a user from a room", () => {
  describe("Given a user whose room exists and their username appears in the room's list", () => {
    it("Removes the username from the room user list", () => {
      const room: RoomT = {
        ...roomTemplate,
        users: [...roomTemplate.users, user.username],
      };
      const rooms: RoomSetT = {
        [room.id]: room,
      };

      removeUserFromRoom(user, rooms);
      expect(rooms[user.roomId]).toStrictEqual(roomTemplate);
    });
  });
  describe("Given a user whose room exists and their username is the only one in the room's list", () => {
    it("Deletes the room", () => {
      const room: RoomT = {
        ...roomTemplate,
        users: [user.username],
      };
      const rooms: RoomSetT = {
        [room.id]: room,
      };
      removeUserFromRoom(user, rooms);
      expect(rooms[room.id]).toBeUndefined();
    });
  });
  describe("Given a user whose room exists and owns it", () => {
    const room: RoomT = {
      ...roomTemplate,
      owner: user.username,
      users: [...roomTemplate.users, user.username],
    };
    const rooms: RoomSetT = {
      [room.id]: room,
    };
    beforeEach(() => {
      rooms[room.id] = room;
    });
    it("Transfers ownership to first user", () => {
      removeUserFromRoom(user, rooms);
      expect(rooms[room.id].owner).toStrictEqual("username-1");
    });
    it("Removes the new owner from the list", () => {
      removeUserFromRoom(user, rooms);
      expect(rooms[room.id].owner).toStrictEqual("username-1");
      expect(rooms[room.id].users).toStrictEqual(roomTemplate.users);
      const newOwner: UserT = {
        id: "new-owner-id",
        roomId: room.id,
        username: rooms[room.id].owner,
      };
      removeUserFromRoom(newOwner, rooms);
      expect(rooms[room.id].users).toStrictEqual(["username-2", "username-3"]);
    });
  });
  describe("Given a user whose room exists and their username doesn't appear in the room's list", () => {
    it("Does nothing", () => {
      const room: RoomT = roomTemplate;
      const rooms: RoomSetT = {
        [room.id]: room,
      };

      removeUserFromRoom(user, rooms);
      expect(rooms[user.roomId]).toStrictEqual(room);
    });
  });
  describe("Given a user whose room doesn't exists", () => {
    it("Throws an error", () => {
      const rooms: RoomSetT = {};
      expect(() => {
        removeUserFromRoom(user, rooms);
      }).toThrow();
    });
  });
});
