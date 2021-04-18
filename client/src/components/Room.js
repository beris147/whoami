// @flow
import React from 'react';
import { useParams } from 'react-router-dom';

function Room(): React$Element<any> {
    // confirm if room exists, if not show error
    // if room exists join the game
    // if we have an username in the props, join
    // else go to /join/:id to log in 
    const { id } = useParams();
    return <h1>Room {id}</h1>;
}

export default Room;