// @flow
import React, { useState } from 'react';
import LobbyContext from 'contexts/Lobby/LobbyContext';

const LobbyProvider = ({ children }: any): React$Element<any> => {
	const [userList, setUserList] = useState([]);
	return (
		<LobbyContext.Provider value={{userList, setUserList}}>
			{children}
		</LobbyContext.Provider>
	);
}

export default LobbyProvider;