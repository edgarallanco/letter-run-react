import {useFrame, useLoader, useThree} from '@react-three/fiber';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
import React, {useContext, useEffect, useState, useRef} from 'react';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import * as THREE from 'three';
import {MeshBVH, MeshBVHVisualizer} from 'three-mesh-bvh';
import {AppDispatchContext, AppStateContext} from 'context/AppContext';
import {Actions} from 'reducer/AppReducer';
import stateValtio from 'context/store';
import {CameraHelper} from 'three';
import {useGLTF} from '@react-three/drei';
import useSpline from '@splinetool/r3f-spline';
import {OrthographicCamera} from '@react-three/drei';

const Scene = ({checkpoint, isModal}) => {
  const {state} = useContext(AppStateContext);
  const {dispatch} = useContext(AppDispatchContext);
  let visualizer, environment;
  const {scene, camera} = useThree();
  const [stairs, setStairs] = useState([]);
  let collider;
  const scene1 = useGLTF('./../resources/EA_Baking_v1.glb');

  useEffect(() => {
    // collect all geometries to merge
    if (!state.playerMesh) return;
    // scene.castShadow = true;
    scene.receiveShadow = true;
    const geoms = [];
    environment = scene1.scene;
    dispatch({type: Actions.UPDATE_ENVIROMENT, payload: environment});
    environment.scale.setScalar(1.5);
    environment.updateMatrixWorld(true);

    environment.traverse((c) => {
      if (c.geometry) {
        const cloned = c.geometry.clone();
        cloned.applyMatrix4(c.matrixWorld);
        for (const key in cloned.attributes) {
          if (key !== 'position') {
            cloned.deleteAttribute(key);
          }
        }
        // if (c.userData.name !== 'Geometry') {
        //   c.visible = false;
        //   cloned.name = c.userData.name;
        //   stateValtio.stairs.push(cloned);
        //   setStairs(stairs.push(c));
        // } else {
        geoms.push(cloned);
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
    visualizer = new MeshBVHVisualizer(collider, 10);
    dispatch({type: Actions.UPDATE_COLLIDER, payload: collider});

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
    // if (isModal) return;
    environment = scene1.scene;
    let currentStair = stateValtio.stairs.find(
      (stair) => stair.name === checkpoint.stair
    );
    if (!currentStair) return;
    environment.children.map((c) => {
      if (c.userData.name === currentStair.name) {
        c.visible = true;
      }
    });
    currentStair && stateValtio.collection.push(checkpoint.item);
    currentStair && stateValtio.geometries.push(currentStair);
    const mergedGeometry = BufferGeometryUtils.mergeBufferGeometries(
      stateValtio.geometries,
      false
    );
    mergedGeometry.boundsTree = new MeshBVH(mergedGeometry);
    collider = new THREE.Mesh(mergedGeometry);
    dispatch({type: Actions.UPDATE_COLLIDER, payload: collider});
  }, [isModal]);
  return (
    <>
      {/* <group position-x={0} position-y={0.5} position-z={0} scale={1.5}>
        <mesh geometry={scene1.nodes['Ground'].geometry}></mesh>
        <mesh
          geometry={scene1.nodes['1_E_Room'].geometry}
          material={scene1.nodes['1_E_Room'].material}
        ></mesh>
        <mesh
          geometry={scene1.nodes['1_E_Objects'].geometry}
          material={scene1.nodes['1_E_Objects'].material}
        ></mesh>
        <mesh
          geometry={scene1.nodes['1_E_Stairs'].geometry}
          material={scene1.nodes['1_E_Stairs'].material}
        ></mesh>
      </group> */}
    </>
  );
};

export default Scene;
