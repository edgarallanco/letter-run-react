import { useFrame, useThree } from '@react-three/fiber';
import React, { useContext, useEffect, useState, useRef } from 'react';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import * as THREE from 'three';
import { MeshBVH, MeshBVHVisualizer } from 'three-mesh-bvh';
import { AppDispatchContext, AppStateContext } from 'context/AppContext';
import { Actions } from 'reducer/AppReducer';
import stateValtio from 'context/store';
import { useAnimations, useGLTF } from '@react-three/drei';
import { Clock, Quaternion, Vector3 } from 'three';
import { easings, useSpring } from 'react-spring';
import LinearMovement from 'components/scripts/LinearMovement';
import Intro from 'components/UI/Intro';

const Scene = ({ checkpoint, isModal, setZoom, moveToStart, setModal, isPlaying, setIsplaying, introDone, setIntroDone }) => {
  const { state } = useContext(AppStateContext);
  const { dispatch } = useContext(AppDispatchContext);
  let environment;
  const { scene, gl } = useThree();
  const [stairs, setStairs] = useState([]);
  const [launchRocket, setLaunchRocket] = useState(false);
  const [zoomCamera, setZoomCamera] = useState(false);
  // const [moveToStart, setMoveToStart] = useState(false);
  const [movement, setMovement] = useState();
  const [currentRoute, setCurrentRoute] = useState(0);
  let collider;
  const scene1 = useGLTF('https://fargamot.s3.amazonaws.com/resources/EA_Baking_AllLetters_v26.glb');
  const animations = [];
  const cameraRoutes = [
    { pos: [0, 150, 0], rotation: [0, 0, 0] },
    { pos: [1.6839, 120, 70.205], rotation: [34.6, 18.3, 0] },
    // { pos: [-8.2254, 95.891, 10.757], rotation: [34.6, 18.3, 0] },
    { pos: [45.53, 95.891, 60.757], rotation: [34.6, 18.3, 0] },
    { pos: [-57.53, 3.79, 28], rotation: [60.6, 0, 36] },
  ]

  // const cameraRoutes = [
  //   { pos: [31.38445573844476, 181.23, -19.678934669579434], rotation: [13, 6.57, 0] },
  //   { pos: [32.74560728012071, 95.891, 32.09665054408821], rotation: [34.6, 18.3, 0] },
  //   { pos: [-45.99342762761975, 95.891, 12.280006304812702], rotation: [34.6, 18.3, 0] },
  //   { pos: [-57.53, 3.79, -8], rotation: [60.6, 0, 36] },
  // ]

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
    zoomProp: !zoomCamera ? 1 : 12,
  });

  useEffect(() => {
    scene1.nodes['CameraSolver'].visible = false;
    // scene1.nodes['CameraSolver'].position.set(cameraRoutes[0].pos[0], cameraRoutes[0].pos[1], cameraRoutes[0].pos[2]);
    scene1.nodes['CameraSolver'].position.set(0, 0, 0);
    scene1.nodes['CameraSolver'].rotation.setFromVector3(new Vector3(0, Math.PI / 2, 0));
    setZoomCamera(false);
    // console.log(state.camera.position);

  }, []);

  useEffect(() => {
    if (!state.playerMesh)
      return;

    console.log(scene1.animations);
    // setInterval(() => {

    scene1.animations.forEach((a) => {
      if (a.name !== 'Anim_CameraSolver' && a.name !== 'Anim_Rocket')
        actions[a.name].play();
    });

    console.log(state.camera.position);
    let position = cameraRoutes[0].pos;
    let route = new Vector3(position[0], scene1.nodes['CameraSolver'].position.y, position[2]);
    let m = new LinearMovement(scene1.nodes['CameraSolver'].position, route);
    state.camera.lookAt(scene1.nodes['CameraSolver'].position);
    setMovement(m);

    // }, 1000);

    // setTimeout(() => {
    //   setMoveToStart(true);
    // }, 100);
  }, [state.playerMesh]);

  useFrame(({ controls }) => {
    controls.target = isPlaying ? state?.playerMesh.position : scene1.nodes['CameraSolver'].position;
  });

  useFrame(({ camera }, delta) => {
    if (!isPlaying) {
      state.playerMesh.visible = introDone;
      scene1.nodes["Tutorial"].visible = introDone;
      if (!zoomCamera)
        camera.zoom = 1;
      // camera.rotation.x = 0;
      // camera.rotation.y = 0;
      // camera.rotation.z = 0;

      if (moveToStart) {
        // console.log(currentRoute);
        if (cameraRoutes[currentRoute] !== undefined) {
          let position = cameraRoutes[currentRoute].pos;
          let rotation = cameraRoutes[currentRoute].rotation;
          let cubePos = scene1.nodes['CameraSolver'].position;

          if (Math.floor(cubePos.x) === Math.floor(position[0])
            && Math.floor(cubePos.z) === Math.floor(position[2])) {
            // camera.lookAt(cubePos);
            // console.log(scene1.nodes['CameraSolver'].position);
            // console.log(camera.rotation);
            let r = currentRoute;
            if (movement) { // if the movement if already initialized, increment current route
              r = currentRoute + 1;
              setCurrentRoute(r);
            }
            // console.log(scene1.nodes['CameraSolver'].position);

            if (cameraRoutes[r]) {
              let position = cameraRoutes[r].pos;
              let route = new Vector3(position[0], state.playerMesh.position.y, position[2]);
              let m = new LinearMovement(cubePos, route);
              setMovement(m);
            }

          }

          if (movement) {
            // console.log(cubePos, position);
            // console.log(cubeSpring);
            let newPosition = movement.move();
            // console.log(movement);

            scene1.nodes['CameraSolver'].position.copy(newPosition);

            camera.position.x = newPosition.x;
            camera.position.z = newPosition.z;
            // camera.position.y = newPosition.y;
            // let lastControl = scene1.nodes['CameraSolver'].position;
            // camera.position.sub(lastControl);
            // state.controls.target.copy(scene1.nodes['CameraSolver'].position);
            // camera.position.add(scene1.nodes['CameraSolver'].position);
            // camera.lookAt(scene1.nodes['CameraSolver'].position);
            // camera.position.y = scene1.nodes['CameraSolver'].position.y;

            if (camera.rotation.y < 1) {
              // console.log(camera.rotation.y);
              // setZoomCamera(true);

              // state.camera.zoom = 1 + (currentRoute - 1);
              // if (introZoomAnim.zoomProp.animation.values[0] && camera.zoom < 1 + (currentRoute)) {
              //   console.log(introZoomAnim.zoomProp.animation.values[0]._value);
              //   state.camera.zoom = introZoomAnim.zoomProp.animation.values[0]._value;
              // }
              console.log(camera.zoom);

              camera.rotation.y = camera.rotation.y + 0.3;
              camera.rotation.z = camera.rotation.z + 0.3;

              state.controls.update();
              if (currentRoute === (cameraRoutes.length - 1)) {
                // console.log("Last route");
                camera.lookAt(state.playerMesh.position);
                camera.up.set(0, 1, 0);
                // camera.lookAt(0, 0, 0);
                state.camera.rotation.setFromVector3(new Vector3(0, Math.PI / 2, 0));
                let tempCamera = camera.clone();
                tempCamera.up.set(0, 1, 0);
                tempCamera.lookAt(0, 0, 0);
                let q1 = new Quaternion().copy(tempCamera.quaternion);
                tempCamera.lookAt(state.playerMesh.position);
                let q2 = new Quaternion().copy(tempCamera.quaternion);
                camera.quaternion.slerpQuaternions(q1, q2, delta);
                // camera.lookAt(state.playerMesh.position);
                // let lastControl = scene1.nodes['CameraSolver'].position;
                // camera.position.sub(lastControl);
                // state.controls.target.copy(scene1.nodes['CameraSolver'].position);
                // camera.position.add(scene1.nodes['CameraSolver'].position);
              } else {
                camera.up.set(0, 1, 0);
                camera.lookAt(0, 0, 0);
              }
            } else {
              // camera.lookAt(scene1.nodes['CameraSolver'].position);
            }

            // state.controls.setPolarAngle(90);
            // state.controls.setAzimuthalAngle(90);
            // state.controls.update();

            // camera.lookAt(new Vector3(rotation[0], rotation[1], rotation[2]));
          }


        } else {
          camera.position.y = 175;
          // console.log("intro done.");
          setZoomCamera(true);
          // camera.zoom = 12;
          if (introZoomAnim.zoomProp.animation.values[0] && state.camera.zoom < 12) {
            // console.log(introZoomAnim.zoomProp.animation.values[0]._value);
            state.camera.zoom = introZoomAnim.zoomProp.animation.values[0]._value;
          }
          // scene1.nodes['CameraSolver'].position.copy(state.playerMesh.position);
          // camera.up.set(0, 1, 0);
          // camera.lookAt(state.playerMesh.position);
          // let lastControl = scene1.nodes['CameraSolver'].position;
          // camera.position.sub(lastControl);
          // state.controls.target.copy(scene1.nodes['CameraSolver'].position);
          // camera.position.add(scene1.nodes['CameraSolver'].position);
          // camera.position.y = 175;
          // camera.quaternion.rotateTowards(state.playerMesh.quaternion, 0.1);

          let tempCamera = camera.clone();
          tempCamera.up.set(0, 1, 0);
          tempCamera.lookAt(state.playerMesh.position);
          let q1 = new Quaternion().copy(tempCamera.quaternion);
          tempCamera.lookAt(scene1.nodes['CameraSolver'].position);
          let q2 = new Quaternion().copy(tempCamera.quaternion);
          camera.quaternion.slerpQuaternions(q1, q2, delta);

          setIntroDone(true);
          if (scene1.nodes["Tutorial"].material.opacity < 1)
            scene1.nodes["Tutorial"].material.opacity += 0.05;

          if (state.camera.zoom >= 12) {
            setIsplaying(true);
            camera.position.y = 175;
          }
        }
      }
      // console.log(camera);
      dispatch({ type: Actions.UPDATE_CAMERA, payload: camera });
    } else {

      // if (introZoomAnim.zoomProp.animation.values[0] && camera.zoom < 12) {
      //   camera.zoom = introZoomAnim.zoomProp.animation.values[0]._value;
      // }
      // camera.zoom = 12;
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
