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
import Room from "components/Room";
import ElementWithProviders from "components/__mocks__/ElementWithProviders";
import MockRouter from 'components/__mocks__/MockRouter';
import {user, setUser} from 'utils/__mocks__/mockedUserState';
import type {
  UserT,
  UserInLobbyT,
  ErrorCallBackT,
  UsersInLobbyCallbackT,
} from "common/types";

describe("When user is in lobby and another user joins", () => {
  const socket = io.connect();
  describe("Given a user that wasn't already in the lobby", () => {
    const mockUsers: Array<UserInLobbyT> = [
      { username: "test-user-1" },
      { username: "test-user-2" },
    ];
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
      const fakeUser: UserT = {
        id: 'id',
        username: 'username',
        roomId: '1234',
      }
      setUser(fakeUser);
      render(
        <ElementWithProviders socket={socket} mockedUserState={{user, setUser}}>
          <MockRouter initialEntries={['/room/1234']} path={'/room/:id'}>
            <Room />
          </MockRouter>
        </ElementWithProviders>
      );
      const username: string = "test-username";
      act(() => {
        serverSocket.emit("user-joined", username);
      });
    });

    afterEach(() => {
      cleanup();
      cleanSocket();
    });

    it("Adds one item to the user list", () => {
      const users = screen.getAllByRole("listitem");
      expect(users.length).toBe(mockUsers.length + 1);
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
