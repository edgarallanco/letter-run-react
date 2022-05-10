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
import {GizmoHelper, GizmoViewport, Sky} from '@react-three/drei';
import stateValtio from 'context/store';
import {Perf} from 'r3f-perf';

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
      <Canvas shadows>
        <ambientLight intensity={0.8} position={[0, 30, 15]} />
        <directionalLight
          // position={[5, 5, 5]}
          intensity={1.3}
          castShadow={true}
          position={[6, 25, -9]}
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={400}
          shadow-camera-left={-100}
          shadow-camera-right={100}
          shadow-camera-top={100}
          shadow-camera-bottom={-100}
        />

        {/* <Sky castShadow={true} distance={150} sunPosition={[10, 5, 5]} /> */}
        <Perf />
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
            <Camera />
            <Player
              isModal={isModal}
              setIsModal={setIsModal}
              isSound={isSound}
              envSound={envSound}
              setEnvSound={setEnvSound}
              setCheckpoint={setCheckpoint}
              action={stateValtio.action}
            />

            {stateValtio.checkpoints.map(({position, number}) => (
              <Checkpoint
                url='./resources/beat-loop.mp3'
                isSound={isSound}
                position={position}
                key={number}
              />
            ))}
            <Scene shadows checkpoint={checkpoint} isModal={isModal} />
          </AppProvider>
        </Suspense>
      </Canvas>
      <button className='bg-blue-500 hover:bg-blue-400 absolute text-white top-0 font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded m-6'>
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
