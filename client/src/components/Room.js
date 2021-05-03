// @flow
import React, { useContext, useEffect, useCallback, useRef } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import RoomContext from 'contexts/RoomContext';
import SocketContext from 'contexts/SocketContext';
import UserContext from 'contexts/UserContext';
import { toast } from 'react-toastify';
import Chat from 'components/Chat/Chat';
import Lobby from 'components/lobby/Lobby';
import { useIsMounted } from "utils/hooks/mounted";

import type { RoomT } from 'common/types';
import type { LobbyHandleT } from 'components/lobby/Lobby';

function Room(): React$Element<any> {
	const socket = useContext(SocketContext);
	const { room, setRoom } = useContext(RoomContext); 
	const { user } = useContext(UserContext);
	const { id } = useParams();
	const history = useHistory();
	const isMounted = useIsMounted();

	const lobbyRef = useRef<?LobbyHandleT>(null);

	const updateRoom = useCallback(
    (updatedRoom: ?RoomT) => {
      if(isMounted.current) setRoom(updatedRoom);
    },
    [isMounted, setRoom],
  );

	useEffect(() => {
		if(!user) history.push(`/join/${id}`);
		else toast.info('Share the link with your friends!');
	}, [history, id, user]);
	
	useEffect(()=> {
		socket.on('user-joined', (username: string) => {
			if(room){
				const updatedRoomUsers = [...room.users, username];
				const updatedRoom = {...room, users: updatedRoomUsers};
				updateRoom(updatedRoom);
			}
			lobbyRef.current?.addUserToLobby(username);
		});
		socket.on('user-left', (username: string) => {
			if(room) {
				const updatedRoomUsers = 
					room.users.filter(
						(roomUsername: string) => roomUsername !== username
					);
				const updatedRoom = {...room, users: updatedRoomUsers};
				updateRoom(updatedRoom);
			}
			lobbyRef.current?.removeUserFromLobby(username);
		});
		socket.on('left-room', () => {
			setRoom(undefined);
			history.push('/');
		});
		socket.on('room-owner-changed', (username: string) => {
			if(room) {
				const updatedRoom = {...room, owner: username};
				updateRoom(updatedRoom);
			}
		});
		return () => {
			socket.off('user-joined');
			socket.off('user-left');
			socket.off('room-owner-changed');
			socket.off('left-room');
		}
	}, [history, room, setRoom, socket, updateRoom]);
	return user ? (
		<div>
			<h1>Room {id}</h1> 
			<Lobby ref={lobbyRef}/>
			<Chat />
		</div>
	) : <></>;
}

export default Room;