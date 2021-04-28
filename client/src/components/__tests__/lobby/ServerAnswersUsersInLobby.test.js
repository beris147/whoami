//@flow

import React from "react";
import "@testing-library/jest-dom";
import {
  render,
  screen,
  cleanup,
  getAllByRole,
  queryByText,
} from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach } from "@jest/globals";
import io, { cleanSocket, serverSocket } from "utils/__mocks__/MockedSocketIO";
import Lobby from "components/lobby/Lobby";
import SocketContext from "contexts/SocketContext";
import type {
  UserInLobbyT,
  ErrorCallBackT,
  UsersInLobbyCallbackT,
} from "common/types";

describe("When server answers the users in lobby", () => {
  describe("Given the server found the list", () => {
    const mockUsers: Array<UserInLobbyT> = [
      { username: "test-user-1", state: "Ready" },
      { username: "test-user-2", state: "Waiting" },
    ];
    const socket = io.connect();
    beforeEach(() => {
      serverSocket.on(
        "get-users-in-lobby",
        (
          errorCallBack: ErrorCallBackT,
          succesCallback: UsersInLobbyCallbackT
        ) => {
          succesCallback(mockUsers);
        }
      );
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

    it("Resizes the list of users in lobby", () => {
      const userListUi = screen.getByRole("list");
      const userUis: Array<any> = getAllByRole(userListUi, "listitem");
      expect(userUis.length).toStrictEqual(mockUsers.length);
    });
    it("Includes the users in the list", () => {
      const userListUi = screen.getByRole("list");
      const userUis = mockUsers.map((user) => {
        const re = new RegExp(user.username);
        return queryByText(userListUi, re);
      });
      expect(userUis.every((userUi) => userUi != null)).toBe(true);
    });
  });
});
