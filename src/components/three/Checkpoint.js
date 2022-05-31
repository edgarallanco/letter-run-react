import React, {useState, useEffect, useRef, useContext} from 'react';
import {useThree, useLoader} from '@react-three/fiber';
import * as THREE from 'three';
import {AppStateContext, AppDispatchContext} from 'context/AppContext';
import {Actions} from 'reducer/AppReducer';

function Checkpoint({url, position, isSound, collected}) {
  return (
    <>
      {!collected && (
        <mesh position={position}>
          <boxGeometry />
          <meshBasicMaterial color='hotpink' />
        </mesh>
      )}
    </>
  );
}

export default Checkpoint;
