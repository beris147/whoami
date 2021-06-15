// @flow
import React from 'react';

import type { MessageListT } from 'domain/models/MessageModels';

type MessageListPropsT = {
  messages: MessageListT,
};

function MessageList(props: MessageListPropsT): React$Element<any> {
  return (
    <div>
      {props.messages.map((message, index) => (
        <div key={index}>
          <b>{message.sender.username}</b>
          <br />
          <p>{message.message}</p>
          <br />
        </div>
      ))}
    </div>
  );
}

export default MessageList;
