import {OrthographicCamera} from '@react-three/drei';
import {extend, useFrame, useThree} from '@react-three/fiber';
import CameraControls from 'camera-controls';
import React, {useContext, useEffect, useRef, useMemo, useState} from 'react';
import {Vector3} from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {AppStateContext, AppDispatchContext} from '../../context/AppContext';
import {Actions} from '../../reducer/AppReducer';
import * as THREE from 'three';

// Extend will make OrbitControls available as a JSX element called orbitControls for us to use.
extend({OrbitControls});


const Camera = ({zoom}) => {
  const {gl, camera} = useThree();
  const {dispatch} = useContext(AppDispatchContext);
  const {state} = useContext(AppStateContext);
  const cameraRef = useRef();
  const controlsRef = useRef();


  useEffect(() => {
    let camera = cameraRef.current;
    gl.camera = camera;
    const controls = controlsRef.current;
    controls.maxPolarAngle = Math.PI / 4;
    controls.minDistance = 15;
    controls.maxDistance = 50;

    // camera.fov = 75;
    // camera.aspect = window.innerWidth / window.innerHeight;
    // camera.near = 0.9;
    // camera.far = 20;
    // camera.position.set(10, 50, 50);
    // camera.position.sub(controls.target);
    dispatch({type: Actions.UPDATE_CONTROLS, payload: controls});
    dispatch({type: Actions.UPDATE_CAMERA, payload: camera});
  }, [gl]);

  useFrame((stateThree) => {
    if (zoom) {
      state.camera.zoom = THREE.MathUtils.lerp(2, 3, 3, 1);
    } else {
      state.camera && (state.camera.zoom = 44);
    }
  });

  return (
    <React.Fragment>
      <orbitControls args={[camera, gl.domElement]} ref={controlsRef} />
      {/* <OrthographicCamera
        ref={cameraRef}
        camera={state.camera}
        makeDefault
        castShadow={true}
        receiveShadow={true}
        zoom={45}
        // top={364}
        // bottom={-364}
        // left={-488}
        // right={488}
        near={2}
        far={2000}
        position={[22, 27, 26]}
      /> */}
      <OrthographicCamera
        name='Personal Camera'
        makeDefault={true}
        zoom={44}
        far={100000}
        near={-100000}
        up={[0, 1000, 0]}
        castShadow={true}
        receiveShadow={true}
        position={[36.97, 91.22, 112.58]}
        rotation={[-0.68, 0.61, 0.44]}
      />
    </React.Fragment>
  );
};

export default Camera;
