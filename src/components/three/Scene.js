import { useFrame, useThree } from '@react-three/fiber';
import React, { useContext, useEffect, useState, useRef } from 'react';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import * as THREE from 'three';
import { MeshBVH, MeshBVHVisualizer } from 'three-mesh-bvh';
import { AppDispatchContext, AppStateContext } from 'context/AppContext';
import { Actions } from 'reducer/AppReducer';
import stateValtio from 'context/store';
import { useAnimations, useGLTF } from '@react-three/drei';
import { BoxGeometry, Clock, CylinderGeometry, LineSegments, Mesh, MeshBasicMaterial, Quaternion, Vector3, WireframeGeometry } from 'three';
import { easings, useSpring } from 'react-spring';
import LinearMovement from 'components/scripts/LinearMovement';
import Intro from 'components/UI/Intro';
import * as CANNON from 'cannon-es';
import CannonUtils from 'src/utils/CannonUtils';
import { loadPoolNoodles, noodles, updatePosition } from 'src/utils/LoadPoolNoodles';
import { loadPlanes } from 'src/utils/LoadPoolPlanes';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const Scene = ({ checkpoint, isModal, setZoom, hideTutorial, moveToStart, setModal, isPlaying, setIsplaying, introDone, setIntroDone }) => {
  const { state } = useContext(AppStateContext);
  const { dispatch } = useContext(AppDispatchContext);
  let environment;
  const { scene, gl } = useThree();
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
  let collider;
  const loader = new GLTFLoader();
  const scene1 = useGLTF('https://fargamot.s3.amazonaws.com/resources/EA_Baking_AllLetters_v28.glb');
  const [world, setWorld] = useState();
  const timeStep = 1 / 60;
  const animations = [];
  const cameraRoutes = [
    { pos: [0, 150, 0], rotation: [0, 0, 0] },
    // { pos: [1.6839, 120, 20.205], rotation: [34.6, 18.3, 0] },
    // // { pos: [-8.2254, 95.891, 10.757], rotation: [34.6, 18.3, 0] },
    // { pos: [45.53, 95.891, 60.757], rotation: [34.6, 18.3, 0] },
    { pos: [-57.53, 3.79, -8], rotation: [60.6, 0, 36] },
  ]

  // const poolItemNames = [
  //   'Pool_Item_1', 'Pool_Item_2', 'Pool_Item_6'
  // ]

  const poolItemNames = []

  // noodles.forEach(function(noodle) {
  //   // console.log(world)
  //   // const { scene } = useGLTF(noodle.filename);
  //   // console.log(scene);
  //   // scene.position(noodle.position);
  //   // scene1.scene.add(scene);
  //   loader.load(noodle.filename, function(gltf) {
  //     gltf.position.set(noodle.position);
  //     scene.add(gltf.scene);
  //   })
  // });

  // for(let x = 0; x < noodles.length; x++) {
  //   const { scene } = useGLTF(noodles[x].filename);
  //   console.log(scene);
  //   scene.position(noodles[x].position);
  //   scene1.scene.add(scene);
  // }

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

  // console.log(scene1);

  const { actions } = useAnimations(animations, scene1.scene);

  const zoomAnim = useSpring({
    config: { duration: 1000, easing: easings.easeCubic },
    zoomProp: zoomCamera ? 2 : 4.5,
  });

  const introZoomAnim = useSpring({
    config: { duration: 5000, easing: easings.easeCubic },
    zoomProp: !zoomCamera ? 1 : 12,
  });

  useEffect(() => {
    if (hideTutorial) {
      // console.log(scene);
      setTimeout(() => {
        scene1.nodes["Tutorial"].material.opacity = 0;
      }, 5000)
    }
  }, [hideTutorial])

  useEffect(() => {
    // console.log(scene1);
    let w = new CANNON.World({
      gravity: new CANNON.Vec3(0, -9.81, 0)
    });

    let cm = new Mesh(new BoxGeometry(1, 1, 1), new MeshBasicMaterial({ color: 0x00ff00 }));
    cm.position.set(0, 50, 0);
    cm.visible = false;
    scene.add(cm);
    setCameraMesh(cm);

    let cmMovment = new LinearMovement(new Vector3(1.6839, 84.69169943749475, 20.205),
      new Vector3(5.78651222602025, 72.32470228479104, 60.826936793399625), 0.01);
    setCameraMovement(cmMovment);

    scene1.nodes['CameraSolver'].visible = false;
    // scene1.nodes['CameraSolver'].position.set(cameraRoutes[0].pos[0], cameraRoutes[0].pos[1], cameraRoutes[0].pos[2]);
    scene1.nodes['CameraSolver'].position.set(0, 0, 0);
    scene1.nodes['CameraSolver'].rotation.setFromVector3(new Vector3(0, Math.PI / 2, 0));
    setZoomCamera(false);
    // console.log(state.camera.position);

    let groundBody = new CANNON.Body({
      shape: new CANNON.Plane(),
      type: CANNON.Body.STATIC
    });
    groundBody.position.set(0, 2.8, 0);
    groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
    w.addBody(groundBody);

    // loadPlanes(scene, w);
    // loadPoolNoodles(scene, w, groundBody);

    let pBody = new CANNON.Body({
      mass: 1,
      shape: new CANNON.Cylinder(0.5, 0.5, 2)
    });
    // console.log(state.playerMesh);
    // let playerShape = new CANNON.Vec3(1, 1, 1);
    // pBody.addShape(playerShape);
    w.addBody(pBody);
    setPlayerBody(pBody);

    let pBox = new CylinderGeometry(0.5, 0.5, 2);
    let pMesh = new Mesh(pBox, new MeshBasicMaterial({ color: 0x00ff00 }));
    // scene.add(pMesh);
    setPlayerBox(pMesh);
    poolItemNames.forEach((item) => {
      scene1.nodes[item].visible = false;
    })

    // poolItemNames.forEach((item) => {
    //   let poolBody = new CANNON.Body({
    //     mass: 1,
    //     position: scene1.nodes[item].position,
    //     shape: new CANNON.Box(new CANNON.Vec3(1, 1, 1))
    //   });

    //   // scene1.nodes[item].visible = false;
    //   let poolShape = CannonUtils.CreateTrimesh(scene1.nodes[item].geometry);
    //   // poolBody.addShape(poolShape);
    //   w.addBody(poolBody);
    //   poolItems.push(poolBody);
    //   setPoolItems([...poolItems]);

    //   let wireframe = new WireframeGeometry(scene1.nodes[item].geometry);
    //   let line = new LineSegments(wireframe);
    //   line.material.depthTest = false;
    //   line.material.opacity = 1;
    //   // line.material.transparent = true;
    //   line.position.copy(scene1.nodes[item].position);

    //   let mesh = new Mesh(wireframe, new MeshBasicMaterial({ color: 0xff0000 }));
    //   mesh.position.copy(poolBody.position);
    //   // mesh.position.x = mesh.position.x + 11;
    //   // mesh.position.y = mesh.position.y + 2;
    //   // mesh.position.z = mesh.position.z + 9;
    //   // console.log(mesh.position);

    //   scene.add(mesh);
    //   console.log(scene1.nodes[item]);

    // });

    let box = new BoxGeometry(2, 2, 2);

    let wireframe = new WireframeGeometry(box.geometry);

    let mesh = new Mesh(box, new MeshBasicMaterial({ color: 0xff0000 }));
    let fBody = new CANNON.Body({
      shape: new CANNON.Box(new CANNON.Vec3(1, 1, 1)),
      mass: 1,
      position: new Vector3(-55.53, 23.79, 6)
    });
    w.addBody(fBody);
    setFrameBody(fBody);
    mesh.position.copy(fBody.position);
    setPlayerFrame(mesh);

    // scene.add(mesh);
    setWorld(w);

  }, []);

  useEffect(() => {
    if (!state.playerMesh)
      return;

    // console.log(scene1.animations);
    // setInterval(() => {

    scene1.animations.forEach((a) => {
      if (a.name !== 'Anim_CameraSolver' && a.name !== 'Anim_Rocket')
        actions[a.name].play();
    });

    // console.log(state.camera.position);
    let position = cameraRoutes[0].pos;
    let route = new Vector3(position[0], scene1.nodes['CameraSolver'].position.y, position[2]);
    let m = new LinearMovement(scene1.nodes['CameraSolver'].position, route);
    // state.camera.lookAt(scene1.nodes['CameraSolver'].position);
    // state.camera.position.set(0, 150, 0);
    // // state.camera.lookAt(scene1.nodes['CameraSolver'].position);
    // state.camera.up.set(0, 1, 0);
    // state.camera.lookAt(0, 150, 0);
    state.camera.zoom = 1;
    dispatch({ type: Actions.UPDATE_CAMERA, payload: state.camera });
    // scene1.nodes['CameraSolver'].position.copy(state.playerMesh.position);
    setMovement(m);
  }, [state.playerMesh]);

  useFrame(({ controls }) => {
    if (state?.playerMesh)
      controls.target = state?.playerMesh.position
  });

  useFrame(({ camera }, delta) => {
    if (!state?.playerMesh)
      return;

    if (world)
      world.step(timeStep);

    playerBody.position.copy(state.playerMesh.position);
    playerBody.quaternion.copy(state.playerMesh.quaternion);
    playerBody.position.y = 3.5;
    setPlayerBody(playerBody);

    playerFrame.position.copy(frameBody.position);
    playerFrame.quaternion.copy(frameBody.quaternion);
    playerBox.position.copy(state.playerMesh.position);
    playerBox.quaternion.copy(state.playerMesh.quaternion);
    playerBox.position.y = 3.5;
    setPlayerBox(playerBox);

    // let geoms = updatePosition(state.playerMesh.position);
    // let colliders = [];
    // geoms.forEach((obj) => {
    //   let clone = obj.clone();
    //   const mergedGeometry = BufferGeometryUtils.mergeBufferGeometries(
    //     [clone.geometry],
    //     false
    //   );
    //   mergedGeometry.boundsTree = new MeshBVH(mergedGeometry, {
    //     maxDepth: 200,
    //   });
    //   clone.geometry = mergedGeometry;
    //   colliders.push(clone);
    // });
    // dispatch({ type: Actions.UPDATE_MOVABLE_COLLIDERS, payload: colliders });
    // console.log(!collide)
    // dispatch({type: Actions.UPDATE_MOVEMENT, payload: !collide});

    poolItems.map((item, index) => {
      scene1.nodes[poolItemNames[index]].position.copy(item.position);
      scene1.nodes[poolItemNames[index]].quaternion.copy(item.quaternion);
    });
    // camera.position.y = 175;
    state.playerMesh.visible = introDone;
    scene1.nodes["Tutorial"].visible = introDone;
    if (!isPlaying) {

      if (moveToStart) {
        //camera.fov = window.screen.width === 1920 ? 80 : 50;
        // console.log(currentRoute);
        if (cameraRoutes[currentRoute] !== undefined) {
          let position = cameraRoutes[currentRoute].pos;
          let rotation = cameraRoutes[currentRoute].rotation;
          let cubePos = scene1.nodes['CameraSolver'].position;

          if (cubePos.x <= (position[0] + 0.02)
            && cubePos.z <= (position[2] + 0.02)) {
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
            cameraMesh.position.copy(newPosition);
            state.controls.update();
            if (currentRoute === (cameraRoutes.length - 1)) {
              state.controls.target.copy(cameraMesh.position)
              if (camera.position.x < 5.78551222602024 && camera.position.z < 60.825936793399624) {
                // console.log("Setting camera pos");
                let cmPosition = camereaMovment.move();
                camera.position.copy(cmPosition);
              }
              // console.log(cameraMesh.position);
              camera.lookAt(cameraMesh.position);
              setZoomCamera(true);
              // camera.zoom = 12;
              if (introZoomAnim.zoomProp.animation.values[0] && state.camera.zoom < 4.5) {
                // console.log(introZoomAnim.zoomProp.animation.values[0]._value);
                state.camera.zoom = introZoomAnim.zoomProp.animation.values[0]._value;
                // console.log(state.camera.zoom);
              }
            } else {
              camera.position.x = newPosition.x;
              camera.position.z = newPosition.z;
              camera.up.set(0, 1, 0);
              camera.lookAt(cameraMesh.position);
              // console.log(camera.position.y);
            }

            // camera.lookAt(new Vector3(rotation[0], rotation[1], rotation[2]));
          }


        } else {
          // console.log("intro done.");
          // scene1.nodes['CameraSolver'].position.copy(state.playerMesh.position);
          // camera.up.set(0, 1, 0);
          // camera.lookAt(state.playerMesh.position);
          // let lastControl = state.playerMesh.position;
          // camera.position.sub(lastControl);
          // state.controls.target.copy(state.playerMesh.position);
          // camera.position.add(state.playerMesh.position);
          // camera.position.y = 175;
          // camera.quaternion.rotateTowards(state.playerMesh.quaternion, 0.1);

          // let route = new Vector3(-57.53, state.playerMesh.position.y, 8);
          // let m = new LinearMovement(cameraMesh.position, route);
          // let pos = m.move();
          // camera.position.x = 5.78651222602025;
          // camera.position.y = 72.32470228479104;
          // camera.position.z = 60.826936793399625;

          // camera.lookAt(state.playerMesh.position);
          // state.camera.rotation.setFromVector3(new Vector3(0, Math.PI / 2, 0));

          if (!introDone)
            setZoomCamera(false);
          setIntroDone(true);
          setIsplaying(true);
        }
      } else {
        camera.position.set(0, 90, 0);
        camera.up.set(0, 1, 0);
        // camera.lookAt(0, 0, 0);
        camera.lookAt(cameraMesh.position);
      }
      // console.log(camera);
      dispatch({ type: Actions.UPDATE_CAMERA, payload: camera });
      dispatch({ type: Actions.UPDATE_CONTROLS, payload: state.controls });
    } else {

      if (scene1.nodes["Tutorial"].material.opacity < 1 && !hideTutorial)
        scene1.nodes["Tutorial"].material.opacity += 0.05;
      // if (introZoomAnim.zoomProp.animation.values[0] && camera.zoom < 12) {
      //   camera.zoom = introZoomAnim.zoomProp.animation.values[0]._value;
      // }
      // camera.zoom = 12;
      // console.log(camera.position);
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
      if (zoomAnim.zoomProp.animation.values[0] && state.camera.zoom > 2) {
        state.camera.zoom = zoomAnim.zoomProp.animation.values[0]._value;
      }
    } else if (!zoomCamera && launchRocket) {
      if (zoomAnim.zoomProp.animation.values[0]) {
        console.log(zoomAnim.zoomProp.animation.values[0]._value)
        if (zoomAnim.zoomProp.animation.values[0]._value >= 4.5) {
          setLaunchRocket(false);
          setIsplaying(true);
        } else {
          setModal(false);
          state.camera.zoom = zoomAnim.zoomProp.animation.values[0]._value;
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
    scene1.nodes["Tutorial"].material.transparent = true;
    scene1.nodes["Tutorial"].material.opacity = 0.01;
    scene1.nodes['1_E_Object'].material.metalness = 0;
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
    let ground = new CANNON.Body({
      type: CANNON.Body.STATIC
    });
    let groundShape = CannonUtils.CreateTrimesh(mergedGeometry);
    ground.addShape(groundShape);
    ground.position.copy(collider.position);
    ground.quaternion.copy(collider.quaternion);
    world.addBody(ground);
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
            dispatch({ type: Actions.UPDATE_CAMERA, payload: state.camera });
            setTimeout(() => {
              actions["Anim_Rocket"].play();
              setTimeout(() => {
                c.visible = false;
                setModal(true);
                // setLaunchRocket(false);
                setZoomCamera(false);
                // setIsplaying(true);
                // state.camera.zoom = 4.5;
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
