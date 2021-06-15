//@flow
import React, { useState } from 'react';
import handleOnEnter from 'utils/handleOnEnter';
import { useReadyFormApp } from 'app/Lobby/ReadyFormApp';

const ReadyForm = (): React$Element<any> => {
  const [isReady: boolean, setIsReady: (r: boolean) => void] = useState(false);
  const [character: string, setCharacter: (c: string) => void] = useState('');
  const app = useReadyFormApp(character);
  const userIsReady = () => {
    app.userIsReady();
    setIsReady(true);
  };
  const userIsNotReady = () => {
    app.userIsNotReady();
    setIsReady(false);
  };
  return (
    <div>
      <input
        type='text'
        value={character}
        onChange={(e) => setCharacter(e.target.value)}
        disabled={isReady}
        onKeyDown={(e) => {
          if (character !== '') handleOnEnter(e, userIsReady);
        }}
      />
      {isReady ? (
        <button onClick={userIsNotReady}>Change</button>
      ) : (
        <button disabled={character === ''} onClick={userIsReady}>
          Ready
        </button>
      )}
    </div>
  );
};

export default ReadyForm;
