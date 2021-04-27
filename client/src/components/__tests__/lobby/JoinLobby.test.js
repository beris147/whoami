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
  const renderLobby = (socket) => {}
  const dataEmitted: Array<any> = [];
  beforeEach(() => {
    serverSocket.on('get-users-in-lobby', (data)=>{
      dataEmitted.push(data);
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
    dataEmitted.length = 0;
  });

  it("Emits one event to get the users in lobby", () => {
    expect(dataEmitted.length).toBe(1);
  });
  it("Sends the room id in that event", ()=> {
    expect(dataEmitted[0]).toBe("room-test-id");
  });
});
