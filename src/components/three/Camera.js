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
// extend({OrbitControls, MapControls});

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
    const controls = controlsRef.current;
    dispatch({ type: Actions.UPDATE_CONTROLS, payload: controls });
    dispatch({ type: Actions.UPDATE_CAMERA, payload: camera });

    // update camera and render on window resize
    // const fov = 50;
    // const planeAspectRatio = 16 / 9;

    // window.addEventListener('resize', () => {
    //   camera.aspect = window.innerWidth / window.innerHeight;

    //   if (camera.aspect > planeAspectRatio) {
    //     // window too narrow
    //     console.log("indow too narrow");
    //     camera.fov = fov;
    //   } else {
    //     // window too large
    //     console.log("indow too large");
    //     const cameraHeight = Math.tan(MathUtils.degToRad(fov / 2));
    //     const ratio = camera.aspect / planeAspectRatio;
    //     const newCameraHeight = cameraHeight / ratio;
    //     camera.fov = MathUtils.radToDeg(Math.atan(newCameraHeight)) * 2;
    //     console.log(camera.fov);
    //   }
    // })
    console.log(window.screen.availWidth);
    // if (window.screen.width >= 1920) {
    //   camera.fov = 75;
    //   camera.position.y = camera.position.y - 20;
    // } else {
    //   camera.fov = 50;
    //   camera.position.y = camera.position.y + 20;
    // }
    // camera.aspect = window.innerWidth / window.innerHeight;
    window.addEventListener('resize', () => {
      // console.log(window.screen.width);
      /* if (window.screen.width >= 1920) {
        camera.fov = 75;
        // camera.position.y = camera.position.y - 20;
      } else {
        camera.fov = 50;
        // camera.position.y = camera.position.y + 20;
      } */
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      // console.log(camera.fov);
      gl.setSize(window.innerWidth, window.innerHeight);
      dispatch({ type: Actions.UPDATE_CAMERA, payload: camera });
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

  useFrame(({ controls }) => (controls.target = state?.playerMesh.position));

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
        minDistance={100}
        maxDistance={600}
        minPolarAngle={Math.PI / 5}
        args={[camera, gl.domElement]}
        ref={controlsRef}
        makeDefault={true}
        maxPolarAngle={Math.PI / 2.5}
        maxAzimuthAngle={Math.PI / 2.8}
        minAzimuthAngle={-Math.PI / 0.52}
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
