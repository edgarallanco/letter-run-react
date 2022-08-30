import React, {useEffect, useRef} from 'react';
import ReactHowler from 'react-howler';

function EnvSound({isSound, isInLetter}) {
  const envSound = useRef();

  useEffect(() => {
    /* if (isInLetter) {
      envSound.current.howler.fade(1.0, 0.0, 3000);
    } else {
      envSound.current.howler.fade(0.0, 1.0, 2000);
    } */
  }, [isInLetter]);

  return (
    <ReactHowler
      src='https://fargamot.s3.amazonaws.com/resources/Nature.mp3'
      playing={isSound}
      ref={envSound}
      autoPlay={false}
      loop
    />
  );
}
export default EnvSound;
