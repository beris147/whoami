// @flow
import React, { useEffect, useState, useContext, useCallback } from 'react';
import GameContext from 'contexts/GameContext';
import SocketContext from 'contexts/SocketContext';
import UserContext from 'contexts/UserContext';
import { useIsMounted } from 'utils/hooks/mounted';
import { useHistory } from 'react-router-dom';
import Chat from 'components/Chat/Chat';
import { toast } from 'react-toastify';
import type { GameT, UserInGameT } from 'common/types';


function Game(): React$Element<any> {
  const { game, setGame } = useContext(GameContext);
  const { user } = useContext(UserContext);
  const socket = useContext(SocketContext);
  const isMounted = useIsMounted();
  const history = useHistory();
  const [isMyTurn: bool, setMyTurn: (t: bool) => void] = useState(false);
  const updateGame = useCallback(
    (updatedGame: GameT) => {
      if(isMounted.current) setGame(updatedGame);
    },
    [isMounted, setGame],
  );
  const handleNextTurn = () => {
    socket.emit('next-turn');
  }
  const handleUserGotIt = () => {
    socket.emit('user-got-it', game?.users[game.turn].username);
    socket.emit('next-turn');
  }
  useEffect(() => {
   if(!game || !user) history.push('/'); 
  }, [game, user, history]);

  useEffect(() => {
    if(user && game) setMyTurn(game.users[game.turn].username===user.username);
  }, [user, game, setMyTurn]);

  useEffect(() => {
    if(!game) return;
    socket.on('next-turn', () => {
      // TODO better turns management, we can have a map for the users that are
      // playing and one with the ones that already won, with the score.  
      let { turn, round } = game;
      let i = 0;
      do {
        turn++; i++;
        if(turn >= game.users.length) {
          turn = 0;
          round++;
        }
        if(i >= game.users.length) {
          socket.emit('game-over');
          return;
        }
      } while(game.users[turn].points !== 0);
      const updatedGame = {
        ...game, 
        round,
        turn,
      }
      updateGame(updatedGame);
    });
    socket.on('user-got-it', (username: string) => {
      // TODO when 50% of the party agrees that the user got it, lets move on
      const updatedUsers: Array<UserInGameT> = game.users.map(
        (user: UserInGameT) => 
          (user.username === username)
          ? {...user, points: 100} // TODO calculate points
          : user
      );
      const updatedGame: GameT = {
        ...game,
        users: updatedUsers,
      }
      updateGame(updatedGame);
    });
    socket.on('game-over', () => {
      // TODO redirect to scoreboard
      if(user) history.push(`/room/${user.roomId}`); 
      else history.push('/');
    });
    socket.on('send-answer', (value: bool) => {
      if (isMyTurn) {
        if(value) toast.success('YES! Continue or skip');
        else toast.error('NO! :c Next turn!');
      }
    });
    return () => {
      socket.off('next-turn');
      socket.off('user-got-it');
      socket.off('game-over');
      socket.off('send-answer');
    }
  }, [socket, updateGame, game, history, user, isMyTurn]);
  return game && user ? (
    <>
      <h1>Game</h1>
      <p>Player: {game.users[game.turn].username}</p>
      {!isMyTurn && <p>{game.users[game.turn].assignedCharacter}</p>}
      <Chat normal={isMyTurn}/>
      {
        // TODO next turn should be called when more than the 50% of the party
        // answered NO, so the turn ends
        isMyTurn && <button onClick={handleNextTurn}>Next</button>
      }
      {
        !isMyTurn && <button onClick={handleUserGotIt}> DONE! </button>
      }
    </>
  ): (
    <>Error</>
  );
}

export default Game;