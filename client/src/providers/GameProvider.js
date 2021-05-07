// @flow
import React, { useState } from 'react';
import GameContext from 'contexts/GameContext';

import type { GameT } from 'common/types';

const GameProvider = ({ children }: any): React$Element<any> => {
	const [game: ?GameT, setGame: (r: GameT) => void ] = useState(undefined);
	return (
		<GameContext.Provider value={{game, setGame}}>
			{children}
		</GameContext.Provider>
	);
}

export default GameProvider;