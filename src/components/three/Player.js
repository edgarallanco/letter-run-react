import {useFrame, useThree} from '@react-three/fiber';
import React, {useContext, useEffect, useRef, useState} from 'react';
import {Clock} from 'three';
import {Vector3, Box3, Matrix4, Line3} from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {AppStateContext, AppDispatchContext} from 'context/AppContext';
import {Actions} from 'reducer/AppReducer';
import {useTrimesh} from '@react-three/cannon';

const Player = () => {
  const {state} = useContext(AppStateContext);
  const {dispatch} = useContext(AppDispatchContext);
  const {scene, camera} = useThree();

  const meshRef = useRef();
  const speed = 10;
  const [fwdPressed, setFwdPressed] = useState(false);
  const [bkdPressed, setBkdPressed] = useState(false);
  const [lftPressed, setLftPressed] = useState(false);
  const [rgtPressed, setRgtPressed] = useState(false);
  const [isOnGround, setIsOnGround] = useState(true);
  const [vector, setVector] = useState(new Vector3());
  const [upVector, setUpVector] = useState(new Vector3(0, 1, 0));
  const [velocity, setVelocity] = useState(new Vector3());
  const [player, setPlayer] = useState();

  useEffect(() => {
    if (!state.controls) return;

    meshRef.current.capsuleInfo = {
      radius: 0.5,
      segment: new Line3(new Vector3(), new Vector3(0, -1.0, 0.0)),
      mass: 400,
      material: {
        friction: 0,
      },
    };

    meshRef.current.geometry.translate(0, -0.5, 0);
    meshRef.current.castShadow = true;
    meshRef.current.receiveShadow = true;
    meshRef.current.position.set(-38, 8, 1);

    console.log(meshRef.current.position);

    // velocity.set(0, 0, 0);
    setVelocity(velocity);
    camera.position.sub(state.controls.target);
    state.controls.target.copy(meshRef.current.position);
    camera.position.add(meshRef.current.position);
    scene.add(meshRef.current);
    state.controls.update();
    setPlayer(meshRef.current);

    registerEvents();
  }, [state.controls]);

  useFrame((stateCanvas, delta) => {
    movePlayer(Math.min(delta, 0.1), state.collider);
  });

  const movePlayer = (delta, collider) => {
    if (!state.controls) return;

    let player = meshRef.current;
    let angle = state.controls.getAzimuthalAngle();
    let gravity = -30;

    if (fwdPressed) {
      vector.set(0, 0, -1).applyAxisAngle(upVector, angle);
      player.position.addScaledVector(vector, speed * delta);
      // player.position.set(38, 15, 10);
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

    // check how much the collider was moved
    // deltaVector.subVectors(newPosition, meshRef.position);
    player.updateMatrixWorld();

    let tempVector = new Vector3();
    let tempVector2 = new Vector3();
    let tempBox = new Box3();
    let tempMat = new Matrix4();
    let tempSegment = new Line3();
    const deltaVector = tempVector2;

    // adjust player position based on collisions
    const capsuleInfo = player.capsuleInfo;
    tempBox.makeEmpty();
    tempMat.copy(collider.matrixWorld).invert();
    tempSegment.copy(capsuleInfo.segment);

    // get the position of the capsule in the local space of the collider
    tempSegment.start.applyMatrix4(player.matrixWorld).applyMatrix4(tempMat);
    tempSegment.end.applyMatrix4(player.matrixWorld).applyMatrix4(tempMat);

    // get the axis aligned bounding box of the capsule
    tempBox.expandByPoint(tempSegment.start);
    tempBox.expandByPoint(tempSegment.end);

    tempBox.min.addScalar(-capsuleInfo.radius);
    tempBox.max.addScalar(capsuleInfo.radius);

    collider.geometry.boundsTree.shapecast({
      intersectsBounds: (box) => box.intersectsBox(tempBox),

      intersectsTriangle: (tri) => {
        // check if the triangle is intersecting the capsule and adjust the
        // capsule position if it is.
        const triPoint = tempVector;
        const capsulePoint = tempVector2;

        const distance = tri.closestPointToSegment(
          tempSegment,
          triPoint,
          capsulePoint
        );
        if (distance < capsuleInfo.radius) {
          const depth = capsuleInfo.radius - distance;
          const direction = capsulePoint.sub(triPoint).normalize();

          tempSegment.start.addScaledVector(direction, depth);
          tempSegment.end.addScaledVector(direction, depth);
        }
      },
    });

    // get the adjusted position of the capsule collider in world space after checking
    // triangle collisions and moving it. capsuleInfo.segment.start is assumed to be
    // the origin of the player model.
    const newPosition = tempVector;
    newPosition.copy(tempSegment.start).applyMatrix4(collider.matrixWorld);

    // check how much the collider was moved
    deltaVector.subVectors(newPosition, player.position);

    // if the player was primarily adjusted vertically we assume it's on something we should consider ground
    setIsOnGround(deltaVector.y > Math.abs(delta * velocity.y * 0.25));

    const offset = Math.max(0.0, deltaVector.length() - 1e-5);
    deltaVector.normalize().multiplyScalar(offset);

    // adjust the player model
    player.position.add(deltaVector);

    // if the player was primarily adjusted vertically we assume it's on something we should consider ground
    let onGround = deltaVector.y > Math.abs(delta * velocity.y * 0.25);
    setIsOnGround(onGround);

    if (!isOnGround) {
      deltaVector.normalize();
      velocity.addScaledVector(deltaVector, -deltaVector.dot(velocity));
    } else {
      velocity.set(0, 0, 0);
    }

    camera.position.sub(state.controls.target);
    state.controls.target.copy(player.position);
    camera.position.add(player.position);
    setVelocity(velocity);

    dispatch({type: Actions.UPDATE_CONTROLS, payload: state.controls});
    setPlayer(player);
    // dispatch({ type: Actions.UPDATE_CAMERA, payload: camera});
  };

  const registerEvents = () => {
    window.addEventListener(
      'keydown',
      (e) => {
        // console.log('keydown', player.getPosition());
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
      {passive: true}
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
      {passive: true}
    );
  };

  return (
    <mesh ref={meshRef} position={player ? player.position : [-38, 15, 10]}>
      <boxGeometry
        width={1.0}
        height={2.0}
        depth={1.0}
        segments={10}
        radius={0.5}
        mass={400}
        mate
      />
      <meshStandardMaterial attach='material' />
    </mesh>
  );
};

export default Player;
