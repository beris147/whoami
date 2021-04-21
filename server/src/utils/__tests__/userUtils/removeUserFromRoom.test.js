// @flow
const { describe, it, expect, beforeEach } = require("@jest/globals");
const { removeUserFromRoom } = require("utils/userUtils");

import type { RoomT, RoomSetT, UserT, UserSetT, ErrorT } from "common/types";

describe("removeUserFromRoom", () => {
  it("removes the username from the room user list", () => {
      const roomId : string = "room-id";
      const userUsername : string = "user-username";
      const user : UserT = {
          id: "user-id",
          username: userUsername,
          roomId: roomId,
      };
      const ownerId : string = "owner-id";
      const owner : UserT = {
          id: ownerId,
          username: "owner-username",
          roomId: roomId,
      }
      const room : RoomT = {
          id: roomId,
          owner: ownerId,
          round: 1,
          time: 1,
          users: [userUsername],
      }
      let rooms : RoomSetT = {};
      rooms[roomId]=room;
      
      removeUserFromRoom(user,rooms);
  });
});
