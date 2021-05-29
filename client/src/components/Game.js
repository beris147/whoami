// @flow
import React, { useEffect, useState, useContext, useCallback } from 'react';
import GameContext from 'contexts/GameContext';
import SocketContext from 'contexts/SocketContext';
import UserContext from 'contexts/UserContext';
import { useIsMounted } from 'utils/hooks/mounted';
import { useHistory } from 'react-router-dom';
import Chat from 'components/Chat/Chat';
import { toast } from 'react-toastify';
import DisplayError from 'components/Error/DisplayError';

import type { GameT } from 'domain/models/GameModels';
import type { UserInGameT } from 'domain/models/UserModels';

function Game(): React$Element<any> {
  const { game, setGame } = useContext(GameContext);
  const { user } = useContext(UserContext);
  const socket = useContext(SocketContext);
  const isMounted = useIsMounted();
  const history = useHistory();
  const [isMyTurn: boolean, setMyTurn: (t: boolean) => void] = useState(false);
  const updateGame = useCallback(
    (updatedGame: GameT) => {
      if (isMounted.current) setGame(updatedGame);
    },
    [isMounted, setGame]
  );
  const handleNextTurn = () => {
    socket.emit('next-turn');
  };
  const handleUserGotIt = () => {
    socket.emit('user-got-it', game?.users[game.turn].username);
    socket.emit('next-turn');
  };

  useEffect(() => {
    if (user && game)
      setMyTurn(game.users[game.turn].username === user.username);
  }, [user, game, setMyTurn]);

  useEffect(() => {
    if (!game) return;
    socket.on('next-turn', () => {
      // TODO better turns management, we can have a map for the users that are
      // playing and one with the ones that already won, with the score.
      let { turn, round } = game;
      let i = 0;
      do {
        turn++;
        i++;
        if (turn >= game.users.length) {
          turn = 0;
          round++;
        }
        if (i >= game.users.length) {
          socket.emit('game-over');
          return;
        }
      } while (game.users[turn].points !== 0);
      const updatedGame = {
        ...game,
        round,
        turn,
      };
      updateGame(updatedGame);
    });
    socket.on('user-got-it', (username: string) => {
      // TODO when 50% of the party agrees that the user got it, lets move on
      const updatedUsers: Array<UserInGameT> = game.users.map(
        (user: UserInGameT) =>
          user.username === username
            ? { ...user, points: 100 } // TODO calculate points
            : user
      );
      const updatedGame: GameT = {
        ...game,
        users: updatedUsers,
      };
      updateGame(updatedGame);
    });
    socket.on('game-over', () => {
      // TODO redirect to scoreboard
      if (user) history.push(`/room/${user.roomId}`);
      else history.push('/');
    });
    socket.on('send-answer', (value: boolean) => {
      if (isMyTurn) {
        if (value) toast.success('YES! Continue or skip');
        else toast.error('NO! :c Next turn!');
      }
    });
    return () => {
      socket.off('next-turn');
      socket.off('user-got-it');
      socket.off('game-over');
      socket.off('send-answer');
    };
  }, [socket, updateGame, game, history, user, isMyTurn]);
  if (!game || !user) {
    return (
      <DisplayError
        error='User or game is not definded, we cannot play, redirect to home'
        redirectTo='/'
      />
    );
  }
  return (
    <>
      <h1>Game</h1>
      <p>Player: {game.users[game.turn].username}</p>
      {!isMyTurn && <p>{game.users[game.turn].assignedCharacter}</p>}
      <Chat normal={isMyTurn} />
      {
        // TODO next turn should be called when more than the 50% of the party
        // answered NO, so the turn ends
        isMyTurn && <button onClick={handleNextTurn}>Next</button>
      }
      {!isMyTurn && <button onClick={handleUserGotIt}> DONE! </button>}
    </>
  );
}

export default Game;
