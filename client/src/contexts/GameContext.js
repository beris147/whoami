// @flow
import React from 'react';

import type { GameT } from 'common/types';

export type GameContextT = {
  game: ?GameT,
  setGame: (g: ?GameT) => void,
}

const GameContext: React$Context<GameContextT> = 
  React.createContext<GameContextT>({
    game: undefined,
    setGame: (g: ?GameT): void => {},
  });

export default GameContext;