import { extend, useThree } from "@react-three/fiber";
import React, { useContext, useEffect, useRef } from "react";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { AppStateContext, AppDispatchContext } from '../../context/AppContext';
import { Actions } from "../../reducer/AppReducer";
// Extend will make OrbitControls available as a JSX element called orbitControls for us to use.
extend({ OrbitControls });


const Camera = () => {
  const { gl, camera } = useThree();
  const { dispatch } = useContext(AppDispatchContext);
  const { state } = useContext(AppStateContext);
  const cameraRef = useRef();
  const controlsRef = useRef();

  useEffect(() => {

  });

  useEffect(() => {
    let camera = cameraRef.current;
    gl.camera = camera;
    const controls = controlsRef.current;
    controls.maxPolarAngle = Math.PI / 2;
    controls.minDistance = 1;
    controls.maxDistance = 20;

    camera.fov = 75;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.near = 0.1;
    // camera.far = 20;
    camera.position.set(10, 50, 50);
    camera.position.sub(controls.target);

    dispatch({ type: Actions.UPDATE_CONTROLS, payload: controls });
    dispatch({ type: Actions.UPDATE_CAMERA, payload: camera });

  }, [gl]);

  return (
    <React.Fragment>
      <orbitControls args={[camera, gl.domElement]} ref={controlsRef} />
      <perspectiveCamera ref={cameraRef} camera={state.camera} />
    </React.Fragment>
  )
}

export default Camera;