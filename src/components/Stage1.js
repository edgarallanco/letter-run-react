import React, {useRef, useContext, useState, useEffect} from 'react';
import {Canvas, useThree, useLoader} from '@react-three/fiber';
import {Suspense} from 'react';
import Camera from 'components/three/Camera';
import Player from 'components/three/Player';
import Scene from 'components/three/Scene';
import {AppProvider} from 'context/AppContext';
import Checkpoint from './three/Checkpoint';
import {AppStateContext} from 'context/AppContext';
import stateValtio from 'context/store';
import PopUp from './UI/PopUp';
import Finish from './UI/Finish';
import Home from './UI/Home';

export const Stage1 = () => {
  const {state} = useContext(AppStateContext);
  const [zoom, setZoom] = useState(false);
  const [isSound, setIsSound] = useState(false);
  const [envSound, setEnvSound] = useState(false);
  const [isPopup, setIsPopup] = useState(false);
  const [checkpoint, setCheckpoint] = useState({});
  const [isFinished, setIsFinished] = useState(false);
  const [isCollection, setIsCollection] = useState(false);
  const [isHome, setIsHome] = useState(!true);
  const sound = useRef();
  useEffect(() => {
    if (sound.current !== null) {
      isSound && envSound ? sound.current.play() : sound.current.pause();
    }
  }, [envSound, isSound]);

  const updateCollection = () => {
    setIsCollection(true);
    setIsPopup(true);
  };

  return (
    <>
      {isHome && <Home setIsHome={() => setIsHome(false)} />}
      <Finish
        isFinished={isFinished}
        setIsFinished={() => setIsFinished(false)}
        isCollection={isCollection}
      />
      <PopUp
        isPopup={isPopup}
        setIsPopup={() => setIsPopup(false)}
        isCollection={isCollection}
        setIsCollection={() => setIsCollection(false)}
      />
      <Canvas shadows>
        <ambientLight intensity={0.8} position={[0, 30, 15]} />
        <directionalLight
          name='Directional Light'
          castShadow
          intensity={0.7}
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={400}
          shadow-camera-left={-100}
          shadow-camera-right={100}
          shadow-camera-top={100}
          shadow-camera-bottom={-100}
          position={[6, 25, -9]}
        />
        <Suspense fallback={null}>
          <AppProvider>
            <Camera zoom={zoom} />
            <Player
              isModal={isPopup}
              setIsModal={updateCollection}
              isSound={isSound}
              envSound={envSound}
              setEnvSound={setEnvSound}
              setCheckpoint={setCheckpoint}
              action={stateValtio.action}
              zoom={zoom}
              setZoom={setZoom}
            />

            {stateValtio.checkpoints.map(({position, number, collected}) => (
              <Checkpoint
                url='./resources/beat-loop.mp3'
                isSound={isSound}
                position={position}
                key={number}
                collected={collected}
              />
            ))}
            <Scene shadows checkpoint={checkpoint} isModal={isPopup} />
          </AppProvider>
        </Suspense>
      </Canvas>
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
      <div className='action-wrapper'>
        <div
          data-w-id='87254fef-9926-84f7-c31f-da8b1d44c269'
          className='menu-button'
          onClick={() => setIsPopup(!isPopup)}
        >
          <img
            src='https://assets.website-files.com/6282420c2cbddcf359590b7f/62836feea64a178412ff6c72_menu-icon.svg'
            loading='lazy'
            alt=''
          />
        </div>
        <div
          data-w-id='eb0a3834-ea05-fb73-d87f-6eb0e88e9c3a'
          className='sound-button'
          onClick={() => setIsSound(!isSound)}
        >
          {isSound ? (
            <img
              src='https://assets.website-files.com/6282420c2cbddcf359590b7f/6283702364d42c4cc5c626ec_sound-on-icon.svg'
              loading='eager'
              alt=''
              className='sound-on'
            />
          ) : (
            <img
              src='https://assets.website-files.com/6282420c2cbddcf359590b7f/62838d2b392a0881467b57bf_sound-off-icon.svg'
              loading='eager'
              alt=''
              className='sound-off'
            />
          )}
        </div>
        <div
          data-w-id='b16b36d1-ec18-bcb7-74ff-5e02b9763e29'
          className='open-form'
          onClick={() => setIsFinished(!isFinished)}
        >
          <img
            src='https://assets.website-files.com/6282420c2cbddcf359590b7f/62838dce99bfd3b16f07d95d_Favicon.png'
            loading='lazy'
            width='16'
            alt=''
          />
        </div>
      </div>
    </>
  );
};

export default Stage1;
