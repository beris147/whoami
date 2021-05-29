// @flow
import { useContext, useEffect, useState, useCallback } from 'react';
import GameContext from 'contexts/GameContext';
import RoomContext from 'contexts/RoomContext';
import SocketContext from 'contexts/SocketContext';
import UserContext from 'contexts/UserContext';
import { useLobbySocket } from 'sockets/Lobby/LobbySocket';
import { useRoomSocket } from 'sockets/RoomSocket';
import { useIsMounted } from 'utils/hooks/mounted';
import { useMountedEffect } from 'utils/hooks/mounted';
import { createGame } from 'domain/logic/GameLogic';
import { useHistory } from 'react-router-dom';
import {
  addUserToLobbyList,
  isEverybodyReadyInList,
  removeUserFromLobbyList,
  updateUserInList,
} from 'domain/logic/LobbyLogic';

import type { GameT } from 'domain/models/GameModels';
import type {
  UserInLobbyT,
  UsersInLobbyCallbackT,
  UsersInLobbyListT,
} from 'domain/models/UserModels';

export type LobbyAppT = {
  amIOwner: boolean,
  isPlayable: boolean,
  roomOwner: string,
  userList: UsersInLobbyListT,
  playGameRequest: () => void,
};

export const useLobbyApp = (): ?LobbyAppT => {
  const [userList: UsersInLobbyListT, setUserList] = useState([]);
  const [isPlayable: boolean, setIsPlayable: (p: boolean) => void] =
    useState(false);
  const { setGame } = useContext(GameContext);
  const { user } = useContext(UserContext);
  const { room } = useContext(RoomContext);
  const socketContext = useContext(SocketContext);
  const history = useHistory();

  const lobbySocket = useLobbySocket(socketContext);
  const roomSocket = useRoomSocket(socketContext);
  const isMounted = useIsMounted();
  const updateUserList = useCallback(
    (newUserList: UsersInLobbyListT) => {
      if (isMounted.current) setUserList(newUserList);
    },
    [isMounted, setUserList]
  );
  const getUsers = useCallback(() => {
    lobbySocket.emitGetUsersInLobby((users: UsersInLobbyListT) => {
      updateUserList(users);
      lobbySocket.emitUserJoined();
    });
  }, [lobbySocket, updateUserList]);
  const playGameRequest = () => {
    const game = createGame(userList);
    lobbySocket.emitStartGame(game);
  };
  useMountedEffect(getUsers);
  useEffect(() => {
    const playable = isEverybodyReadyInList(userList);
    setIsPlayable(playable);
  }, [userList]);
  useEffect(() => {
    lobbySocket.onGameStarted((game: GameT) => {
      setGame(game);
      history.push('/game');
    });
    lobbySocket.onGetUsersInLobby((callback: UsersInLobbyCallbackT) => {
      callback(userList);
    });
    lobbySocket.onUserIsNotReady((user: UserInLobbyT) => {
      const updatedUserList = updateUserInList(user, userList);
      updateUserList(updatedUserList);
    });
    lobbySocket.onUserIsReady((user: UserInLobbyT) => {
      const updatedUserList = updateUserInList(user, userList);
      updateUserList(updatedUserList);
    });
    roomSocket.onUserJoined((username: string) => {
      const updatedUserList = addUserToLobbyList(username, userList);
      updateUserList(updatedUserList);
    });
    roomSocket.onUserLeft((username: string) => {
      const updatedUserList = removeUserFromLobbyList(username, userList);
      updateUserList(updatedUserList);
    });
    return () => {
      lobbySocket.offGameStarted();
      lobbySocket.offGetUsersInLobby();
      lobbySocket.offUserIsNotReady();
      lobbySocket.offUserIsReady();
    };
  }, [lobbySocket, history, roomSocket, setGame, updateUserList, userList]);
  if (!user || !room) return undefined;
  const amIOwner = user.username === room.owner;
  return {
    amIOwner,
    isPlayable,
    roomOwner: room.owner,
    userList,
    playGameRequest,
  };
};
