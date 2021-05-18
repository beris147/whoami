//@flow

import React, { useEffect, useContext, useState, useCallback, useImperativeHandle } from "react";
import UserList from "./UserList";
import ReadyForm from "./ReadyForm";
import PlayButton from "./PlayButton";
import GameContext from 'contexts/GameContext';
import RoomContext from 'contexts/RoomContext';
import SocketContext from "contexts/SocketContext";
import UserContext from 'contexts/UserContext';
import errorCallBack from "utils/errorCallBack";
import { useIsMounted } from "utils/hooks/mounted";
import { useHistory } from 'react-router-dom';
import DisplayError from 'components/Error/DisplayError';

import type { 
  GameT,
  UserInGameT,
  UserInLobbyT,
  UsersInLobbyCallbackT,
  UserIsReadyT,
  UserIsNotReadyT,
} from "common/types";

export type LobbyHandleT = {
  addUserToLobby: (u: string) => void,
  removeUserFromLobby: (u: string) => void,
}

const shuffleList = (list: Array<any>): Array<any> => {
  const len = list.length;
  let shuffledList: Array<any> = list;
  for (let i = 0; i < len - 1; i++) { 
    let j = Math.floor(Math.random() * (len-(i+1)) ) + (i+1);
    let temp = shuffledList[i];
    shuffledList[i] = shuffledList[j];
    shuffledList[j] = temp;
  }
  return shuffledList;
}

const Lobby: React$AbstractComponent<{}, LobbyHandleT> = 
  React.forwardRef<{}, LobbyHandleT>((props, ref): React$Element<any> => {
    const { setGame } = useContext(GameContext);
    const { room } = useContext(RoomContext);
    const { user } = useContext(UserContext);
    const socket = useContext(SocketContext);
    const isMounted = useIsMounted();
    const history = useHistory();
    // TODO?: maybe we can change this array to a map, with the username as a key
    // to avoid iterate through the array to update stuff.
    const [userList: Array<UserInLobbyT>, setUserList] = useState([]);
    const [isPlayable: bool, setPlayable: (p: bool) => void] = useState(false);
    const updateUserList = useCallback(
      (updatedUserList: Array<UserInLobbyT>) => {
        if(isMounted.current) setUserList(updatedUserList); 
      },
      [isMounted],
    );
    const updateUserInUserList = useCallback(
      (userToUpdate: UserInLobbyT) => {
        const updatedUserList: Array<UserInLobbyT> = 
          userList.map(
            (userInLobby: UserInLobbyT): UserInLobbyT => 
              userInLobby.username === userToUpdate.username
              ? userToUpdate
              : userInLobby
          );
        updateUserList(updatedUserList);
      },
      [userList, updateUserList],
    );
    useImperativeHandle(ref, () => ({
      addUserToLobby(username: string) {
        const userInLobby: UserIsNotReadyT = {
          username: username,
        };
        const updatedUserList: Array<UserInLobbyT> = [...userList, userInLobby];
        updateUserList(updatedUserList);
      },
      removeUserFromLobby(username: string) {
        const updatedUserList: Array<UserInLobbyT> = 
          userList.filter(
            (userInLobby: UserInLobbyT) => 
              userInLobby.username !== username
          );
        updateUserList(updatedUserList);
      }
    }));
    const handleLeaveRoom = () => {
      socket.emit("leave-room");
    };
    useEffect(() => {
      socket.emit("get-users-in-lobby", errorCallBack, (users) => {
        setUserList(users);
        socket.emit("user-joined");
      });
    }, [socket]);
    useEffect(() => {
      socket.on("get-users-in-lobby", (callback: UsersInLobbyCallbackT) => {
        callback(userList);
      });
      socket.on("user-is-ready", (userIsReady: UserIsReadyT) => {
        updateUserInUserList(userIsReady);
      });
      socket.on("user-is-not-ready", (userIsNotReady: UserIsNotReadyT) => {
        updateUserInUserList(userIsNotReady);
      });
      socket.on('game-started', () => {
        const characters: Array<string> = userList.map(
          (user: UserInLobbyT): string => 
            user?.writtenCharacter || 'random character'
        );
        const shuffledCharacters: Array<string> = shuffleList(characters);
        const usersInGame: Array<UserInGameT> =
          shuffledCharacters.map(
            (character: string, i: number): UserInGameT => {
              const userInGame: UserInGameT = {
                username: userList[i].username,
                assignedCharacter: character,
                points: 0,
              }
              return userInGame;
            }
          );
        const newGame: GameT = {
          round: 0,
          turn: 0,
          users: usersInGame,
        }
        setGame(newGame);
        history.push('/game');
      })
      return () => {
        socket.off("get-users-in-lobby");
        socket.off("user-is-ready");
        socket.off("user-is-not-ready");
        socket.off('game-started');
      };
    });
    useEffect(() => {
      const playable = userList.every(
        (user: UserInLobbyT) => 'writtenCharacter' in user,
      );
      setPlayable(playable);
    }, [userList, setPlayable]);
    if(!user) return <DisplayError error='User is not defined' />;
    if(!room) return <DisplayError error='Room is not defined' />;
    return (
      <div>
        <button onClick={handleLeaveRoom}>
          Leave
        </button>
        <ReadyForm />
        <UserList users={userList} />
        {
          room.owner === user.username && 
          <PlayButton userList={userList} disabled={!isPlayable}/>
        }
      </div>
    );
  }
);

export default Lobby;