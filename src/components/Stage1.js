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
import EnvSound from './three/EnvSound';
import {Html, Stars, useProgress} from '@react-three/drei';
import {ACESFilmicToneMapping} from 'three';

function Loader() {
  const {active, progress, errors, item, loaded, total} = useProgress();
  const [style, setStyle] = React.useState({});

  setTimeout(() => {
    const newStyle = {
      opacity: 1,
      width: `${progress}%`,
    };

    setStyle(newStyle);
  }, 200);
  return (
    <Html center>
      <div className='progress'>
        <div className='progress-done' style={style}></div>
      </div>
    </Html>
  );
}

export const Stage1 = () => {
  const {state} = useContext(AppStateContext);
  const [zoom, setZoom] = useState(false);
  const [isSound, setIsSound] = useState(false);
  const [envSound, setEnvSound] = useState(false);
  const [isPopup, setIsPopup] = useState(false);
  const [checkpoint, setCheckpoint] = useState(null);
  const [isFinished, setIsFinished] = useState(false);
  const [isCollection, setIsCollection] = useState(false);
  const [isHome, setIsHome] = useState(!true);
  const [track, setTrack] = useState('');

  useEffect(() => {
    if (!checkpoint) return;
    const collectedCheckpoints = stateValtio.checkpoints.filter(
      (check) => check.collected
    );
    if (collectedCheckpoints.length === 10) {
      setIsFinished(true);
      setIsPopup(false);
    }
    const gameProgress = localStorage.getItem('EA_checkpoints');
    if (gameProgress) {
      const parsedData = JSON.parse(gameProgress);
      const updatedData = [...parsedData, checkpoint];
      localStorage.setItem('EA_checkpoints', JSON.stringify(updatedData));
    } else {
      localStorage.setItem('EA_checkpoints', JSON.stringify([checkpoint]));
    }
  }, [checkpoint]);

  useEffect(() => {
    const gameProgress = JSON.parse(localStorage.getItem('EA_checkpoints'));
    if (gameProgress) {
      const ids = new Set(gameProgress.map(({number}) => number));
      stateValtio.collection = gameProgress;
      stateValtio.checkpoints.map((check) => {
        if (ids.has(check.number)) {
          check.collected = true;
        }
      });
    }
  }, []);

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
      <EnvSound isSound={isSound} track={track} />
      <Canvas flat shadows gl={{logarithmicDepthBuffer: true}} dpr={[1, 2]}>
        <ambientLight intensity={0.6} />
        <directionalLight
          // layers={[2]}
          name='Directional Light'
          castShadow
          intensity={0.5}
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={400}
          shadow-camera-left={-100}
          shadow-camera-right={100}
          shadow-camera-top={100}
          shadow-camera-bottom={-100}
          position={[6, 25, -9]}
          shadow-bias={-0.0005}
        />
        <Suspense fallback={<Loader />}>
          <AppProvider>
            <Stars />
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
              setTrack={setTrack}
            />

            {stateValtio.checkpoints.map(({position, number, collected}) => (
              <Checkpoint
                // url='./resources/beat-loop.mp3'
                isSound={isSound}
                position={position}
                key={number}
                collected={collected}
              />
            ))}
            <Scene checkpoint={checkpoint} isModal={isPopup} />
          </AppProvider>
        </Suspense>
      </Canvas>
      <div className='action-wrapper'>
        {/* <div
          data-w-id='87254fef-9926-84f7-c31f-da8b1d44c269'
          className='menu-button'
          onClick={() => setIsPopup(!isPopup)}
        >
          <img
            src='https://assets.website-files.com/6282420c2cbddcf359590b7f/62836feea64a178412ff6c72_menu-icon.svg'
            loading='lazy'
            alt=''
          />
        </div> */}
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
