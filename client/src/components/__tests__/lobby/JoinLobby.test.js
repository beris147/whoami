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
import ElementWithProviders from "components/__mocks__/ElementWithProviders";

describe("When user joins lobby", () => {
  const socket = io.connect();
  const eventsEmitted: Array<string> = [];
  beforeEach(() => {
    serverSocket.on("get-users-in-lobby", () => {
      eventsEmitted.push("get-users-in-loby");
    });
    serverSocket.on("user-joined", () => {
      eventsEmitted.push("user-joined");
    });
    
    render(
      <ElementWithProviders socket={socket}>
        <Lobby />
      </ElementWithProviders>
    );
  });

  afterEach(() => {
    cleanup();
    cleanSocket();
    eventsEmitted.length = 0;
  });

  it("Emits an event to get the users in lobby", () => {
    expect(eventsEmitted.includes("get-users-in-loby")).toBe(true);
  });
  it("Sets the user list as empty", ()=>{
    const users = screen.queryAllByRole("listitem");
    expect(users.length).toBe(0);
  })
  it("Doesn't emit an event to notify join", () => {
    expect(eventsEmitted.includes("user-joined")).toBe(false);
  });
});
