// @flow
import { describe, it, expect, beforeEach } from '@jest/globals';
import { createUser } from 'utils/userUtils';

import type { ErrorT } from 'domain/models/ErrorModels';
import type { RoomT, RoomSetT } from 'domain/models/RoomModels';
import type { UserT, UserSetT } from 'domain/models/UserModels';

const id: string = 'my-id';
const username: string = 'my-username';
const roomId: string = 'my-room-id';
const expectedUser: UserT = { id, username, roomId };
const oldUser: UserT = {
  id,
  username: 'old-username',
  roomId: 'old-room-id',
};
let users: UserSetT = {};

describe('createUser', () => {
  beforeEach(() => {
    users = {};
  });
  it('returns a user with the given attributes', () => {
    const user = createUser(id, username, roomId, users);
    expect(user).toStrictEqual(expectedUser);
  });
  it('adds the new user to the user set', () => {
    const user = createUser(id, username, roomId, users);
    expect(users[id]).toBe(user);
  });
  it('overrides the user if already exists', () => {
    users[id] = oldUser;
    createUser(id, username, roomId, users);
    expect(users[id]).toStrictEqual(expectedUser);
  });
});
