// @flow
import React, { useContext, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import UserContext from 'contexts/UserContext';


function Room(): React$Element<any> {
    const { user } = useContext(UserContext);
    const { id } = useParams();
    const history = useHistory();
    
    useEffect(()=> {
        if(!user) history.push(`/join/${id}`);
    }, [user, id]);
    
    return <h1>Room {id}</h1>;
}

export default Room;