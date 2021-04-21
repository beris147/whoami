// @flow
const { describe, it, expect } = require("@jest/globals");
const { createUser } = require("utils/userUtils");

import type { RoomT, RoomSetT, UserT, UserSetT, ErrorT } from "common/types";

describe("createUser", () => {
  it("returns a user with the given attributes", () => {
    const id: string = "my-id";
    const username: string = "my-username";
    const roomId: string = "my-room-id";

    const users: UserSetT = {};

    const expectedUser: UserT = { id, username, roomId };

    const user = createUser(id, username, roomId, users);

    expect(user).toStrictEqual(expectedUser);
  });
  it("adds the new user to de the user set", () => {
    const id: string = "my-id";
    const username: string = "my-username";
    const roomId: string = "my-room-id";
    
    const users: UserSetT = {};

    const user = createUser(id, username, roomId, users);

    expect(users[id]).toBe(user);
  });
  it("throws an error if the id is already in the user set", () => {
    const id: string = "my-id";
    const username: string = "my-username";
    const roomId: string = "my-room-id";

    const existingUser: UserT = {
      id: id,
      username: "other-username",
      roomId: "other-room-id",
    };

    const users: UserSetT = { id: existingUser };

    expect(() => createUser(id, username, roomId, users)).toThrow();
  });
});
