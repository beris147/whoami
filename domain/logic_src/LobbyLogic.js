// @flow
import type {
  UsersInLobbyListT,
  UserInLobbyT,
  UserIsNotReadyT,
} from '../models/UserModels';

const createNotReadyUser = (username: string): UserIsNotReadyT => {
  return { username };
};

export const addUserToLobbyList = (
  username: string,
  userList: UsersInLobbyListT
): UsersInLobbyListT => {
  const newUser = createNotReadyUser(username);
  return [...userList, newUser];
};

export const removeUserFromLobbyList = (
  username: string,
  userList: UsersInLobbyListT
): UsersInLobbyListT => {
  return userList.filter(
    (userInLobby: UserInLobbyT) => userInLobby.username !== username
  );
};

export const updateUserInList = (
  userToUpdate: UserInLobbyT,
  userList: UsersInLobbyListT
): UsersInLobbyListT => {
  return userList.map((userInLobby: UserInLobbyT): UserInLobbyT =>
    userInLobby.username === userToUpdate.username ? userToUpdate : userInLobby
  );
};

export const isEverybodyReadyInList = (
  userList: UsersInLobbyListT
): boolean => {
  return userList.every((user) => 'writtenCharacter' in user);
};
