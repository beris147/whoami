//@flow

import React from "react";
import "@testing-library/jest-dom";
import {
  render,
  screen,
  cleanup,
  queryByText,
  act,
} from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach } from "@jest/globals";
import io, { cleanSocket, serverSocket } from "utils/__mocks__/MockedSocketIO";
import Lobby from "components/lobby/Lobby";
import SocketContext from "contexts/SocketContext";

describe("When user joins lobby", () => {
  const socket = io.connect();
  beforeEach(() => {
    render(
      <SocketContext.Provider value={socket}>
        <Lobby />
      </SocketContext.Provider>
    );
  });

  afterEach(() => {
    cleanup();
    cleanSocket();
  });

  it("Emits an event to get the users in lobby", () => {
    expect(socket.hasEmitted('get-users-in-lobby')).toBe(true);
  });
});
