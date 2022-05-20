import {OrthographicCamera} from '@react-three/drei';
import {extend, useFrame, useThree} from '@react-three/fiber';
import React, {useContext, useEffect, useRef} from 'react';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {AppStateContext, AppDispatchContext} from '../../context/AppContext';
import {Actions} from '../../reducer/AppReducer';

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
    controls.enabled = false;
    controls.enableDamping = false;
    controls.enablePan = false;
    controls.enableRotate = false;
    controls.enableZoom = false;

    // camera.fov = 75;
    // camera.aspect = window.innerWidth / window.innerHeight;
    // camera.near = 0.9;
    // camera.far = 20;
    // camera.position.set(10, 50, 50);
    // camera.position.sub(controls.target);
    dispatch({type: Actions.UPDATE_CONTROLS, payload: controls});
    dispatch({type: Actions.UPDATE_CAMERA, payload: camera});
    console.log(controls, state.camera);
  }, [gl]);

  useFrame((stateThree) => {
    if (zoom) {
      state.camera.zoom = 12;
    } else {
      state.camera && (state.camera.zoom = 44);
    }
  });

  return (
    <>
      <orbitControls
        disabled
        args={[camera, gl.domElement]}
        ref={controlsRef}
      />
      <OrthographicCamera
        name='Personal Camera'
        makeDefault={true}
        zoom={44}
        far={100000}
        near={-100000}
        up={[0, 1000, 0]}
        castShadow={true}
        receiveShadow={true}
        position={[95.35, 124.37, 142.58]}
      />
    </>
  );
};

export default Camera;
