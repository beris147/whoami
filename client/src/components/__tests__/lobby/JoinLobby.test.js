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
  let emitted = false;
  beforeEach(() => {
    serverSocket.on("get-users-in-lobby", () => {
      emitted = true;
    });
    render(
      <SocketContext.Provider value={socket}>
        <Lobby />
      </SocketContext.Provider>
    );
  });

  afterEach(() => {
    cleanup();
    cleanSocket();
    emitted = false;
  });

  it("Emits an event to get the users in lobby", () => {
    expect(emitted).toBe(true);
  });
  it("Sets the user list as empty", ()=>{
    const users = screen.queryAllByRole("listitem");
    expect(users.length).toBe(0);
  })
});
