// @flow
import { useContext } from 'react';
import LobbyContext from 'contexts/Lobby/LobbyContext';
import SocketContext from 'contexts/SocketContext';
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
  UserIsReadyT, 
} from 'common/types';

import type { UsersInLobbyListT } from 'domain/models/LobbyDomainModels';

export const useJoinRoomApp = (): any => {
  const { userList, setUserList } = useContext(LobbyContext); 
  const socketContext = useContext(SocketContext);
  const lobbySocket = useLobbySocket(socketContext);
  const roomSocket = useRoomSocket(socketContext);
	const isMounted = useIsMounted();

  const updateUserList = (updatedUserList: UsersInLobbyListT): void => {
    if(isMounted.current) setUserList(updatedUserList);
  }
  const userJoined = (username: string) => {
    const updatedUserList = addUserToLobbyList(username, userList);
    updateUserList(updatedUserList);
  }
  const userLeft = (username: string) => {
    const updatedUserList = removeUserFromLobbyList(username, userList);
    updateUserList(updatedUserList);
  }
  const emitGetUsers = () => {
    lobbySocket.emitGetUsersInLobby((users: UsersInLobbyListT) => {
      setUserList(users);
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
    roomSocket.subscribeToUserJoined(userJoined);
    roomSocket.subscribeToUserLeft(userLeft);
  }
  const unsubscribeFromEvents = () => {
    lobbySocket.unsubscribeFromGameStarted();
    lobbySocket.unsubscribeFromGetUsersInLobby();
    lobbySocket.unsubscribeFromUserIsNotReady();
    lobbySocket.unsubscribeFromUserIsReady();
    roomSocket.unsubscribeFromUserJoined();
    roomSocket.unsubscribeFromUserLeft();
  }
  return {
    subscribeToEvents,
    unsubscribeFromEvents,
  };
}
