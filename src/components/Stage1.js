import React, { useContext, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import Camera from 'components/three/Camera';
import Player from 'components/three/Player';
import Scene from 'components/three/Scene';
import { AppProvider } from 'context/AppContext';
import Checkpoint from './three/Checkpoint';
import { AppStateContext } from 'context/AppContext';
import stateValtio from 'context/store';
import Finish from './UI/Finish';
import Home from './UI/Home';
import EnvSound from './three/EnvSound';
import LetterSound from './three/LetterSound';
import { Html, Stars, useProgress } from '@react-three/drei';
import GlobalVars from 'src/components/globalVar';
import { findRenderedDOMComponentWithClass } from 'react-dom/test-utils';

const Loader = ({ setHasLoaded, setMoveToStart }) => {
  const { active, progress, errors, item, loaded, total } = useProgress();
  const [style, setStyle] = useState({});

  // setTimeout(() => {
  // const newStyle = {
  //   opacity: 1,
  //   width: `${progress}%`,
  // };
  // console.log(progress)¸
  if (progress === 100)
    setHasLoaded(true);

  // setStyle(newStyle);
  // }, 200);
  useEffect(() => {
    const newStyle = {
      opacity: 1,
      width: `100%`,
    };
    // test lottie playback
    //lottie1.playSegments([progress, progress + 1], true)
    //console.log(progress + "is current progress frame")
    console.log(loaded + " is the loaded amount")
    if (loaded >= 29) {
      completedTrigger = true;
      //console.log('loaded is 30!')
      var newEvent = new Event('completed');
      window.dispatchEvent(newEvent);
      /* lottie2.onComplete = function () {
        console.log('complete!');
        document.getElementById('preload-wrapper').classList.add('gc-hide');
        console.log('hide fired')
      } */
      var lottieToggle = false;
      setTimeout(function() {
        setMoveToStart(true)
      },6000)
      
      /* lottie2.addEventListener('enterFrame', function() {
        console.log('lottie 2 playing')
        if ((lottie2.currentFrame >= (lottie2.totalFrames - 5) && !lottieToggle)){
          lottieToggle = true;
          console.log('threshold hit, start now')
          setMoveToStart(true)
      }}) */
      
    }
    // console.log(total);
    if (progress === 100) {
      setHasLoaded(true);
      // setMoveToStart(true);
      /*  console.log('totally loaded')
       console.log("item = "+item);
       console.log("total = "+total);
       console.log("loaded = "+loaded); */

    }

    setStyle(newStyle);
  }, [progress])



  return (
    <Html center>
      <div className='progress'>
        <div className='progress-done' style={style}></div>
      </div>
    </Html>
  );
}

export const Stage1 = () => {
  const { state } = useContext(AppStateContext);
  const [zoom, setZoom] = useState(false);
  const [isSound, setIsSound] = useState(false);
  const [envSound, setEnvSound] = useState(false);
  const [isPopup, setIsPopup] = useState(false);
  const [checkpoint, setCheckpoint] = useState(null);
  const [isFinished, setIsFinished] = useState(false);
  const [isCollection, setIsCollection] = useState(false);
  const [isInLetter, setIsInLetter] = useState(false);
  const [isHome, setIsHome] = useState(!true);
  const [track, setTrack] = useState('');
  const [isPlaying, setIsplaying] = useState(false);
  const [introDone, setIntroDone] = useState(false);
  const [moveToStart, setMoveToStart] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [hideTutorial, setHideTutorial] = useState(false);

  const addSoundListener = (isSound, setIsSound) => {
    //console.log("adding sound listener")
    var dom = document.getElementById("snd_btn");
    var offBtn = document.getElementById('trigger_6');
    if (dom)
      dom.addEventListener("click", () => {
        //console.log("isSound = ", isSound);
        //
        setIsSound(true);
        soundToggle = true;
      })
    if (offBtn)
      offBtn.addEventListener("click", () => {
        //console.log("isSound = ", isSound);
        //
        setIsSound(false);
        soundToggle = false;
      })
  }

  const registerClickListener = () => {
    soundButtonStart.addEventListener('click', function () {
      currentlyPlaying = true;
      setIsplaying(true);
      playerVis = true;
      intro_closer.click();
      soundButton.click();
      setTimeout(function(){
        inst_trigger.click();
      },1000)
      
    })

    startBtn.addEventListener('click', function () {
      currentlyPlaying = true;
      setIsplaying(true);
      playerVis = true;
      intro_closer.click();
      setTimeout(function(){
        inst_trigger.click();
      },1000)
    })
  }

  useEffect(() => {
    //console.log("isSound = ", isSound);
  }, [isSound])

  useEffect(() => {
    if(introDone) {
      intro_trigger.click();
    }
  }, [introDone]);


  useEffect(() => {
    if (!checkpoint) return;
    const collectedCheckpoints = stateValtio.checkpoints.filter(
      (check) => check.collected
    );
    if (collectedCheckpoints.length === 10) {
      setIsFinished(true);
      setIsPopup(false);
      formOpen.click();
      standardIcon.classList.add('gc-hide');
      partyPopper.classList.remove('gc-hide');
      finalContent.classList.remove('gc-hide');
      aboutContent.classList.add('gc-hide');
      innerExpander.click();
      startConfetti();
      setTimeout(function() {
        stopConfetti();
      },5000)
    }
    const gameProgress = localStorage.getItem('EA_checkpoints');
    if (gameProgress) {
      const parsedData = JSON.parse(gameProgress);
      const updatedData = [...parsedData, checkpoint];
      localStorage.setItem('EA_checkpoints', JSON.stringify(updatedData));
    } else {
      localStorage.setItem('EA_checkpoints', JSON.stringify([checkpoint]));
    }
    // console.log("Checkpoint is:", checkpoint);
    UpdateItems(checkpoint.item_id, true);
    menuOpen.click();
    collectedItems.innerText = collectedCheckpoints.length + " of 10 items";
    //itemHeader.innerText = checkpoint.item_headline;
    //itemLabel.innerText = checkpoint.item_body_copy;
  }, [checkpoint]);

  useEffect(() => {
    addSoundListener(isSound, setIsSound);
    registerClickListener();
    //console.log('listener instantiated')
    const gameProgress = JSON.parse(localStorage.getItem('EA_checkpoints'));
    if (gameProgress) {
      const ids = new Set(gameProgress.map(({ number }) => number));
      stateValtio.collection = gameProgress;
      stateValtio.checkpoints.map((check) => {
        if (ids.has(check.number)) {
          check.collected = true;
        }
      });
    }
  }, []);

  const updateCollection = (open) => {
    setIsCollection(open);
    setIsPopup(open);
  };

  return (
    <>
      {isHome && <Home setIsHome={() => setIsHome(false)} />}
      {/* {!isPlaying && hasLoaded && introDone && <Intro setIsplaying={setIsplaying} />} */}
      <Finish
        isFinished={isFinished}
        setIsFinished={() => setIsFinished(false)}
        isCollection={isCollection}
      />
      {/* <PopUp
        isPopup={isPopup}
        setIsPopup={() => setIsPopup(false)}
        isCollection={isCollection}
        setIsCollection={() => setIsCollection(false)}
      /> */}
      <EnvSound isSound={isSound} track={track} isInLetter={isInLetter} />
      <LetterSound isSound={isSound} track={track} isInLetter={isInLetter} />
      <Canvas flat shadows gl={{ logarithmicDepthBuffer: true }} dpr={[1, 2]}>
        <ambientLight intensity={0.6} />
        <directionalLight
          // layers={[2]}
          name='Directional Light'
          castShadow
          intensity={0.4}
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={400}
          shadow-camera-left={-100}
          shadow-camera-right={100}
          shadow-camera-top={100}
          shadow-camera-bottom={-100}
          position={[6, 25, -9]}
          shadow-bias={-0.0005}
        // makeDefault={true}
        />
        <spotLight
          intensity={0.5}
          position={[300, 300, 4000]}
          castShadow={false}
        />
        <Suspense fallback={<Loader setHasLoaded={setHasLoaded} setMoveToStart={setMoveToStart} />}>
          <AppProvider>
            <Camera zoom={zoom} />
            <Player
              isModal={isPopup}
              setIsModal={updateCollection}
              setCheckpoint={setCheckpoint}
              action={stateValtio.action}
              zoom={zoom}
              setZoom={setZoom}
              track={track}
              setTrack={setTrack}
              setIsInLetter={setIsInLetter}
              isPlaying={isPlaying}
              setHideTutorial={setHideTutorial}
            />

            {stateValtio.checkpoints.map(({ position, number, collected }) => (
              <Checkpoint
                position={position}
                key={number}
                collected={collected}
              />
            ))}
            <Scene checkpoint={checkpoint} isModal={isPopup}
              hideTutorial={hideTutorial}
              isPlaying={isPlaying}
              setIsplaying={setIsplaying}
              moveToStart={moveToStart}
              introDone={introDone}
              setIntroDone={setIntroDone}
              setZoom={setZoom}
              setModal={updateCollection} />
          </AppProvider>
        </Suspense>
      </Canvas>
      {/* <div className='action-wrapper'>
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
      </div> */}
    </>
  );
};


export default Stage1;
