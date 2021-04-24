// @flow
const { describe, it, expect, beforeEach } = require("@jest/globals");
const { createUser, removeUserById } = require("utils/userUtils");

import type { RoomT, RoomSetT, UserT, UserSetT } from "common/types";

let user: UserT; 

const roomId: string = "room-id";
const userId: string = "user-id";

const roomTemplate: RoomT = {
  id: "template-id",
  owner: "owner-username",
  round: 1,
  time: 1,
  users: ["username-1", "username-2", "username-3"],
};

const users: UserSetT = {};
const rooms: RoomSetT = {};

describe("When removing a user by id", () => {
  beforeEach(() => {
    user = createUser(
      userId,
      "user-username",
      roomId,
      users,
    );
  });
  it("Should not be in the userSet anymore", () => {
    removeUserById(userId, users, rooms);
    expect(users[userId]).toBeUndefined();
  });
  describe("When is the owner of the room", () => {
    beforeEach(() => {
      rooms[roomId] = {
        ...roomTemplate,
        id: roomId,
        owner: user.username,
        users: [user.username],
      }
    });
    describe("When it's alone in the room", () => {
      it("The room should be removed", () => {
        removeUserById(userId, users, rooms);
        expect(rooms[roomId]).toBeUndefined();
      });
    });
    describe("When the room contains more users", () => {
      beforeEach(() => {
        rooms[roomId].users = [...roomTemplate.users, user.username];
      });
      it("Should be removed from the room", () => {
        removeUserById(userId, users, rooms);
        expect(rooms[roomId].users).not.toContain(user.username);
      });
      it("Should not be the owner of the room anymore", () => {
        removeUserById(userId, users, rooms);
        expect(rooms[roomId].owner).not.toBe(user.username);
      });
    });
  });
});
