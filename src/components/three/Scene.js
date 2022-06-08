import {useThree} from '@react-three/fiber';
import React, {useContext, useEffect, useState, useRef} from 'react';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import * as THREE from 'three';
import {MeshBVH, MeshBVHVisualizer} from 'three-mesh-bvh';
import {AppDispatchContext, AppStateContext} from 'context/AppContext';
import {Actions} from 'reducer/AppReducer';
import stateValtio from 'context/store';
import {useGLTF} from '@react-three/drei';

const Scene = ({checkpoint, isModal}) => {
  const {state} = useContext(AppStateContext);
  const {dispatch} = useContext(AppDispatchContext);
  let environment;
  const {scene, camera, gl} = useThree();
  const [stairs, setStairs] = useState([]);
  let collider;
  const scene1 = useGLTF('./../resources/EA_Baking_AllLetters_v14.glb');

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
        if (c.name.includes('Invisible')) {
          c.visible = false;
        }
        if (c.name.includes('Ground')) {
          // c.material = new THREE.MeshStandardMaterial();
          // c.color = new THREE.Color('black');
          // c.layers.set(3);
          console.log(scene);
        }
        if (c.name.includes('Stairs')) {
          c.visible = false;
          cloned.name = c.userData.name;
          stateValtio.stairs.push(cloned);
          setStairs(stairs.push(c));
        } else if (!c.name.includes('Grass')) {
          cloned.name = c.userData.name;
          geoms.push(cloned);
        }
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
    if (!isModal) return;
    environment = scene1.scene;
    let currentStair = stateValtio.stairs.find(
      (stair) => stair.name === checkpoint.stair
    );
    if (!currentStair) return;
    environment.children.map((c) => {
      if (c.userData.name === currentStair.name) {
        c.visible = true;
      }
      if (c.userData.name === checkpoint.object) {
        c.visible = false;
      }
    });
    currentStair && stateValtio.collection.push(checkpoint.item);
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
    dispatch({type: Actions.UPDATE_COLLIDER, payload: collider});
  }, [isModal]);
};

export default Scene;
