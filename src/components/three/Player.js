import { useFrame, useThree } from "@react-three/fiber";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Clock } from "three";
import { Vector3 } from "three";
import { Line3 } from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { AppStateContext, AppDispatchContext } from 'context/AppContext';
import { Actions } from "reducer/AppReducer";

const Player = () => {
  const { state } = useContext(AppStateContext);
  const { dispatch } = useContext(AppDispatchContext);
  const { scene, camera } = useThree();

  const meshRef = useRef();
  const speed = 10;
  const clock = new Clock();
  const delta = Math.min(clock.getDelta(), 0.1);
  const [fwdPressed, setFwdPressed] = useState(false);
  const [bkdPressed, setBkdPressed] = useState(false);
  const [lftPressed, setLftPressed] = useState(false);
  const [rgtPressed, setRgtPressed] = useState(false);
  const [isOnGround, setIsOnGround] = useState(false);
  const [vector, setVector] = useState(new Vector3());
  const [upVector, setUpVector] = useState(new Vector3(0, 1, 0));
  const [velocity, setVelocity] = useState(new Vector3());
  const [player, setPlayer] = useState();

  useEffect(() => {
    if (!state.controls)
      return;


    meshRef.current.capsuleInfo = {
      radius: 0.5,
      segment: new Line3(new Vector3, new Vector3(0, -1.0, 0.0))
    }

    meshRef.current.geometry.translate(0, -0.5, 0);
    meshRef.current.castShadow = true;
    meshRef.current.receiveShadow = true;
    meshRef.current.position.set(-38, 15, 10);
    velocity.set(0, 0, 0);
    setVelocity(velocity);
    camera.position.sub(state.controls.target);
    state.controls.target.copy(meshRef.current.position);
    camera.position.add(meshRef.current.position);
    scene.add(meshRef.current);
    state.controls.update();
    setPlayer(meshRef.current);

    registerEvents();
  }, []);

  useFrame((state) => {
    movePlayer();
  })

  const movePlayer = () => {
    if (!state.controls)
      return;

    let player = meshRef.current;
    let angle = state.controls.getAzimuthalAngle();
    let gravity = -30;

    if (fwdPressed) {
      vector.set(0, 0, -1).applyAxisAngle(upVector, angle);
      player.position.addScaledVector(vector, speed * delta);
      player.position.set(38, 15, 10);
      console.log(player.position);
      setVector(vector);
    }

    if (bkdPressed) {
      vector.set(0, 0, 1).applyAxisAngle(upVector, angle);
      player.position.addScaledVector(vector, speed * delta);
      setVector(vector);
    }

    if (lftPressed) {
      vector.set(-1, 0, 0).applyAxisAngle(upVector, angle);
      player.position.addScaledVector(vector, speed * delta);
      setVector(vector);
    }

    if (rgtPressed) {
      vector.set(1, 0, 0).applyAxisAngle(upVector, angle);
      player.position.addScaledVector(vector, speed * delta);
      setVector(vector);
    }

    velocity.y += isOnGround ? 0 : delta * gravity;
    player.position.addScaledVector(velocity, delta);
    player.updateMatrixWorld();

    let tempVector2 = new Vector3();
    // check how much the collider was moved
    const deltaVector = tempVector2;
    // deltaVector.subVectors(newPosition, meshRef.position);

    // if the player was primarily adjusted vertically we assume it's on something we should consider ground
    let onGround = deltaVector.y > Math.abs(delta * velocity.y * 0.25);
    setIsOnGround(onGround);

    if (!isOnGround) {
      deltaVector.normalize();
      velocity.addScaledVector(
        deltaVector,
        -deltaVector.dot(velocity)
      );
    } else {
      velocity.set(0, 0, 0);
    }

    camera.position.sub(state.controls.target);
    state.controls.target.copy(player.position);
    camera.position.add(player.position);
    setVelocity(velocity);

    dispatch({ type: Actions.UPDATE_CONTROLS, payload: state.controls });
    setPlayer(player);
    // dispatch({ type: Actions.UPDATE_CAMERA, payload: camera});
  }

  const registerEvents = () => {
    window.addEventListener(
      'keydown',
      (e) => {
        // console.log('keydown', this.getPosition());
        switch (e.code) {
          case 'ArrowUp':
            setFwdPressed(true);
            break;
          case 'ArrowDown':
            setBkdPressed(true);
            break;
          case 'ArrowRight':
            setRgtPressed(true);
            break;
          case 'ArrowLeft':
            setLftPressed(true);
            break;
          case 'Space':
            if (isOnGround) {
              velocity.y = 10.0;
              setVelocity(velocity);
            }

            break;
        }
      },
      { passive: true }
    );

    window.addEventListener(
      'keyup',
      (e) => {
        // console.log("keyup", e.code);
        switch (e.code) {
          case 'ArrowUp':
            setFwdPressed(false);
            break;
          case 'ArrowDown':
            setBkdPressed(false);
            break;
          case 'ArrowRight':
            setRgtPressed(false);
            break;
          case 'ArrowLeft':
            setLftPressed(false);
            break;
        }
      },
      { passive: true }
    );
  };

  return (
    <mesh ref={meshRef} position={player ? player.position : [-38, 15, 10]}>
      <boxGeometry width={1.0} height={2.0}
        depth={1.0} segments={10} radius={0.5}
      />
      <meshStandardMaterial attach="material" />
    </mesh>
  )
}

export default Player;