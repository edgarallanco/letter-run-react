import { useFrame, useThree } from '@react-three/fiber';
import React, { useContext, useEffect, useState, useRef } from 'react';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import * as THREE from 'three';
import { MeshBVH, MeshBVHVisualizer } from 'three-mesh-bvh';
import { AppDispatchContext, AppStateContext } from 'context/AppContext';
import { Actions } from 'reducer/AppReducer';
import stateValtio from 'context/store';
import { useAnimations, useGLTF } from '@react-three/drei';
import { BoxGeometry, Euler, Mesh, MeshBasicMaterial, Quaternion, Vector3, WireframeGeometry } from 'three';
import { easings, useSpring } from 'react-spring';
import LinearMovement from 'components/scripts/LinearMovement';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
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
  const [movement, setMovement] = useState();
  const [camereaMovment, setCameraMovement] = useState();
  const [playerBody, setPlayerBody] = useState();
  const [cameraMesh, setCameraMesh] = useState();
  const [camPosition, setCamPosition] = useState(new Vector3(0, 90, 6));
  const [camRotation, setCamRotation] = useState(new Euler());
  let collider;
  const loader = new GLTFLoader();
  const scene1 = useGLTF('https://fargamot.s3.amazonaws.com/resources/ea_baked_world_v5.glb');
  const [world, setWorld] = useState();

  const animations = [];
  const cameraRoutes = [
    { pos: [0, 90, 6], rotation: [0, 0, 0] },
    { pos: [-57.53, 3.79, -8], rotation: [60.6, 0, 36] },
  ]

  const initialPos = cameraRoutes[0].pos;

  const poolItemNames = [
    'Pool_Item_1', 'Pool_Item_2', 'Pool_Item_6', 'Pool_Item_3'
  ]
  // const poolItemNames = [];

  scene1.animations.forEach((ani) => {
    let exists = animations.find((a) => {
      return a.name === ani.name;
    });
    if (!exists)
      animations.push(ani);
  });

  const { actions } = useAnimations(animations, scene1.scene);

  const zoomAnim = useSpring({
    config: { duration: 2000, easing: easings.easeInOutCubic},
    zoomProp: zoomCamera ? 1 : 8,
  });

  const introZoomAnim = useSpring({
    config: { duration: 3000, easing: easings.easeInOutCubic, step: 1 },
    zoomProp: !zoomCamera ? 1 : 4.5,
  });

  useEffect(() => {

    let cm = new Mesh(new BoxGeometry(1, 1, 1), new MeshBasicMaterial({ color: 0x00ff00 }));
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

    setupPhysics(scene);

  }, []);

  useEffect(() => {
    if (!state.playerMesh)
      return;
    scene1.animations.forEach((a) => {
      if (a.name !== 'Anim_Rocket')
        actions[a.name].play();
    });

    let position = initialPos;
    let route = new Vector3(position[0], position[1], position[2]);
    let m = new LinearMovement(cameraMesh.position, route, 0.001);
    state.camera.zoom = 1;
    setMovement(m);

    dispatch({ type: Actions.UPDATE_CAMERA, payload: camera });
    //setPlayerOpacity(state.playerMesh, 1, true);
    dispatch({ type: Actions.UPDATE_PLAYER_MESH, payload: state.playerMesh });
    // console.log(state.playerMesh);

  }, [state.playerMesh]);

  useEffect(() => {
    if (moveToStart) {
      animate(camera, cameraMesh, setCamPosition, setCamRotation, initialPos).then(
        () => {
          //setIsplaying(true);
          setIntroDone(true);
        }
      )
    }
  }, [moveToStart])

  const setPlayerOpacity = (mesh, opacity, transparent) => {
    if (mesh.material) {
      mesh.material.transparent = transparent;
      mesh.material.opacity = opacity;
    }

    mesh.children.forEach((m) => {
      if (m.material) {
        m.material.opacity = opacity;
        m.material.transparent = transparent;
      }

      if (m.children)
        setPlayerOpacity(m, opacity, transparent);
    })
  }

  useFrame(({ controls }) => {
    if (state?.playerMesh)
      controls.target = introDone ? state?.playerMesh.position : cameraMesh.position;
  });

  useFrame(({ }, delta) => {
    if (!state?.playerMesh)
      return;

    worldStep(state?.playerMesh);

    setPlayerBody(playerBody);
    state.playerMesh.visible = playerVis; 
    if ((playerVis === true) && (state.playerMesh.material.opacity < 1)){
      console.log(state.playerMesh.material.opacity + " = player opacity")
      state.playerMesh.material.opacity += .02;
    } 

    if (!isPlaying) {
      if (moveToStart) {
        if (!introDone) {
          camera.position.copy(camPosition);
          camera.rotation.copy(camRotation);
        } 
      } else {
        camera.position.set(initialPos[0], initialPos[1], initialPos[2]);
        camera.up.set(0, 1, 0);
        camera.lookAt(cameraMesh.position);
        let rotation = new Euler().copy(camera.rotation);
        setCamRotation(rotation);
      }
    } else {
      window.addEventListener( "mousedown", event => {  
        if (orbitChange === false){
          orbitChange = true;
          console.log( controls.object.position );  
        }
      }) 
      window.addEventListener( "wheel", event => {  
        if (orbitChange === false){
          orbitChange = true;
          console.log( controls.object.position );  
        }
      }) 
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
      if (zoomAnim.zoomProp.animation.values[0] && camera.zoom > 1) {
        camera.zoom = zoomAnim.zoomProp.animation.values[0]._value;
      }
    } else if (!zoomCamera && launchRocket) {
      if (zoomAnim.zoomProp.animation.values[0]) {
        //console.log(zoomAnim.zoomProp.animation.values[0]._value)
        if (zoomAnim.zoomProp.animation.values[0]._value >= 8) {
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

    environment.traverse((c) => {
      // console.log(c);
      if (c.geometry) {
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
          c.visible = found && c.userData.name !== '7_L_Object' ? false : true;
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
          console.log(c.userData.name + " is the name");
          console.log("x =" + c.position.x + ", y = " + c.position.y + ", z =" + c.position.z + " is the position");
          console.log(cloned)
        }
      }
    });

    let tableCoverGeometry = new BoxGeometry(3.4, 2, 1);
    let tableCover = new Mesh(tableCoverGeometry, new MeshBasicMaterial({color: 0x00ff00}));
    tableCover.position.set(38.334056074594814, 1.3713684053557624, -9.542654586242868);
    scene.add(tableCover);

    stateValtio.geometries = geoms;
    // create the merged geometry
    const mergedGeometry = BufferGeometryUtils.mergeBufferGeometries(
      geoms,
      false
    );
    mergedGeometry.boundsTree = new MeshBVH(mergedGeometry, {
      maxDepth: 200,
      visible: false,
    });
    const collider = new THREE.Mesh(mergedGeometry);
    collider.material.opacity = 0;
    collider.material.transparent = true;
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
    if (!checkpoint) { 
      // when checkpoint is null, reset the rocket
      scene1.nodes["7_L_Object"].visible = true;
      scene1.nodes["7_L_Button"].position.y = 0;
      return;
    }
    environment = scene1.scene;
    // console.log(checkpoint);
    let currentStair = stateValtio.stairs.find(
      (stair) => stair.name === checkpoint.stair
    );
    console.log("Stair is: ", currentStair);
    // if (!currentStair) return;
    environment.children.map((c) => {
      if (currentStair) {
        if (c.userData.name === currentStair.name) {
          c.visible = true;
        }
      }
      if (c.userData.name === checkpoint.object) {
        if (checkpoint.item_name === 'Spaceship') {
          stateValtio.action = 'Anim_Idle';
          setIsplaying(false);
          setLaunchRocket(true);
          setTimeout(() => {
            setTimeout(() => {
              actions["Anim_Rocket"].play();
              setTimeout(() => {
                c.visible = false;
                setModal(true);
                // setLaunchRocket(false);
                setZoomCamera(false);
                actions["Anim_Rocket"].stop();
                UpdateItems('rocket', true);
              }, 2000)
            }, 1000);
          }, 1500);
        } else {
          c.visible = false;
        }
      }
    });
    if (currentStair) {
      currentStair && stateValtio.collection.push(checkpoint.item_name);
      currentStair && stateValtio.geometries.push(currentStair);
      stateValtio.geometries = currentStair
        ? stateValtio.geometries.filter((geom) => geom.name !== checkpoint.object)
        : stateValtio.geometries;
    }

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
