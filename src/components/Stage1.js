import React, {useRef} from 'react';
import {Canvas} from '@react-three/fiber';
import {Suspense} from 'react';
import Camera from 'components/three/Camera';
import Player from 'components/three/Player';
import Scene from 'components/three/Scene';
import {AppProvider} from 'context/AppContext';

export const Stage1 = () => {
  return (
    <Canvas>
      <Suspense fallback={null}>
        <AppProvider>
          <Player />
          <Camera />
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
          <Scene />
        </AppProvider>
      </Suspense>
    </Canvas>
  );
};

export default Stage1;
