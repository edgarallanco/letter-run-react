import { useFrame, useThree } from '@react-three/fiber';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Vector3, Box3, Matrix4, Line3, Quaternion, Mesh, WireframeGeometry, MeshBasicMaterial, BoxGeometry } from 'three';
import { AppStateContext, AppDispatchContext } from 'context/AppContext';
import { Actions } from 'reducer/AppReducer';
import equal from 'fast-deep-equal';
import stateValtio from 'context/store';
import { useGLTF, useAnimations } from '@react-three/drei';
import { getDirectionOffset } from 'src/utils/directionalOffset';
import { pointInsideGeometry } from 'src/utils/pointInsideGeometry';
import checkpoints from 'src/resources/checkpoints';

const Player = ({
  setIsModal,
  isModal,
  setCheckpoint,
  setZoom,
  setTrack,
  track,
  setIsInLetter,
  isPlaying
}) => {
  const { state } = useContext(AppStateContext);
  const { dispatch } = useContext(AppDispatchContext);
  const { scene, camera, controls } = useThree();
  const meshRef = useRef();
  const [speed, setSpeed] = useState(1);
  const [jump, setJump] = useState(false);
  const [gravity, setGravity] = useState(isModal ? 0 : -30);
  const [fwdPressed, setFwdPressed] = useState(false);
  const [bkdPressed, setBkdPressed] = useState(false);
  const [lftPressed, setLftPressed] = useState(false);
  const [rgtPressed, setRgtPressed] = useState(false);
  const [jumpPressed, setJumpressed] = useState(false);
  const [isOnGround, setIsOnGround] = useState(true);
  const [vector, setVector] = useState(new Vector3());
  const [upVector, setUpVector] = useState(new Vector3(0, 0, 0));
  const [velocity, setVelocity] = useState(new Vector3());
  const [player, setPlayer] = useState();
  const [checkpointsMesh, setCheckpointMesh] = useState([]);
  const rotateAngle = new Vector3(0, 1, 0);
  const rotateQuarternion = new Quaternion();
  const { nodes, materials, animations } = useGLTF(
    'https://fargamot.s3.amazonaws.com/resources/EA_CharacterAnimated_v9.glb'
  );
  const { actions } = useAnimations(animations, meshRef);
  const previousAction = usePrevious(stateValtio.action);
  useEffect(() => {
    if (!state.controls) return;
    meshRef.current.capsuleInfo = {
      radius: 0.5,
      segment: new Line3(new Vector3(0, 0, 0), new Vector3(0, 3.5, 0))
    };
    // set the character facing the map
    meshRef.current.rotation.setFromVector3(new Vector3(0, Math.PI / 2, 0));
    velocity.set(0, 0, 0);
    setVelocity(velocity);
    camera.position.sub(state.controls.target);
    state.controls.target.copy(meshRef.current.position);
    camera.position.add(meshRef.current.position);
    scene.add(meshRef.current);
    state.controls.update();
    dispatch({ type: Actions.UPDATE_PLAYER_MESH, payload: meshRef.current });
    setPlayer(meshRef.current);

    // let wireframe = new WireframeGeometry(nodes.Plane022.geometry);

    // let mesh = new Mesh(wireframe, new MeshBasicMaterial({ color: 0xff0000 }));
    // mesh.position.copy(meshRef.current.position);
    // setPlayerFrame(mesh);

    // scene.add(mesh);
  }, [state.controls]);

  // add the hit points
  useEffect(() => {
    checkpoints.forEach((checkpoint) => {
      let boxGeo = new BoxGeometry(checkpoint.size[0], checkpoint.size[1], checkpoint.size[2],);
      //let boxFrame = new WireframeGeometry(boxGeo);
      let boxMesh = new Mesh(boxGeo, new MeshBasicMaterial({ color: 0x00ff00 }));
      boxMesh.visible = false;
      boxMesh.position.copy(new Vector3(checkpoint.position[0], checkpoint.position[1], checkpoint.position[2]));
      scene.add(boxMesh);
      checkpointsMesh.push(boxMesh);
      setCheckpointMesh([...checkpointsMesh]);
    });
  }, []);

  useEffect(() => {
    if (isPlaying)
      registerEvents();
  }, [isPlaying]);

  useEffect(() => {
    if (previousAction) {
      actions[previousAction].fadeOut(0.3);
      actions[stateValtio.action].stop();
    }
    actions[stateValtio.action].play();
    // console.log(stateValtio.action);
    if (stateValtio.action === 'Anim_Walk' && previousAction === 'Anim_Idle') {
      actions[stateValtio.action].fadeIn(0.9);
    }
  }, [actions, stateValtio.action]);

  useEffect(() => {
    isModal ? setGravity(0) : setGravity(-30);
  }, [isModal]);

  useFrame((stateCanvas, delta) => {
    if (!isModal) movePlayer(Math.min(delta, 0.1), state.collider);
    // if the player has fallen too far below the level reset their position to the start
    if (player?.position.y < -25) {
      meshRef.current.position.set(-38, 8, 1);
      setPlayer(meshRef.current);
    }

    // playerFrame.position.copy(meshRef.current.position);

    // stateValtio.checkpoints.find((checkpoint) => {
    //   if (
    //     equal(state.playerPosition, {
    //       x: checkpoint.position[0],
    //       y: checkpoint.position[1],
    //       z: checkpoint.position[2],
    //     }) &&
    //     !checkpoint.collected
    //   ) {
    //     setCheckpoint(checkpoint);
    //     checkpoint.collected = true;
    //     checkpoint.last = true;
    //     if (checkpoint.item_name !== "Spaceship") {
    //       stateValtio.action = "Anim_Idle";
    //       setIsModal(true);
    //     }
    //   }
    // });

    checkpointsMesh.forEach((hitPoint, index) => {
      let box = new Box3();
      box.setFromObject(hitPoint);
      let checkpoint = stateValtio.checkpoints[index];
      if (!checkpoint.collected && box.containsPoint(player.position)) {
        // console.log(index, checkpoints[index]);
        setCheckpoint(checkpoint);
        checkpoint.collected = true;
        checkpoint.last = true;
        if (checkpoint.item_name !== "Spaceship") {
          stateValtio.action = "Anim_Idle";
          setIsModal(true);
        }
        console.log(stateValtio.checkpoints);
      }
    });


    const angleYCameraDirection = -2.55555;
    const directionOffset = getDirectionOffset(
      fwdPressed,
      bkdPressed,
      rgtPressed,
      lftPressed
    );
    rotateQuarternion.setFromAxisAngle(
      rotateAngle,
      directionOffset + angleYCameraDirection
    );
    if (stateValtio.action === 'Anim_Walk') {
      meshRef.current.quaternion.rotateTowards(rotateQuarternion, 0.1);
    }
    if (jump && velocity.y === 0) {
      setTimeout(() => {
        velocity.y = 6.0;
        setVelocity(velocity);
        // stateValtio.action = 'Anim_Jump_Air';
      }, 60);
      // setTimeout(() => {
      //   if (stateValtio.action == 'Anim_Jump') stateValtio.action = 'Anim_Idle';
      //   //   // velocity.y = 2;
      //   //   setVelocity(velocity);
      // }, 370);
      setTimeout(() => {
        setJump(false);
      }, 460);
    }
  });

  const movePlayer = (delta, collider) => {
    if (!isPlaying)
      return;

    if (!state.controls && !state.collider) return;
    let player = meshRef.current;
    let angle = state.controls.getAzimuthalAngle();
    // console.log(player.position);

    if (!isModal) {
      if (fwdPressed) {
        stateValtio.action = 'Anim_Walk';
        speed <= 7 && setSpeed(speed + 0.2);
        vector.set(0, 0, -1).applyAxisAngle(upVector, angle);
        player.position.addScaledVector(vector, speed * delta);
      }

      if (bkdPressed) {
        stateValtio.action = 'Anim_Walk';
        speed <= 7 && setSpeed(speed + 0.2);
        vector.set(0, 0, 1).applyAxisAngle(upVector, angle);
        player.position.addScaledVector(vector, speed * delta);
      }

      if (lftPressed) {
        stateValtio.action = 'Anim_Walk';
        speed <= 7 && setSpeed(speed + 0.2);
        vector.set(-1, 0, 0).applyAxisAngle(upVector, angle);
        player.position.addScaledVector(vector, speed * delta);
      }

      if (rgtPressed) {
        stateValtio.action = 'Anim_Walk';
        speed <= 7 && setSpeed(speed + 0.2);
        vector.set(1, 0, 0).applyAxisAngle(upVector, angle);
        player.position.addScaledVector(vector, speed * delta);
      }

      if (jumpPressed) {
        stateValtio.action = 'Anim_Jump';
        // console.log(jump);
        if (!jump) {
          setJump(true);
          stateValtio.action = 'Anim_Jump';
        }
      } else {
        setJump(false);
      }

      if (
        !fwdPressed &&
        !bkdPressed &&
        !lftPressed &&
        !rgtPressed &&
        !jump
      ) {
        setSpeed(1);
        stateValtio.action = 'Anim_Idle';
      }
    }

    velocity.y += isOnGround ? 0 : delta * gravity;
    player.position.addScaledVector(velocity, delta);
    player.updateMatrixWorld();
    // check if the player is inside in any of the letter
    let insideLetter = pointInsideGeometry(
      player.position.x,
      player.position.z
    );
    if (insideLetter) {
      setIsInLetter(true);
      if (track !== insideLetter.track)
        setTrack(insideLetter.track);
    } else {
      setIsInLetter(false);
    }

    let tempVector = new Vector3();
    let tempVector2 = new Vector3();
    let tempBox = new Box3();
    let tempMat = new Matrix4();
    let tempSegment = new Line3();
    const deltaVector = tempVector2;

    // adjust player position based on collisions
    const capsuleInfo = player.capsuleInfo;
    tempBox.makeEmpty();
    tempMat.copy(collider?.matrixWorld).invert();
    tempSegment.copy(new Line3(new Vector3(0, 0, 0), new Vector3(0, 5, 0.0)));

    // get the position of the capsule in the local space of the collider
    tempSegment.start.applyMatrix4(player.matrixWorld).applyMatrix4(tempMat);
    tempSegment.end.applyMatrix4(player.matrixWorld).applyMatrix4(tempMat);

    // get the axis aligned bounding box of the capsule
    tempBox.expandByPoint(tempSegment.start);
    tempBox.expandByPoint(tempSegment.end);

    tempBox.min.addScalar(-capsuleInfo.radius);
    tempBox.max.addScalar(capsuleInfo.radius);

    collider?.geometry?.boundsTree.shapecast({
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
    newPosition.copy(tempSegment.start).applyMatrix4(collider?.matrixWorld);

    // check how much the collider was moved
    deltaVector.subVectors(newPosition, player.position);

    const offset = Math.max(0.0, deltaVector.length() - 1e-5);
    deltaVector.normalize().multiplyScalar(offset);
    // adjust the player model
    player.position.add(deltaVector);

    // if the player was primarily adjusted vertically we assume it's on something we should consider ground
    setIsOnGround(deltaVector.y > Math.abs(delta * velocity.y * 0.15));

    if (!isOnGround) {
      deltaVector.normalize();
      velocity.addScaledVector(deltaVector, -deltaVector.dot(velocity));
    } else {
      velocity.set(0, 0, 0);
    }

    let lastControl = state.controls.target;
    // state.controls.enabled = false;
    camera.position.sub(lastControl);
    state.controls.target.copy(player.position);
    camera.position.add(player.position);
    setVelocity(velocity);

    dispatch({ type: Actions.UPDATE_CONTROLS, payload: state.controls });
    // setPlayer(player);
    dispatch({ type: Actions.UPDATE_PLAYER, payload: player.position });
    dispatch({ type: Actions.UPDATE_CAMERA, payload: camera });
  };

  const closeModal = () => {
    setIsModal(false);
  }

  const registerEvents = () => {
    window.addEventListener(
      'keydown',
      (e) => {
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
            setJumpressed(true);
            break;
          case 'KeyM':
            setZoom(true);
            break;
          case 'Escape':
            closeModal();
            break;
        }
      },
      { passive: true }
    );

    window.addEventListener(
      'keyup',
      (e) => {
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
          case 'KeyM':
            setZoom(!true);
            break;
          case 'Space':
            setJumpressed(false);
            break;
        }
      },
      { passive: true }
    );

    // close the modal when click anywhere
    window.addEventListener(
      'click', (e) => {
        closeModal();
      }
    );
  };
  return (
    <>
      <mesh
        ref={meshRef}
        position={player ? player.position : [-57.53, 3.79, -8]}
        scale={1.3}
        castShadow={true}
        receiveShadow
      // layers={[2]}
      >
        <primitive object={nodes.spine} castShadow={true} receiveShadow />
        <group name='Character' castShadow={true} receiveShadow>
          <skinnedMesh
            name='Plane022'
            geometry={nodes.Plane022.geometry}
            material={materials.Character}
            skeleton={nodes.Plane022.skeleton}
            castShadow={true}
          />
          <skinnedMesh
            name='Plane022_1'
            geometry={nodes.Plane022_1.geometry}
            material={materials.Character_Inner}
            skeleton={nodes.Plane022_1.skeleton}
            castShadow={true}
          />
        </group>
        <skinnedMesh
          name='Eyes'
          geometry={nodes.Eyes.geometry}
          material={materials.Character}
          skeleton={nodes.Eyes.skeleton}
          castShadow={true}
          translateY={5}
        />
      </mesh>
    </>
  );
};

useGLTF.preload('https://fargamot.s3.amazonaws.com/resources/EA_CharacterAnimated_v9.glb');

function usePrevious(value) {
  // The ref object is a generic container whose current property is mutable ...
  // ... and can hold any value, similar to an instance property on a class
  const ref = useRef();
  // Store current value in ref
  useEffect(() => {
    ref.current = value;
  }, [value]); // Only re-run if value changes
  // Return previous value (happens before update in useEffect above)
  return ref.current;
}

export default Player;
