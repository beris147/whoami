// @flow
import { useContext } from 'react';
import LobbyContext from 'contexts/Lobby/LobbyContext';
import RoomContext from 'contexts/RoomContext';
import SocketContext from 'contexts/SocketContext';
import UserContext from 'contexts/UserContext';
import { useLobbySocket } from 'sockets/Lobby/LobbySocket';
import { useRoomSocket } from 'sockets/RoomSocket';
import { useIsMounted } from 'utils/hooks/mounted';
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
  getUsers: () => void,
  leaveRoom: () => void,
  subscribeToEvents: () => void,
  unsubscribeFromEvents: () => void,
  userList: UsersInLobbyListT,
};

export const useLobbyApp = (): ?LobbyAppT => {
  const { userList, setUserList } = useContext(LobbyContext); 
  const { user } = useContext(UserContext);
  const { room } = useContext(RoomContext);
  const socketContext = useContext(SocketContext);
  const lobbySocket = useLobbySocket(socketContext);
  const roomSocket = useRoomSocket(socketContext);
	const isMounted = useIsMounted();

  if(!user || !room) return undefined;
  const updateUserList = (newUserList: UsersInLobbyListT) => {
    if(isMounted.current) setUserList(newUserList);
  }
  const userJoinedLobby = (username: string) => {
    const updatedUserList = addUserToLobbyList(username, userList);
    updateUserList(updatedUserList);
  }
  const userLeftLobby = (username: string) => {
    const updatedUserList = removeUserFromLobbyList(username, userList);
    updateUserList(updatedUserList);
  }
  const getUsers = () => {
    lobbySocket.emitGetUsersInLobby((users: UsersInLobbyListT) => {
      updateUserList(users);
      lobbySocket.emitUserJoined();
    });
  }
  const getUsersInLobby = (callback: UsersInLobbyCallbackT) => {
    callback(userList);
  }
  const updateUserState = (user: UserInLobbyT) => {
    const updatedUserList = updateUserInList(user, userList);
    updateUserList(updatedUserList); 
  }
  const gameStarted = (game: GameT) => {
    // TODO set game context and redirect to /game
    console.log(game);
  }
  const subscribeToEvents = () => {
    lobbySocket.subscribeToGameStarted(gameStarted);
    lobbySocket.subscribeToGetUsersInLobby(getUsersInLobby);
    lobbySocket.subscribeToUserIsNotReady(updateUserState);
    lobbySocket.subscribeToUserIsReady(updateUserState);
    roomSocket.subscribeToUserJoined(userJoinedLobby);
    roomSocket.subscribeToUserLeft(userLeftLobby);
  }
  const unsubscribeFromEvents = () => {
    lobbySocket.unsubscribeFromGameStarted();
    lobbySocket.unsubscribeFromGetUsersInLobby();
    lobbySocket.unsubscribeFromUserIsNotReady();
    lobbySocket.unsubscribeFromUserIsReady();
    roomSocket.unsubscribeFromUserJoined();
    roomSocket.unsubscribeFromUserLeft();
  }
  const leaveRoom = () => {
    lobbySocket.emitLeaveRoom();
  }
  const amIOwner = user.username === room.owner;
  return {
    amIOwner,
    getUsers,
    leaveRoom,
    subscribeToEvents,
    unsubscribeFromEvents,
    userList,
  };
}
