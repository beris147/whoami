//@flow

import React, { useContext } from 'react';
import SocketContext from 'contexts/SocketContext';
import errorCallBack from 'utils/errorCallBack';

import type { GameT, UserInGameT, UserInLobbyT } from 'common/types';
type PlayButtonT = {
  userList: Array<UserInLobbyT>,
  disabled: bool,
}

const PlayButton = (props: PlayButtonT): React$Element<any> => {
  const socket = useContext(SocketContext);
  const shuffleList = (list: Array<string>): Array<string> => {
    const len = list.length;
    let shuffledList: Array<string> = list;
    for (let i = 0; i < len - 1; i++) { 
      let j = Math.floor(Math.random() * (len-(i+1)) ) + (i+1);
      let temp = shuffledList[i];
      shuffledList[i] = shuffledList[j];
      shuffledList[j] = temp;
    }
    return shuffledList;
  }
  const handlePlayGame = () => {
    const characters: Array<string> = props.userList.map(
      (user: UserInLobbyT): string => 
        user?.writtenCharacter || 'random character'
    );
    const shuffledCharacters: Array<string> = shuffleList(characters);
    const usersInGame: Array<UserInGameT> =
      shuffledCharacters.map(
        (character: string, i: number): UserInGameT => {
          const userInGame: UserInGameT = {
            username: props.userList[i].username,
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
    socket.emit('start-game', newGame, errorCallBack);
  }
  return (
    <button onClick={handlePlayGame} disabled={props.disabled}>Play</button>
  );
};

export default PlayButton;
