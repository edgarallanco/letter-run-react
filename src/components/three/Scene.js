import { useFrame, useThree } from '@react-three/fiber';
import React, { useContext, useEffect, useState, useRef } from 'react';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import * as THREE from 'three';
import { MeshBVH, MeshBVHVisualizer } from 'three-mesh-bvh';
import { AppDispatchContext, AppStateContext } from 'context/AppContext';
import { Actions } from 'reducer/AppReducer';
import stateValtio from 'context/store';
import { useAnimations, useGLTF } from '@react-three/drei';
import { Vector3 } from 'three';
import { easings, useSpring } from 'react-spring';
import LinearMovement from 'components/scripts/LinearMovement';

const Scene = ({ checkpoint, isModal, setZoom, setModal, isPlaying, introDone, setIntroDone }) => {
  const { state } = useContext(AppStateContext);
  const { dispatch } = useContext(AppDispatchContext);
  let environment;
  const { scene, gl } = useThree();
  const [stairs, setStairs] = useState([]);
  const [launchRocket, setLaunchRocket] = useState(false);
  const [zoomCamera, setZoomCamera] = useState(false);
  const [moveToStart, setMoveToStart] = useState(false);
  const [movement, setMovement] = useState();
  const [currentRoute, setCurrentRoute] = useState(0);
  let collider;
  const scene1 = useGLTF('https://fargamot.s3.amazonaws.com/resources/EA_Baking_AllLetters_v26.glb');
  const animations = [];
  const cameraRoutes = [
    [31.38445573844476, -19.678934669579434],
    [32.74560728012071, 32.09665054408821],
    [-45.99342762761975, 12.280006304812702],
    [-57.53, -8]
  ]

  scene1.animations.forEach((ani) => {
    let exists = animations.find((a) => {
      return a.name === ani.name;
    });
    if (!exists)
      animations.push(ani);
  });

  const { actions } = useAnimations(animations, scene1.scene);

  const zoomAnim = useSpring({
    config: { duration: 1000, easing: easings.easeCubic },
    zoomProp: zoomCamera ? 6 : 12,
  });

  const introZoomAnim = useSpring({
    config: { duration: 1000, easing: easings.easeCubic },
    zoomProp: !zoomCamera ? 4 : 12,
  });

  useEffect(() => {
    if (!state.playerMesh)
      return;

    console.log(scene1.animations);
    // setInterval(() => {

    scene1.animations.forEach((a) => {
      if (a.name !== 'Anim_CameraSolver' && a.name !== 'Anim_Rocket')
        actions[a.name].play();
    });
    // }, 1000);

    scene1.nodes['CameraSolver'].visible = false;
    scene1.nodes['CameraSolver'].position.copy(state.playerMesh.position);

    setTimeout(() => {
      setZoomCamera(true);
      setMoveToStart(true);
    }, 100);

    // console.log(actions["Anim_CameraSolver"]);
    // if (actions["Anim_CameraSolver"]) {
    //   actions["Anim_CameraSolver"].play();
    //   setTimeout(() => {
    //     console.log(scene1.nodes['CameraSolver'].position);
    //     console.log(state.playerMesh.position);
    //     actions["Anim_CameraSolver"].stop();
    //     setZoomCamera(true);
    //     setMoveToStart(true);

    //   }, [5000]);
    // }
  }, [state.playerMesh]);

  useFrame(({ controls }) => {
    controls.target = isPlaying || introDone ? state?.playerMesh.position : scene1.nodes['CameraSolver'].position;
  });

  const moveCubeToStartingPosition = (x) => {
    let y = (0.819167183538 * x) + 39.126688069;
    // let y = (0.8201879081096921 * x) + 103.56049331529131;
    // console.log(y);

    return y;
  }

  useFrame(({ camera }, delta) => {
    if (!isPlaying) {
      state.playerMesh.visible = introDone;
      scene1.nodes["Tutorial"].visible = introDone;
      // camera.lookAt(0, 0, 0);
      // camera.up.set(0, 1, 0);
      camera.zoom = 4;
      // console.log(scene1.nodes['CameraSolver'].position);

      if (moveToStart) {
        // console.log(currentRoute);
        if (cameraRoutes[currentRoute] !== undefined) {
          if (movement && Math.floor(scene1.nodes['CameraSolver'].position.x) !== Math.floor(cameraRoutes[currentRoute][0])
            && Math.floor(scene1.nodes['CameraSolver'].position.z) !== Math.floor(cameraRoutes[currentRoute][1])) {
            camera.up.set(0, 1, 0);
            let newPosition = movement.move();
            // console.log(movement);
            scene1.nodes['CameraSolver'].position.copy(newPosition);

            camera.lookAt(scene1.nodes['CameraSolver'].position);
          } else {
            let r = currentRoute;
            if (movement) { // if the movement if already initialized, increment current route
              r = currentRoute + 1;
              setCurrentRoute(r);
            }
            // console.log(scene1.nodes['CameraSolver'].position);
            let route = new Vector3(cameraRoutes[r][0], state.playerMesh.position.y, cameraRoutes[r][1]);
            let m = new LinearMovement(scene1.nodes['CameraSolver'].position, route);
            setMovement(m);
          }
        } else {
          // console.log("intro done.");
          if (camera.zoom < 12) {
            if (introZoomAnim.zoomProp.animation.values[0]) {
              camera.zoom = introZoomAnim.zoomProp.animation.values[0]._value;
            }
          } else {
            scene1.nodes['CameraSolver'].position.copy(state.playerMesh.position);
            camera.up.set(0, 1, 0);
            camera.lookAt(state.playerMesh.position);
            setZoomCamera(false);
          }
          setIntroDone(true);
          if (scene1.nodes["Tutorial"].material.opacity < 1)
            scene1.nodes["Tutorial"].material.opacity += 0.005;
        }
      } else {
        // console.log(scene1.nodes['CameraSolver'].position);
        // scene1.nodes['CameraSolver'].position.set(-5.569166206899996, 29.026802671296153, 35.25802338861752);
      }

      let lastControl = state.controls.target;
      // state.controls.enabled = false;
      camera.position.sub(lastControl);
      state.controls.target.copy(scene1.nodes['CameraSolver'].position);
      camera.position.add(scene1.nodes['CameraSolver'].position);
      dispatch({ type: Actions.UPDATE_CAMERA, payload: camera });
    }

    if (launchRocket && scene1.nodes["7_L_Button"].position.y > -0.1) {
      let vector = new Vector3(0, 0, 0);
      let angle = state.controls.getAzimuthalAngle();
      let upVector = new Vector3(0, 0, 0);
      vector.set(0, -0.02, 0).applyAxisAngle(upVector, angle);
      scene1.nodes["7_L_Button"].position.addScaledVector(vector, 30 * Math.min(delta, 0.1));
      setZoomCamera(true);
    } else if (launchRocket && zoomCamera) {
      if (zoomAnim.zoomProp.animation.values[0] && state.camera.zoom > 6) {
        state.camera.zoom = zoomAnim.zoomProp.animation.values[0]._value;
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
    environment.scale.setScalar(1.5);
    environment.updateMatrixWorld(true);
    scene1.nodes["Tutorial"].material.transparent = true;
    scene1.nodes["Tutorial"].material.opacity = 0.01;
    scene1.nodes['1_E_Object'].material.metalness = 0;
    // scene1.nodes['1_E_Object'].visible = false;
    // console.log(scene1);
    // scene1.nodes['Letters'].children.forEach((mesh) => {
    //   mesh.material.metalness = 1;
    // });

    environment.traverse((c) => {
      if (c.geometry) {
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
        } else if (
          !c.name.includes('Grass') &&
          !c.name.includes('10_N_Water')
        ) {
          cloned.name = c.userData.name;
          geoms.push(cloned);
        }

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
          setLaunchRocket(true);
          setTimeout(() => {
            // state.camera.zoom = 6;
            dispatch({ type: Actions.UPDATE_CAMERA, payload: state.camera });
            setTimeout(() => {
              actions["Anim_Rocket"].play();
              setZoomCamera(false);
              setTimeout(() => {
                c.visible = false;
                stateValtio.action = 'Anim_Idle';
                setModal(true);
                setLaunchRocket(false);
                state.camera.zoom = 12;
                dispatch({ type: Actions.UPDATE_CAMERA, payload: state.camera });
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
