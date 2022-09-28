import React, {useEffect, useRef} from 'react';
import ReactHowler from 'react-howler';
import { lettersCoordinates } from 'src/resources/LettersCoordinates';

function LetterSound({isSound, track, isInLetter}) {
  const letterSound = useRef();

  useEffect(() => {
    if (isInLetter) {
      letterSound.current.howler.fade(0.0, 1.0, 3000);
      //letterSound.current.seek(0.04702083333333333);
      console.log(lettersCoordinates.current)
      var nudgeEvent = new Event('inLetterNow');
      window.dispatchEvent(nudgeEvent);
    } else {
      var clearEvent = new Event('outLetterNow');
      window.dispatchEvent(clearEvent);
      letterSound.current.howler.fade(1.0, 0.0, 1000);
    }
  }, [isInLetter]);

  return (
    <ReactHowler
      src={[track]}
      playing={isSound}
      ref={letterSound}
      autoPlay={false}
      loop
    />
  );
}
export default LetterSound;
