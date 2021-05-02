// @flow
import React, { useEffect, useContext, useState } from 'react';
import SocketContext from 'contexts/SocketContext';
import UserContext from 'contexts/UserContext';
import errorCallBack from 'utils/errorCallBack';
import MessageList from 'components/Chat/MessageList';
import handleOnEnter from 'utils/handleOnEnter';

import type { MessageT } from 'common/types';

function Chat(): React$Element<any> {
  const socket = useContext(SocketContext);
	const { user } = useContext(UserContext);
  const [textMessage: string, setTextMessage] = useState('');
  const [messages: MessageT, setMessages] = useState([]);

  const handleSendMessage = (): void => {
		if(user) {
			const newMessage: MessageT = { message: textMessage, sender: user };
			socket.emit('send-message', newMessage, errorCallBack);
			setTextMessage('');
			setMessages([...messages, newMessage]);
		}
	}

  useEffect((): any => {
		socket.on('new-message', (newMessage: MessageT) => {
			setMessages([...messages, newMessage]);
		});
		return () => {
			socket.off('new-message');
		}
	}, [socket, messages, setMessages]);
  
  return (
    <>
      <h1>Chat</h1>
      <MessageList messages={messages}/>
      <input
				type='text' 
				value={textMessage} 
				onChange={e => setTextMessage(e.target.value)}
				onKeyDown={
					e => {
						if(textMessage !== '') handleOnEnter(e, handleSendMessage);
					}
				}
			/>
			<button onClick={handleSendMessage} disabled={textMessage === ''}>
				Send
			</button> 
    </>
  );
}

export default Chat;