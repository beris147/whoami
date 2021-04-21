// @flow
import React from 'react';
import io from 'socket.io-client'
import SocketContext from 'contexts/SocketContext';

const SocketProvider = ({ children }: any): React$Element<any> => {
    const ENDPOINT = 'http://localhost:9000';
    const socket = io(ENDPOINT, { transports: ['websocket', 'polling'] });
    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
}

export default SocketProvider;