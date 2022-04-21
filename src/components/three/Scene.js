import { useLoader, useThree } from "@react-three/fiber";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import React, { useContext, useEffect } from "react";
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { MeshBVH, MeshBVHVisualizer } from 'three-mesh-bvh';
import { Mesh } from "three";
import { AppDispatchContext } from 'context/AppContext';
import { Actions } from "reducer/AppReducer";

const Scene = (props) => {
  const gltf = useLoader(GLTFLoader, './../resources/EA_Scene_v2.glb');
  const { dispatch } = useContext(AppDispatchContext);

  useEffect(() => {
    gltf.scene.scale.setScalar(1.5);
    gltf.scene.updateMatrixWorld(true);
    const geometries = [];

    gltf.scene.traverse((c) => {
      // console.log(c.userData.name);
      if (c.geometry) {
        const cloned = c.geometry.clone();
        cloned.applyMatrix4(c.matrixWorld);
        for (const key in cloned.attributes) {
          if (key !== 'position') {
            cloned.deleteAttribute(key);
          }
        }

        geometries.push(cloned);
      }

      if (c.material) {
        c.castShadow = true;
        c.receiveShadow = true;
        c.material.shadowSide = 2;
      }
      // if (c.userData.name === 'LP_Stairs') {
      //   stairs = c;
      //   stairs.visible = true;
      // }
    });

    // create the merged geometry
    const mergedGeometry = BufferGeometryUtils.mergeBufferGeometries(
      geometries,
      false
    );
    mergedGeometry.boundsTree = new MeshBVH(mergedGeometry);

    let collider = new Mesh(mergedGeometry);
    collider.material.wireframe = true;
    collider.material.opacity = 0.5;
    collider.material.transparent = true;
    dispatch({ type: Actions.UPDATE_COLLIDER, payload: collider });
    // gltf.scene.add(collider);
  });

  return (
    <primitive {...props} object={gltf.scene} />
  )
}

export default Scene;