// @flow
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Chat from 'components/Chat/Chat';
import Lobby from 'components/lobby/Lobby';
import DisplayError from 'components/Error/DisplayError';

import type { RoomAppT } from 'app/RoomApp';

type RoomPropsT = {
	app?: ?RoomAppT,
}

function Room(props: RoomPropsT): React$Element<any> {
	const { id } = useParams();
	const [app] = useState(props.app);

	useEffect(()=> {
		app?.subscribeToEvents();
		return () => app?.unsubscribeFromEvents();
	}, [app]);

	if(!app) {
		return (
			<DisplayError
				error='App is not defined, define it in /join'
				redirectTo={`/join/${id}`}
			/>
		);
	}
	return (
		<div>
			<h1>Room {app.roomId}</h1> 
			<Lobby />
			<Chat />
		</div>
	);
}

export default Room;