import { PerspectiveCamera, OrbitControls } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { easings, useSpring } from 'react-spring';
import { MathUtils, Vector3 } from 'three';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min';
import { AppStateContext, AppDispatchContext } from '../../context/AppContext';
import { Actions } from '../../reducer/AppReducer';
import * as THREE from 'three';
import gsap from 'gsap';

// Extend will make OrbitControls available as a JSX element called orbitControls for us to use.
// extend({OrbitControls, MapControls});

const Camera = ({ zoom }) => {
  const { gl, camera, scene } = useThree();
  const { dispatch } = useContext(AppDispatchContext);
  const { state } = useContext(AppStateContext);
  const cameraRef = useRef();
  const controlsRef = useRef();
  const [zoomPressed, setZoomPressed] = useState(true);
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const [onClick, setOnClick] = useState(false);

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

    // document.addEventListener('mousemove', (e) => {
    //   let scale = -0.4;
    //   setMouseX(e.movementX * scale);
    //   setMouseY(e.movementY * scale);
    // });

    // document.addEventListener('mousedown', () => {
    //   setOnClick(true);
    // });

    // document.addEventListener('mouseup', () => {
    //   setOnClick(false);
    // });
  }, [gl]);

  const zoomAnim = useSpring({
    config: { duration: 1000, easing: easings.easeCubic },
    zoomProp: zoom ? 1 : 4.5,
  });

  const cameraPos = useSpring({
    config: { duration: 2000, easing: easings.easeCubic },
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
        if (camera.zoom <= 4.5)
          camera.zoom = zoomAnim.zoomProp.animation.values[0]._value;
        else
          setZoomPressed(false);
      }
    }

    if (state.controls) {
      // console.log(mouseX);
      if (mouseX !== 0 && mouseY !== 0 && !onClick) {
        // camera.position.x = camera.position.x + mouseX;
        // camera.position.y = camera.position.y + mouseY;
        let moveX = camera.position.x + mouseX;
        let moveZ = camera.position.z + mouseY;
        gsap.to(camera.position, {
          ease: "none", duration: 0.2, x: moveX, z: moveZ,
          onUpdate: () => {
            camera.lookAt(state.controls.target);
          }
        })
        setMouseX(0);
        setMouseY(0);
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
        maxPolarAngle={Math.PI / 2.25}
        maxAzimuthAngle={Math.PI / 1.25}
        minAzimuthAngle={-Math.PI / 0.52}
        enableZoom={true}
        enablePan={false}
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
