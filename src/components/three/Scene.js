import { useFrame, useThree } from '@react-three/fiber';
import React, { useContext, useEffect, useState, useRef } from 'react';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import * as THREE from 'three';
import { MeshBVH, MeshBVHVisualizer } from 'three-mesh-bvh';
import { AppDispatchContext, AppStateContext } from 'context/AppContext';
import { Actions } from 'reducer/AppReducer';
import stateValtio from 'context/store';
import { useAnimations, useGLTF } from '@react-three/drei';
import { BoxGeometry, Clock, CylinderGeometry, Euler, LineSegments, Mesh, MeshBasicMaterial, Quaternion, Vector3, WireframeGeometry } from 'three';
import { easings, useSpring } from 'react-spring';
import LinearMovement from 'components/scripts/LinearMovement';
import Intro from 'components/UI/Intro';
import * as CANNON from 'cannon-es';
import CannonUtils from 'src/utils/CannonUtils';
import { loadPoolNoodles, noodles, updatePosition } from 'src/utils/LoadPoolNoodles';
import { loadPlanes } from 'src/utils/LoadPoolPlanes';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Plane } from 'cannon-es';
import { animate } from '../scripts/IntroAnimation';
import { setupPhysics, worldStep } from '../scripts/Physics';

const Scene = ({ checkpoint, isModal, setZoom, hideTutorial, moveToStart, setModal, isPlaying, setIsplaying, introDone, setIntroDone }) => {
  const { state } = useContext(AppStateContext);
  const { dispatch } = useContext(AppDispatchContext);
  let environment;
  const { scene, gl, camera, controls } = useThree();
  const [stairs, setStairs] = useState([]);
  const [launchRocket, setLaunchRocket] = useState(false);
  const [zoomCamera, setZoomCamera] = useState(false);
  // const [moveToStart, setMoveToStart] = useState(false);
  const [movement, setMovement] = useState();
  const [camereaMovment, setCameraMovement] = useState();
  const [currentRoute, setCurrentRoute] = useState(0);
  const [playerBody, setPlayerBody] = useState();
  const [frameBody, setFrameBody] = useState();
  const [playerFrame, setPlayerFrame] = useState();
  const [playerBox, setPlayerBox] = useState();
  const [poolItems, setPoolItems] = useState([]);
  const [cameraMesh, setCameraMesh] = useState();
  const [camPosition, setCamPosition] = useState(new Vector3(0, 90, 6));
  let collider;
  const loader = new GLTFLoader();
  const scene1 = useGLTF('https://fargamot.s3.amazonaws.com/resources/EA_Baking_AllLetters_no_cam.glb');
  const [world, setWorld] = useState();

  const animations = [];
  const cameraRoutes = [
    { pos: [0, 90, 6], rotation: [0, 0, 0] },
    { pos: [-57.53, 3.79, -8], rotation: [60.6, 0, 36] },
  ]

  const initialPos = cameraRoutes[0].pos;
  
  // const poolItemNames = [
  //   'Pool_Item_1', 'Pool_Item_2', 'Pool_Item_6', 'Pool_Item_3'
  // ]
  const poolItemNames = [];

  scene1.animations.forEach((ani) => {
    let exists = animations.find((a) => {
      return a.name === ani.name;
    });
    if (!exists)
      animations.push(ani);
  });

  // console.log(scene1);

  const { actions } = useAnimations(animations, scene1.scene);

  const zoomAnim = useSpring({
    config: { duration: 1000, easing: easings.easeInOutCubic},
    zoomProp: zoomCamera ? 2 : 4.5,
  });

  const introZoomAnim = useSpring({
    config: { duration: 3000, easing: easings.easeInOutCubic, step: 1 },
    zoomProp: !zoomCamera ? 1 : 4.5,
  });

 /*  useEffect(() => {
    if (hideTutorial) {
      // console.log(scene);
      setTimeout(() => {
        scene1.nodes["Tutorial"].material.opacity = 0;
      }, 5000)
    } 
  }, [hideTutorial]) */

  useEffect(() => {
    // console.log(scene1);

    let cm = new Mesh(new BoxGeometry(1, 1, 1), new MeshBasicMaterial({ color: 0x00ff00 }));
    // cm.quaternion.set(0, Math.PI / 2, 0);
    cm.position.set(initialPos[0], 3.79, initialPos[2]);
    cm.visible = false;
    cm.quaternion.setFromEuler(new Euler(Math.PI / 2, 0, 0))
    scene.add(cm);
    setCameraMesh(cm);

    let cmMovment = new LinearMovement(new Vector3(initialPos[0], initialPos[1], initialPos[2]),
      new Vector3(5.78651222602025, 72.32470228479104, 60.826936793399625), 1);
    setCameraMovement(cmMovment);

  

    poolItemNames.forEach((item) => {
      scene1.nodes[item].visible = false;
    })

    // setupPhysics(scene);

  }, []);

  useEffect(() => {
    if (!state.playerMesh)
      return;
      state.playerMesh.material.opacity = 0;
    //console.log(scene1.animations);
    // setInterval(() => {
    scene1.animations.forEach((a) => {
      if (a.name !== 'Anim_Rocket')
        actions[a.name].play();
    });

    // console.log(state.camera.position);
    let position = initialPos;
    let route = new Vector3(position[0], position[1], position[2]);
    let m = new LinearMovement(cameraMesh.position, route, 0.001);
    state.camera.zoom = 1;
    setMovement(m);

    dispatch({ type: Actions.UPDATE_CAMERA, payload: camera });

  }, [state.playerMesh]);

  useEffect(() => {
    if (moveToStart) {
      animate(camera, cameraMesh, setCamPosition, initialPos).then(
        () => {
          //setIsplaying(true);
          setIntroDone(true);
        }
      )
    }
  }, [moveToStart])

  useFrame(({ controls }) => {
    if (state?.playerMesh)
      controls.target = introDone ? state?.playerMesh.position : cameraMesh.position;
  });

  useFrame(({ }, delta) => {
    if (!state?.playerMesh)
      return;

    // worldStep(state?.playerMesh);

    // playerBody.position.y = 3.5;
    setPlayerBody(playerBody);
    // state.playerPhysics.position.copy(state.playerMesh.position);
    // state.playerPhysics.quaternion.copy(state.playerMesh.quaternion);
    // state.playerPhysics.velocity.set(2, 0, 2);
    // dispatch({ type: Actions.UPDATE_PLAYER_PHYSICS, payload: state.playerPhysics});
    // // console.log(state.playerPhysics.velocity.x);

    // let direction = new CANNON.Vec3();
    // let endPosition = new CANNON.Vec3(state.playerMesh.position.x, state.playerMesh.position.y, state.playerMesh.position.z);
    // endPosition.vsub(playerBody.position, direction);
    // let totalLenght = direction.length();
    // direction.normalize();
    // let speed = totalLenght / 0.5;
    // direction.scale(speed, playerBody.velocity);
    // playerBody.position.vadd(endPosition, playerBody.position);


    // camera.position.y = 175;
    state.playerMesh.visible = playerVis; 
    if ((playerVis === true) && (state.playerMesh.material.opacity < 1)){
      console.log(state.playerMesh.material.opacity + " = player opacity")
      state.playerMesh.material.opacity += .02;
    } 
   // console.log(state.playerMesh.position.y + " is the player position")
    //scene1.nodes["Tutorial"].visible = false;

    if (!isPlaying) {
      // console.log(camera.position);
      if (moveToStart) {
        if (!introDone) {
          // console.log(camPosition);
          camera.position.copy(camPosition);
          camera.lookAt(cameraMesh.position);
          camera.up.set(0, 1, 0);
        }
      } else {
        camera.position.set(initialPos[0], initialPos[1], initialPos[2]);
        camera.up.set(0, 1, 0);
        camera.lookAt(cameraMesh.position);
        // camera.lookAt(0, 0, 0);
        //camera.lookAt(cameraMesh.position.x, cameraMesh.position.y, (cameraMesh.position.z + 6));
        //console.log(cameraMesh.position + " is the camera mesh position")
      }
      //   // console.log(camera);
      //   dispatch({ type: Actions.UPDATE_CAMERA, payload: camera });
      //   dispatch({ type: Actions.UPDATE_CONTROLS, payload: state.controls });
    } else {
      /* if (scene1.nodes["Tutorial"].material.opacity < 1 && !hideTutorial)
        scene1.nodes["Tutorial"].material.opacity += 0.05; */
    }

    if (launchRocket && scene1.nodes["7_L_Button"].position.y > -0.1) {
      let vector = new Vector3(0, 0, 0);
      let angle = state.controls.getAzimuthalAngle();
      let upVector = new Vector3(0, 0, 0);
      vector.set(0, -0.02, 0).applyAxisAngle(upVector, angle);
      scene1.nodes["7_L_Button"].position.addScaledVector(vector, 30 * Math.min(delta, 0.1));
      setZoomCamera(true);
    } else if (launchRocket && zoomCamera) {
      // console.log(zoomAnim.zoomProp.animation.values[0]._value)
      if (zoomAnim.zoomProp.animation.values[0] && camera.zoom > 2) {
        camera.zoom = zoomAnim.zoomProp.animation.values[0]._value;
      }
    } else if (!zoomCamera && launchRocket) {
      if (zoomAnim.zoomProp.animation.values[0]) {
        //console.log(zoomAnim.zoomProp.animation.values[0]._value)
        if (zoomAnim.zoomProp.animation.values[0]._value >= 4.5) {
          setLaunchRocket(false);
          setIsplaying(true);
        } else {
          setModal(false);
          camera.zoom = zoomAnim.zoomProp.animation.values[0]._value;
        }
      }
    }

  });

  useEffect(() => {
    // collect all geometries to merge
    if (!state.playerMesh) return;
    // scene.castShadow = true;
    scene.receiveShadow = true;
    const geoms = [];
    environment = scene1.scene;
    dispatch({ type: Actions.UPDATE_ENVIROMENT, payload: environment });
    environment.scale.set(1.5, 1.5, 1.5);
    // environment.matrix.makeScale(1.5, 1.5, 1.5)
    environment.updateMatrixWorld(true);
    /* scene1.nodes["Tutorial"].material.transparent = true;
    scene1.nodes["Tutorial"].material.opacity = 0.01;
    scene1.nodes['1_E_Object'].material.metalness = 0; */
    // scene1.nodes['1_E_Object'].visible = false;
    // console.log(scene1);
    // scene1.nodes['Letters'].children.forEach((mesh) => {
    //   mesh.material.metalness = 1;
    // });

    environment.traverse((c) => {
      // console.log(c);
      if (c.geometry) {
        // console.log(c.name);
        // console.log(poolItemNames[c.name]);
        if (poolItemNames.indexOf(c.name) >= 0) {
          // console.log("Skip Pool item");
          return;
        }

        const cloned = c.geometry.clone();
        cloned.applyMatrix4(c.matrixWorld);
        for (const key in cloned.attributes) {
          if (key !== 'position') {
            cloned.deleteAttribute(key);
          }
        }
        if (c.name.includes('Invisible')) {
          c.visible = false;
        }
        if (c.name.includes('Stairs')) {
          const foundedStair = stateValtio.gameProgress
            ? stateValtio.gameProgress.find(
              (check) => check.stair === c.userData.name
            )
            : undefined;
          if (!foundedStair) {
            c.visible = false;
            cloned.name = c.userData.name;
            stateValtio.stairs.push(cloned);
            setStairs(stairs.push(c));
          } else {
            geoms.push(cloned);
          }
        } else if (c.name.includes('Object')) {
          const found = stateValtio.gameProgress
            ? stateValtio.gameProgress.find(
              (check) => check.object === c.userData.name
            )
            : undefined;
          c.visible = found ? false : true;
          if (!found) {
            cloned.name = c.userData.name;
            geoms.push(cloned);
          }
        } else if (
          !c.name.includes('Grass') &&
          !c.name.includes('10_N_Water')
        ) {
          cloned.name = c.userData.name;
          geoms.push(cloned);
          console.log(cloned)
        }

        // if (c.name.includes('Plane012')) {
        //   const groundBody = new CANNON.Body();
        //   let groundShape = CannonUtils.CreateTrimesh(c.geometry);
        //   groundBody.addShape(groundShape);
        //   world.addBody(groundBody);

        //   let groundFrame = new WireframeGeometry(c.geometry);
        //   let groundMesh = new Mesh(groundFrame, new MeshBasicMaterial({ color: 0x00ff00 }));
        //   groundMesh.position.copy(c.position);
        //   scene.add(groundMesh);
        // }

        // if(c.name === '7_L_Button') {
        //   c.position.y = -0.05;
        // }
      }
    });
    stateValtio.geometries = geoms;
    // create the merged geometry
    const mergedGeometry = BufferGeometryUtils.mergeBufferGeometries(
      geoms,
      false
    );
    mergedGeometry.boundsTree = new MeshBVH(mergedGeometry, {
      maxDepth: 200,
    });
    const collider = new THREE.Mesh(mergedGeometry);
    collider.material.opacity = 0;
    collider.material.transparent = true;
    // visualizer = new MeshBVHVisualizer(collider, 10);
    // let groundFrame = new WireframeGeometry(mergedGeometry);
    // let groundMesh = new Mesh(groundFrame, new MeshBasicMaterial({ color: 0x00ff00 }));
    // // groundMesh.position.copy(groundBody.position);
    // scene.add(groundMesh);
    dispatch({ type: Actions.UPDATE_COLLIDER, payload: collider });

    environment.traverse((c) => {
      if (c.material) {
        c.castShadow = false;
        c.receiveShadow = true;
        c.material.shadowSide = 10;
      }
    });
    environment.position.y = 0.5;
    scene.add(collider);
    scene.add(environment);
  }, [state.playerMesh]);

  useEffect(() => {
    // if (!isModal) return;
    if (!checkpoint) return;
    environment = scene1.scene;
    // console.log(checkpoint);
    let currentStair = stateValtio.stairs.find(
      (stair) => stair.name === checkpoint.stair
    );
    if (!currentStair) return;
    environment.children.map((c) => {
      if (c.userData.name === currentStair.name) {
        c.visible = true;
      }
      if (c.userData.name === checkpoint.object) {
        if (checkpoint.item_name === 'Spaceship') {
          // console.log("Spaceship.");
          stateValtio.action = 'Anim_Idle';
          setLaunchRocket(true);
          setIsplaying(false);
          setTimeout(() => {
            // state.camera.zoom = 6;
            // dispatch({ type: Actions.UPDATE_CAMERA, payload: state.camera });
            setTimeout(() => {
              actions["Anim_Rocket"].play();
              setTimeout(() => {
                c.visible = false;
                setModal(true);
                // setLaunchRocket(false);
                setZoomCamera(false);
                // setIsplaying(true);
                // state.camera.zoom = 4.5;
                // dispatch({ type: Actions.UPDATE_CAMERA, payload: state.camera });
                actions["Anim_Rocket"].stop();
              }, 2000)
            }, 500);
          }, 1000);
        } else {
          c.visible = false;
        }
      }
    });
    currentStair && stateValtio.collection.push(checkpoint.item_name);
    currentStair && stateValtio.geometries.push(currentStair);
    stateValtio.geometries = currentStair
      ? stateValtio.geometries.filter((geom) => geom.name !== checkpoint.object)
      : stateValtio.geometries;
    const mergedGeometry = BufferGeometryUtils.mergeBufferGeometries(
      stateValtio.geometries,
      false
    );
    mergedGeometry.boundsTree = new MeshBVH(mergedGeometry);
    collider = new THREE.Mesh(mergedGeometry);
    dispatch({ type: Actions.UPDATE_COLLIDER, payload: collider });
  }, [checkpoint]);
};

export default Scene;
