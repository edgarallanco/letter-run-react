import React from 'react';
import ReactHowler from 'react-howler';

function EnvSound({isSound, track}) {
  return <ReactHowler src={[track]} playing={isSound} loop />;
}
export default EnvSound;
