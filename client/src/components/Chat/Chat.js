// @flow
import React, { useEffect, useContext, useState } from 'react';
import SocketContext from 'contexts/SocketContext';
import UserContext from 'contexts/UserContext';
import errorCallBack from 'utils/errorCallBack';
import MessageList from 'components/Chat/MessageList';
import handleOnEnter from 'utils/handleOnEnter';
import DisplayError from 'components/Error/DisplayError';

import type { MessageT } from 'common/types';

const YES: bool = true;
const NO: bool = false;
type ChatPropsT = {
	normal: bool,
};

function Chat(props: ChatPropsT): React$Element<any> {
  const socket = useContext(SocketContext);
	const { user } = useContext(UserContext);
  const [textMessage: string | bool, setTextMessage] = useState('');
  const [messages: MessageT, setMessages] = useState([]);

  const handleSendMessage = (): void => {
		if(user) {
			const newMessage: MessageT = { message: textMessage, sender: user };
			socket.emit('send-message', newMessage, errorCallBack);
			setTextMessage('');
			setMessages([...messages, newMessage]);
		}
	}

	const handleYesOrNoAnswer = (answer: bool) => {
		socket.emit('send-answer', answer, errorCallBack);
	}

  useEffect((): any => {
		socket.on('new-message', (newMessage: MessageT) => {
			setMessages([...messages, newMessage]);
		});
		return () => {
			socket.off('new-message');
		}
	}, [socket, messages, setMessages]);
	if(!user) return <DisplayError error='User is not defined' />
  return (
    <div>
      <h1>Chat</h1>
			<MessageList messages={messages}/>
      {props.normal 
			? (
				<div>
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
				</div>
			): (
				<div>
					<button onClick={() => handleYesOrNoAnswer(YES)}>
						YES
					</button>
					<button onClick={() => handleYesOrNoAnswer(NO)}>
						NO
					</button>
				</div>
			)
			}
    </div>
  );
}

Chat.defaultProps = {
	normal: true,
}

export default Chat;