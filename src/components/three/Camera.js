import { PerspectiveCamera, OrbitControls } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { easings, useSpring } from 'react-spring';
import { MathUtils, Vector3 } from 'three';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min';
import { AppStateContext, AppDispatchContext } from '../../context/AppContext';
import { Actions } from '../../reducer/AppReducer';
import * as THREE from 'three';

// Extend will make OrbitControls available as a JSX element called orbitControls for us to use.
// extend({OrbitControls, MapControl});


const Camera = ({ zoom }) => {
  const { gl, camera, scene } = useThree();
  const { dispatch } = useContext(AppDispatchContext);
  const { state } = useContext(AppStateContext);
  const cameraRef = useRef();
  const controlsRef = useRef();
  const [zoomPressed, setZoomPressed] = useState(true);

  useEffect(() => {
    if (zoom) {
      setZoomPressed(true);
    }
  }, [zoom]);

  useEffect(() => {
    // let camera = cameraRef.current;
    // gl.camera = camera;
    camera.position.set(0, 90, 0);
    const controls = controlsRef.current;
    dispatch({ type: Actions.UPDATE_CONTROLS, payload: controls });
    dispatch({ type: Actions.UPDATE_CAMERA, payload: camera });



    document.addEventListener('mousemove', (e) => {
      let scale = -0.01;
      // camera.rotateX(e.movementX * scale);
      // camera.rotateY(e.movementY * scale);
      // document.dispatchEvent(new Event("mousedown"));
      // console.log(e.movementX * scale);

      // camera.position.x = e.movementX * scale;
      // camera.position.z = e.movementY * scale;
      // dispatch({ type: Actions.UPDATE_CAMERA, payload: camera });
    });
  }, [gl]);

  const zoomAnim = useSpring({
    config: { duration: 1000, easing: easings.easeCubic },
    zoomProp: zoom ? 1 : 4.5,
  });

  const cameraPos = useSpring({
    config: { duration: 1000, easing: easings.linear },
    zoomProp: zoom ? new Vector3(10, 15, 10) : 12,
  });

  // useFrame(({ controls }) => {
  //   if (state?.playerMesh)
  //     controls.target = state?.playerMesh.position;
  //   dispatch({ type: Actions.UPDATE_CONTROLS, payload: controls });
  // });

  useFrame(({ camera }) => {
    // console.log(zoomAnim.zoomProp.animation.values);
    if (zoomAnim.zoomProp.animation.values[0]) {
      if (zoom) {
        camera.zoom = zoomAnim.zoomProp.animation.values[0]._value;
      } else if (zoomPressed) {
        if (camera.zoom <= 20)
          camera.zoom = zoomAnim.zoomProp.animation.values[0]._value;
        else
          setZoomPressed(false);
      }
    }
  });

  return (
    <>
      <OrbitControls
        minDistance={10}
        maxDistance={600}
        minPolarAngle={Math.PI / 5}
        args={[camera, gl.domElement]}
        ref={controlsRef}
        makeDefault={true}
        maxPolarAngle={Math.PI / 2.5}
        maxAzimuthAngle={Infinity}
        minAzimuthAngle={Infinity}
        enableZoom={true}
        enablePan={true}
      />

      <PerspectiveCamera
        name='Personal Camera'
        makeDefault={true}
        zoom={1}
        // far={100}
        // near={-100}
        // up={[0, 10000, 0]}
        aspect={window.screen.width / window.screen.height}
        fov={50}
        castShadow={true}
        receiveShadow={true}
        position={[0, 84.69169943749475, 0]}
      />
    </>
  );
};

export default Camera;
