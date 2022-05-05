import React, {useRef, useContext, useState, useEffect} from 'react';
import {Canvas, useThree, useLoader} from '@react-three/fiber';
import {Suspense} from 'react';
import Camera from 'components/three/Camera';
import Player from 'components/three/Player';
import Scene from 'components/three/Scene';
import {AppProvider} from 'context/AppContext';
import Checkpoint from './three/Checkpoint';
import {AppStateContext} from 'context/AppContext';
import Modal from './Modal';
import {GizmoHelper, GizmoViewport} from '@react-three/drei';
import stateValtio from 'context/store';

export const Stage1 = () => {
  const {state} = useContext(AppStateContext);
  const [isSound, setIsSound] = useState(false);
  const [envSound, setEnvSound] = useState(false);
  const [isModal, setIsModal] = useState(false);
  const [checkpoint, setCheckpoint] = useState({});
  const sound = useRef();
  useEffect(() => {
    if (sound.current !== null) {
      isSound && envSound ? sound.current.play() : sound.current.pause();
    }
  }, [envSound, isSound]);

  return (
    <>
      {isModal && (
        <Modal
          isModal={isModal}
          setIsModal={setIsModal}
          checkpoint={checkpoint}
        />
      )}
      <Canvas>
        <Suspense fallback={null}>
          <AppProvider>
            <GizmoHelper
              alignment='bottom-right' // widget alignment within scene
              margin={[80, 80]} // widget margins (X, Y)
            >
              <GizmoViewport
                axisColors={['red', 'green', 'blue']}
                labelColor='black'
              />
            </GizmoHelper>
            <Player
              isModal={isModal}
              setIsModal={setIsModal}
              isSound={isSound}
              envSound={envSound}
              setEnvSound={setEnvSound}
              setCheckpoint={setCheckpoint}
              action={stateValtio.action}
            />
            <Camera />
            {stateValtio.checkpoints.map(({position, number}) => (
              <Checkpoint
                url='./resources/beat-loop.mp3'
                isSound={isSound}
                position={position}
                key={number}
              />
            ))}
            <directionalLight
              color={0xffffff}
              intensity={1}
              position={[1, 1.5, 1]}
              castShadow={true}
              shadow={{
                bias: -1e-4,
                normalBias: 0.05,
                mapSize: {setScalar: 2048},
              }}
            />
            <pointLight distance={8} position={[0, 50, 0]} />
            <pointLight
              distance={15}
              intensity={5}
              position={[0, 100, 135]}
              castShadow={true}
            />
            <Scene checkpoint={checkpoint} isModal={isModal} />
          </AppProvider>
        </Suspense>
      </Canvas>
      <button
        className='bg-blue-500 hover:bg-blue-400 absolute text-white top-0 font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded m-6'
        onClick={(checkpoints) => {}}
      >
        {JSON.stringify(stateValtio.checkpoints.length)} / 10
      </button>
      <button
        className='bg-blue-500 hover:bg-blue-400 absolute text-white bottom-0 font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded m-6'
        onClick={(checkpoints) => {
          setIsSound(() => setIsSound(!isSound));

          // dispatch({type: Actions.UPDATE_SOUND, payload: !state.sound});
        }}
      >
        Sound is {isSound ? 'On' : 'Off'}
      </button>
      <audio
        ref={sound}
        id='ambient'
        loop
        preload='auto'
        hidden
        className='hidden'
      >
        <source src='./resources/Nature.mp3' type='audio/mpeg' />
      </audio>
    </>
  );
};

export default Stage1;
