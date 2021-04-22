// @flow
const { describe, it, expect, beforeEach } = require("@jest/globals");
const { removeUserFromRoom } = require("utils/userUtils");

import type { RoomT, RoomSetT, UserT, UserSetT, ErrorT } from "common/types";

describe("removeUserFromRoom", () => {
  describe("given a user whose room exists and their username appears in the room's list", () => {
    it("removes the username from the room user list", () => {
      const roomId: string = "room-id";
      const user: UserT = {
        id: "user-id",
        username: "user-username",
        roomId: roomId,
      };
      const userList: Array<string> = [
        "username-1",
        "username-2",
        "username-3",
      ];
      const room: RoomT = {
        id: roomId,
        owner: "owner-id",
        round: 1,
        time: 1,
        users: [...userList, user.username],
      };
      const expectedRoom: RoomT = {
        ...room,
        users: userList,
      };
      let rooms: RoomSetT = {};
      rooms[roomId] = room;

      removeUserFromRoom(user, rooms);
      expect(rooms[roomId]).toStrictEqual(expectedRoom);
    });
    // TODO: it removes the user from the user set
  });
  describe("given a user whose room exists and owns it", () => {
    it("does nothing", () => {
      // TODO: removing the owner should change ownership
      const user: UserT = {
        id: "user-id",
        username: "user-username",
        roomId: "room-id",
      };
      const room: RoomT = {
        id: user.roomId,
        owner: user.username,
        round: 1,
        time: 1,
        users: ["username-1", "username-2", "username-3"],
      };
      const rooms: RoomSetT = {
        [room.id]: room,
      };
      removeUserFromRoom(user, rooms);
      expect(rooms[room.id]).toStrictEqual(room);
    });
  });
  describe("given a user whose room exists and their username doesn't appear in the room's list", () => {
    it("does nothing", () => {
      const roomId: string = "room-id";
      const user: UserT = {
        id: "user-id",
        username: "user-username",
        roomId: roomId,
      };
      const userList: Array<string> = [
        "username-1",
        "username-2",
        "username-3",
      ];
      const room: RoomT = {
        id: roomId,
        owner: "owner-id",
        round: 1,
        time: 1,
        users: userList,
      };
      let rooms: RoomSetT = {};
      rooms[roomId] = room;

      removeUserFromRoom(user, rooms);
      expect(rooms[roomId]).toStrictEqual(room);
    });
  });
  describe("given a user whose room doesn't exists", () => {
    it("throws an error", () => {
      const roomId: string = "room-id";
      const user: UserT = {
        id: "user-id",
        username: "user-username",
        roomId: roomId,
      };
      let rooms: RoomSetT = {};
      expect(() => {
        removeUserFromRoom(user, rooms);
      }).toThrow();
    });
  });
  describe("given an owner", () => {});
});
