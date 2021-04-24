// @flow
import React, { useContext, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import UserContext from 'contexts/UserContext';
import { toast } from 'react-toastify';

function Room(): React$Element<any> {
    const { user } = useContext(UserContext);
    const { id } = useParams();
    const history = useHistory();
    
    useEffect(()=> {
      if(!user) history.push(`/join/${id}`);
      else toast.info('Share the link with your friends!', {autoClose: 5000, delay: 2500});
    }, [history, id, user]);
    
    return <h1>Room {id}</h1>;
}

export default Room;