// @flow
const { test, expect } = require('@jest/globals');
const { createRoom } = require('utils/roomUtils');

import type { RoomSetT, UserSetT } from 'common/types';

// This is basically a stupid test just to test the testing framework
// TODO: proper testing
test('createRoom should add the new room to the roomSet', () => {
    const owner = "the owner";
    const roomSet: RoomSetT = {};
    const room = createRoom(owner, roomSet);
    expect(roomSet[room.id]).toBe(room);
});