import React, {useRef, useContext, useState, useEffect} from 'react';
import {AppStateContext, AppDispatchContext} from 'context/AppContext';
import {Audio} from 'three';

function EnvSound() {
  const {state} = useContext(AppStateContext);
  const {dispatch} = useContext(AppDispatchContext);
  const sound = useRef();

  useEffect(() => {
    if (sound.current !== null) {
      // sound.current.play()
      state.sound ? sound.current.play() : sound.current.pause();
    }
  }, [state.sound]);

  useEffect(() => {
    if (state.player) {
      state.playerPosition.y <= 5
        ? sound.current.play()
        : sound.current.pause();
    }
  }, [state.sound]);
  return (
    <audio
      //   ref={sound}
      id='ambient'
      loop
      preload='auto'
      hidden

      className='hidden'
    >
      <source src='./resources/Nature.mp3' type='audio/mpeg' />
    </audio>
  );
}

export default EnvSound;
