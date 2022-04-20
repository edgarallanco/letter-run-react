import { useThree } from "@react-three/fiber";
import React, { useEffect } from "react";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const Camera = () => {
  const { camera, gl } = useThree();

  useEffect(() => {
    const controls = new OrbitControls(camera, gl.domElement);
    controls.maxPolarAngle = Math.PI / 2;
    controls.minDistance = 1;
    controls.maxDistance = 20;

    camera.fov = 75;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.near = 0.1;
    // camera.far = 20;
    camera.position.set(10, 50, 50);
    camera.position.sub(controls.target);

  }, [camera, gl]);

  return null;
}

export default Camera;