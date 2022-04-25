import {useLoader, useThree} from '@react-three/fiber';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
import React, {useContext, useEffect} from 'react';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import * as THREE from 'three';
import {MeshBVH, MeshBVHVisualizer} from 'three-mesh-bvh';
import {AppDispatchContext} from 'context/AppContext';
import {Actions} from 'reducer/AppReducer';

const Scene = (props) => {
  const gltf = useLoader(GLTFLoader, './../resources/EA_Scene_v2.glb');
  const {dispatch} = useContext(AppDispatchContext);
  let environment, visualizer
  const {scene} = useThree();

  useEffect(() => {
    // collect all geometries to merge
    let geometries = [];
    environment = gltf.scene;
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
        // if (c.userData.name === '1_E_Stairs') {
        //   stairs = c;
        //   stairsBackup = cloned;
        //   stairsBackup.userData = 'stairs';
        //   console.log(c, stairsBackup);
        // }
        geometries.push(cloned);
      }
    });

    // create the merged geometry
    const mergedGeometry = BufferGeometryUtils.mergeBufferGeometries(
      geometries,
      false
    );
    mergedGeometry.boundsTree = new MeshBVH(mergedGeometry);
    const collider = new THREE.Mesh(mergedGeometry);
    collider.material.wireframe = true;
    collider.material.opacity = 0.5;
    collider.material.transparent = true;
    visualizer = new MeshBVHVisualizer(collider, 10);
    dispatch({type: Actions.UPDATE_COLLIDER, payload: collider});
    scene.add(visualizer);
    scene.add(collider);
    scene.add(environment);

    environment.traverse((c) => {
      if (c.material) {
        c.castShadow = true;
        c.receiveShadow = true;
        c.material.shadowSide = 2;
      }
    });
  }, []);
};

export default Scene;
