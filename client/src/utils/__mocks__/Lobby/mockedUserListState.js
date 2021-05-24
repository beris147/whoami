// @flow
import type { UsersInLobbyListT } from 'domain/models/LobbyDomainModels';

export let userList: UsersInLobbyListT = [];

export const setUserList = (ul: UsersInLobbyListT): void => { userList = ul };

const mockedUserListState = { userList, setUserList }; 

export default mockedUserListState;
