import React, {useState, useEffect, useRef, useContext} from 'react';
import {useThree, useLoader} from '@react-three/fiber';
import * as THREE from 'three';
import {AppStateContext, AppDispatchContext} from 'context/AppContext';
import {Actions} from 'reducer/AppReducer';

function Checkpoint({url, position, isSound, collected}) {
  const {state} = useContext(AppStateContext);
  const sound = useRef();
  const {camera} = useThree();
  const [listener] = useState(() => new THREE.AudioListener());
  const buffer = useLoader(THREE.AudioLoader, url);
  useEffect(() => {
    if (collected) return;
    if (!isSound) return;
    if (sound.current.isPlaying) return;
    sound.current.setBuffer(buffer);
    sound.current.setRefDistance(10);
    sound.current.setMaxDistance(35);
    sound.current.setDistanceModel('linear');
    sound.current.setDirectionalCone(230, 230, 0.1);
    sound.current.setLoop(true);
    isSound ? sound.current.play() : sound.current.pause();
    camera.add(listener);
    return () => camera.remove(listener);
  }, [isSound]);
  return (
    <>
      {!collected && (
        <mesh position={position}>
          <boxGeometry />
          <meshBasicMaterial color='hotpink' />
          <positionalAudio ref={sound} args={[listener]} />
        </mesh>
      )}
    </>
  );
}

export default Checkpoint;
