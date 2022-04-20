import { useFrame, useThree } from "@react-three/fiber";
import React, { useEffect, useRef, useState } from "react";
import { Clock } from "three";
import { Vector3 } from "three";
import { Line3 } from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const Player = () => {
  const { controls } = useThree();

  const meshRef = useRef();
  const speed = 10;
  const [fwdPressed, setFwdPressed] = useState(false);
  const [bkdPressed, setBkdPressed] = useState(false);
  const [lftPressed, setLftPressed] = useState(false);
  const [rgtPressed, setRgtPressed] = useState(false);
  const [isOnGround, setIsOnGround] = useState(false);
  const [vector, setVector] = useState(new Vector3());
  const [upVector, setUpVector] = useState(new Vector3(0, 1, 0));
  const [velocity, setVelocity] = useState(new Vector3());

  useEffect(() => {
    meshRef.capsuleInfo = {
      radius: 0.5,
      segment: new Line3(new Vector3, new Vector3(0, -1.0, 0.0))
    }

    meshRef.castShadow = true;
    meshRef.receiveShadow = true;
  });

  useFrame(() => {
    // movePlayer();
  })

  const movePlayer = () => {
    let angle = controls.getAzimuthalAngle();
    let gravity = -30;
    let clock = new Clock();
    let delta = Math.min(clock.getDelta(), 0.1);

    if (fwdPressed) {
      vector.set(0, 0, -1).applyAxisAngle(upVector, angle);
      meshRef.position.addScaledVector(vector, speed * delta);
    }

    if (bkdPressed) {
      vector.set(0, 0, 1).applyAxisAngle(upVector, angle);
      meshRef.position.addScaledVector(vector, speed * delta);
    }

    if (lftPressed) {
      vector.set(-1, 0, 0).applyAxisAngle(upVector, angle);
      meshRef.position.addScaledVector(vector, speed * delta);
    }

    if (rgtPressed) {
      vector.set(1, 0, 0).applyAxisAngle(upVector, angle);
      meshRef.position.addScaledVector(vector, speed * delta);
    }

    velocity.y += isOnGround ? 0 : delta * gravity;
    meshRef.position.addScaledVector(velocity, delta);
    meshRef.updateMatrixWorld();

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
  }

  return (
    <mesh ref={meshRef} attach="geometry" translate={[0, -0.5, 0]}>
      <boxGeometry width={1.0} height={2.0}
        depth={1.0} segments={10} radius={0.5}
      />
      <meshStandardMaterial attach="material" />
    </mesh>
  )
}

export default Player;