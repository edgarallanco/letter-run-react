import {useFrame, useLoader, useThree} from '@react-three/fiber';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
import React, {useContext, useEffect, useState, useRef} from 'react';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import * as THREE from 'three';
import {MeshBVH, MeshBVHVisualizer} from 'three-mesh-bvh';
import {AppDispatchContext, AppStateContext} from 'context/AppContext';
import {Actions} from 'reducer/AppReducer';

const Scene = ({checkpoint, isModal}) => {
  const gltf = useLoader(GLTFLoader, './../resources/EA_Scene_v2.glb');
  const {state} = useContext(AppStateContext);
  const {dispatch} = useContext(AppDispatchContext);
  let visualizer, environment;
  const {scene} = useThree();
  const sound = useRef();
  const [stairsBackup, setStairsBackup] = useState();
  // const [environment, setEnvironment] = useState(null);
  const [stairs, setStairs] = useState();
  let collider;
  const [geometries, setGeometries] = useState([]);

  useEffect(() => {
    // collect all geometries to merge
    if (!state.playerMesh) return;
    const geoms = [];
    environment = gltf.scene;
    // environment.add(state.playerMesh);
    // setEnvironment(gltf.scene);
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
        if (c.userData.name === '1_E_Stairs') {
          setStairsBackup(cloned);
          c.visible = false;
          c.geometries = undefined;
          setStairs(c);
        } else {
          geoms.push(cloned);
        }
      }
    });
    setGeometries(geoms);
    // create the merged geometry
    // console.log(state.playerMesh, environment);
    const mergedGeometry = BufferGeometryUtils.mergeBufferGeometries(
      geoms,
      false
    );
    mergedGeometry.boundsTree = new MeshBVH(mergedGeometry);
    const collider = new THREE.Mesh(mergedGeometry);
    collider.material.wireframe = true;
    collider.material.opacity = 0.5;
    collider.material.transparent = true;
    visualizer = new MeshBVHVisualizer(collider, 10);
    dispatch({type: Actions.UPDATE_COLLIDER, payload: collider});

    environment.traverse((c) => {
      if (c.material) {
        c.castShadow = true;
        c.receiveShadow = true;
        c.material.shadowSide = 2;
      }
    });

    scene.add(collider);
    scene.add(environment);
  }, [state.playerMesh]);

  useEffect(() => {
    if (!isModal) return;
    if (!stairsBackup) return;
    setGeometries(geometries.push(stairsBackup));
    setStairs((stairs.visible = true));
    const mergedGeometry = BufferGeometryUtils.mergeBufferGeometries(
      geometries,
      false
    );
    mergedGeometry.boundsTree = new MeshBVH(mergedGeometry);
    collider = new THREE.Mesh(mergedGeometry);
    collider.material.wireframe = true;
    collider.material.opacity = 0.5;
    collider.material.transparent = true;
    visualizer = new MeshBVHVisualizer(collider, 10);
    dispatch({type: Actions.UPDATE_COLLIDER, payload: collider});
    setStairsBackup(null);
  }, [isModal]);
};

export default Scene;
