//@flow

import React from "react";
import type { UserInLobbyT } from "common/types";
import UserList from "./UserList";
import ReadyButton from "./ReadyButton";
import PlayButton from "./PlayButton";

const users: Array<UserInLobbyT> = [
  { id: "id1", username: "username1", roomId: "room", state: "Ready"},
  { id: "id2", username: "username2", roomId: "room", state: "Waiting" },
  { id: "id3", username: "username3", roomId: "room", state: "Waiting" },
  { id: "id4", username: "username4", roomId: "room", state: "Ready" },
];

const Lobby = (): React$Element<any> => {
  return (
    <div>
      <ReadyButton />
      <UserList users={users} />
      <PlayButton />
    </div>
  );
};

export default Lobby;
