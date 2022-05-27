import {OrthographicCamera, PresentationControls} from '@react-three/drei';
import {extend, useFrame, useThree} from '@react-three/fiber';
import React, {useContext, useEffect, useRef} from 'react';
import {easings, useSpring} from 'react-spring';
import {
  OrbitControls,
  MapControls,
} from 'three/examples/jsm/controls/OrbitControls.js';
import {TWEEN} from 'three/examples/jsm/libs/tween.module.min';
import {AppStateContext, AppDispatchContext} from '../../context/AppContext';
import {Actions} from '../../reducer/AppReducer';

// Extend will make OrbitControls available as a JSX element called orbitControls for us to use.
extend({OrbitControls, MapControls});

const Camera = ({zoom}) => {
  const {gl, camera} = useThree();
  const {dispatch} = useContext(AppDispatchContext);
  const {state} = useContext(AppStateContext);
  const cameraRef = useRef();
  const controlsRef = useRef();

  useEffect(() => {
    // let camera = cameraRef.current;
    // gl.camera = camera;
    const controls = controlsRef.current;

    dispatch({type: Actions.UPDATE_CONTROLS, payload: controls});
    dispatch({type: Actions.UPDATE_CAMERA, payload: camera});
  }, [gl]);

  const zoomAnim = useSpring({
    config: {duration: 2000, easing: easings.easeCubic},
    zoomProp: zoom ? 10 : 44,
  });

  useFrame(({camera, clock}) => {
    if (zoom) {
      camera.zoom = zoomAnim.zoomProp.animation.values[0]._value;
    } else if (camera.zoom !== 44) {
      camera.zoom = zoomAnim.zoomProp.animation.values[0]._value;
    }
  });

  return (
    <>
      {/* <PresentationControls
        // disabled
        global
        zoom={0.8}
        rotation={[-1, -Math.PI / 4, 0]}
        polar={[0, Math.PI / 4]}
        azimuth={[-Math.PI / 4, Math.PI / 4]}
        args={[camera, gl.domElement]}
        ref={controlsRef}
      /> */}
      <mapControls
        ref={controlsRef}
        args={[camera, gl.domElement]}
        enableDamping={true}
        dampingFactor={0.05}
        minDistance={10}
        maxDistance={50}
        maxPolarAngle={Math.PI / 2}
      />
      {/* <orbitControls
        enableDamping
        dampingFactor={0.1}
        rotateSpeed={0.5}
        args={[camera, gl.domElement]}
        ref={controlsRef}
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
        position={[95.35, 124.37, 142.58]}
      />
    </>
  );
};

export default Camera;
