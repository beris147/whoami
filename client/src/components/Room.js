// @flow
import React, { useContext, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import SocketContext from 'contexts/SocketContext';
import UserContext from 'contexts/UserContext';
import { toast } from 'react-toastify';
import errorCallBack from 'utils/errorCallBack';
import type { MessageT } from 'common/types';

function Room(): React$Element<any> {
  const socket = useContext(SocketContext);
	const { user } = useContext(UserContext);
	const { id } = useParams();
	const [message, setMessage] = useState('');
	const history = useHistory();

	const handleSendMessage = (): void => {
		const data: MessageT = { message, sender: user };
		socket.emit('send-message', data, errorCallBack);
		setMessage('');
	}
	
	useEffect(()=> {
		if(!user) history.push(`/join/${id}`);
		else toast.info('Share the link with your friends!', {autoClose: 5000, delay: 2500});
	}, [history, id, user]);

	useEffect((): any => {
		socket.on('new-message', (message: MessageT) => {
			alert(`${message.sender.username} says ${message.message}`);
		});
		return () => {
			socket.off('new-message');
		}
	}, [socket, message])
	
	return (
		<div>
			<h1>Room {id}</h1>
			<input 
				type='text' 
				value={message} 
				onChange={e => setMessage(e.target.value)}
			/>
			<button onClick={handleSendMessage} disabled={message === ''}>
				Send
			</button>     
		</div>
	);
}

export default Room;