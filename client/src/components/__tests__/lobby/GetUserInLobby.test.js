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
import type {
  UserInLobbyT,
  ErrorCallBackT,
  UsersInLobbyCallbackT,
} from "common/types";

describe("When receive get-users-in-lobby request", () => {
  const mockUsers: Array<UserInLobbyT> = [
    { username: "test-user-1" },
    { username: "test-user-2" },
  ];
  const socket = io.connect();
  let receivedUsers: ?Array<UserInLobbyT> = null;
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
    serverSocket.emit("get-users-in-lobby", (answer: Array<UserInLobbyT>) => {
      receivedUsers = answer;
    });
  });

  afterEach(() => {
    cleanup();
    cleanSocket();
  });

  it("Returns the current list of users in lobby", () => {
    expect(receivedUsers).toStrictEqual(mockUsers);
  });
});
