// @flow
import { useContext, useEffect, useState, useCallback } from 'react';
import RoomContext from 'contexts/RoomContext';
import SocketContext from 'contexts/SocketContext';
import UserContext from 'contexts/UserContext';
import { useLobbySocket } from 'sockets/Lobby/LobbySocket';
import { useRoomSocket } from 'sockets/RoomSocket';
import { useIsMounted } from 'utils/hooks/mounted';
import { useMountedEffect } from 'utils/hooks/mounted';
import { 
  addUserToLobbyList,
  removeUserFromLobbyList,
  updateUserInList,
} from 'domain/logic/LobbyDomainLogic';

import type { 
  GameT,
  UserInLobbyT, 
  UsersInLobbyCallbackT,
} from 'common/types';
import type { UsersInLobbyListT } from 'domain/models/LobbyDomainModels';

export type LobbyAppT = {
  amIOwner: bool,
  userList: UsersInLobbyListT,
  leaveRoom: () => void,
};

export const useLobbyApp = (): ?LobbyAppT => {
  const [userList, setUserList] = useState([]); 
  const { user } = useContext(UserContext);
  const { room } = useContext(RoomContext);
  const socketContext = useContext(SocketContext);
  const lobbySocket = useLobbySocket(socketContext);
  const roomSocket = useRoomSocket(socketContext);
	const isMounted = useIsMounted();
  const updateUserList = useCallback((newUserList: UsersInLobbyListT) => {
    if(isMounted.current) setUserList(newUserList);
  }, [isMounted, setUserList]);
  const getUsers = useCallback(() => {
    lobbySocket.emitGetUsersInLobby((users: UsersInLobbyListT) => {
      updateUserList(users);
      lobbySocket.emitUserJoined();
    });
  }, [lobbySocket, updateUserList]);
  const leaveRoom = () => {
    lobbySocket.emitLeaveRoom();
  }
  useMountedEffect(getUsers);
  useEffect(() => {
    lobbySocket.onGameStarted((game: GameT) => {
      // TODO set game context and redirect to /game
      console.log(game);
    });
    lobbySocket.onGetUsersInLobby(
      (callback: UsersInLobbyCallbackT) => {
        callback(userList);
      }
    );
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
    }
  }, [lobbySocket, roomSocket, updateUserList, userList]);
  if(!user || !room) return undefined;
  const amIOwner = user.username === room.owner;
  return {
    amIOwner,
    userList,
    leaveRoom,
  };
}
