// @flow
import React, { useContext, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import SocketContext from 'contexts/SocketContext';
import UserContext from 'contexts/UserContext';
import { toast } from 'react-toastify';
import Chat from 'components/Chat/Chat';
import Lobby from 'components/lobby/Lobby';

function Room(): React$Element<any> {
	const { user } = useContext(UserContext);
	const { id } = useParams();
	const history = useHistory();
	
	useEffect(()=> {
		if(!user) history.push(`/join/${id}`);
		else toast.info('Share the link with your friends!');
	}, [history, id, user]);
	
	return user ? (
		<div>
			<h1>Room {id}</h1> 
			<Lobby />
			<Chat />
		</div>
	) : <></>;
}

export default Room;