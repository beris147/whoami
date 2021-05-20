// @flow
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Chat from 'components/Chat/Chat';
import Lobby from 'components/lobby/Lobby';
import DisplayError from 'components/Error/DisplayError';
import { useRoomApp } from 'app/RoomApp';

function Room(): React$Element<any> {
	const { id } = useParams();
	const app = useRoomApp();

	useEffect(()=> {
		app?.subscribeToEvents();
		return () => app?.unsubscribeFromEvents();
	}, [app]);

	if(!app) {
		return (
			<DisplayError
				error='room is not defined, define it in /join'
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