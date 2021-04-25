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
import type { UserT } from "common/types";
import Lobby from "components/lobby/Lobby";
import SocketContext from "contexts/SocketContext";

describe("When user joins lobby", () => {
  const socket = io.connect();
  describe("Given a user that wasn't already in the lobby", () => {
    beforeEach(() => {
      render(
        <SocketContext.Provider value={socket}>
          <Lobby />
        </SocketContext.Provider>
      );
      const user: UserT = {
        id: "test-user-id",
        roomId: "test-room-id",
        username: "test-username",
      };
      act(() => {
        serverSocket.emit("user-joined", user);
      });
    });

    afterEach(() => {
      cleanup();
      cleanSocket();
    });

    it("Adds one item to the user list", () => {
      const users = screen.getAllByRole("listitem");
      expect(users.length).toBe(5);
    });
    it("Includes the username", () => {
      const userDiv = screen.queryByText(/test-username/);
      expect(userDiv).not.toBeNull();
    });
    it("Sets the new user as Waiting", () => {
      const userDiv = screen.getByText(/test-username/);
      const waitingDiv = queryByText(userDiv, /Waiting/);
      expect(waitingDiv).not.toBeNull();
    });
  });
});
