import React, {useContext, useEffect, useState, useRef} from 'react';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import * as THREE from 'three';
import {AppDispatchContext, AppStateContext} from 'context/AppContext';
import {Actions} from 'reducer/AppReducer';
import {useFrame, useThree} from '@react-three/fiber';
import {Vector3} from 'three';

function Sphere() {
  const [spheres, setSpheres] = useState([]);
  //   let spheres = [];
  const [hits, setHits] = useState([]);
  const tempSphere = new THREE.Sphere();
  const deltaVec = new THREE.Vector3();
  const tempVec = new THREE.Vector3();
  const forwardVector = new THREE.Vector3(0, 0, 1);
  const {scene, camera, gl} = useThree();
  const {state} = useContext(AppStateContext);
  const {dispatch} = useContext(AppDispatchContext);
  const params = {
    displayCollider: false,
    displayBVH: false,
    displayParents: false,
    visualizeDepth: 10,
    gravity: -9.8,
    physicsSteps: 5,
    // TODO: support steps based on given sphere velocity / radius
    simulationSpeed: 1,
    sphereSize: 1,
    pause: false,
    // step: () => {
    //   const steps = params.physicsSteps;
    //   for (let i = 0; i < steps; i++) {
    //     update(0.016 / steps);
    //   }
    // },
  };

  useEffect(() => {
    if (!gl) return;
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let x = 0;
    let y = 0;
    gl.domElement.addEventListener('pointerdown', (e) => {
      x = e.clientX;
      y = e.clientY;
    });

    gl.domElement.addEventListener('pointerup', (e) => {
      const totalDelta = Math.abs(e.clientX - x) + Math.abs(e.clientY - y);
      if (totalDelta > 2) return;

      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);

      const sphere = createSphere();
      sphere.position
        .copy(camera.position)
        .addScaledVector(raycaster.ray.direction, 3);
      sphere.velocity
        .set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5)
        .addScaledVector(raycaster.ray.direction, 10 * Math.random() + 15)
        .multiplyScalar(0.5);
    });

    window.addEventListener(
      'resize',
      function () {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        gl.setSize(window.innerWidth, window.innerHeight);
      },
      false
    );
    console.log(state.collider);
  }, [gl]);

  //   useEffect(() => {
  //     if (!state.collider) return;
  //     if (!state.playerMesh) return;
  //     console.log(
  //       state.collider.geometry.boundsTree,
  //       state.playerMesh.geometry.boundsTree
  //     );
  //     state.collider.merge(state.playerMesh);
  //   }, [state.collider]);

  useFrame((stateCanvas, delta) => {
    if (state.collider) {
      const steps = params.physicsSteps;
      for (let i = 0; i < steps; i++) {
        updateSphereCollisions(delta / steps);
      }
    }
  });
  function onCollide(object1, object2, point, normal, velocity, offset = 0) {
    if (velocity < Math.max(Math.abs(0.04 * params.gravity), 5)) {
      return;
    }

    // Create an animation when objects collide
    const effectScale =
      Math.max(
        object2
          ? Math.max(object1.collider.radius, object2.collider.radius)
          : object1.collider.radius,
        0.4
      ) * 2.0;
    const plane = new THREE.Mesh(
      new THREE.RingBufferGeometry(0, 1, 30),
      new THREE.MeshBasicMaterial({
        side: 2,
        transparent: true,
        depthWrite: false,
      })
    );
    plane.lifetime = 0;
    plane.maxLifetime = 0.4;
    plane.maxScale =
      effectScale *
      Math.max(Math.sin((Math.min(velocity / 200, 1) * Math.PI) / 2), 0.35);

    plane.position.copy(point).addScaledVector(normal, offset);
    plane.quaternion.setFromUnitVectors(forwardVector, normal);
    scene.add(plane);
    hits.push(plane);
  }

  function createSphere() {
    const white = new THREE.Color(0xffffff);
    const color = new THREE.Color(0x263238 / 2)
      .lerp(white, Math.random() * 0.5 + 0.5)
      .convertSRGBToLinear();
    const sphere = new THREE.Mesh(
      new THREE.SphereBufferGeometry(1, 20, 20),
      new THREE.MeshStandardMaterial({color})
    );
    scene.add(sphere);
    sphere.castShadow = true;
    sphere.receiveShadow = true;
    sphere.material.shadowSide = 2;

    const radius = 0.5 * params.sphereSize * (Math.random() * 0.2 + 0.6);
    sphere.scale.setScalar(radius);
    sphere.collider = new THREE.Sphere(sphere.position, radius);
    sphere.velocity = new THREE.Vector3(0, 0, 0);
    sphere.mass = (Math.pow(radius, 3) * Math.PI * 4) / 3;

    // spheres.push(sphere);
    setSpheres([...spheres, sphere]);
    return sphere;
  }

  function updateSphereCollisions(deltaTime) {
    // TODO: Add visualization for velocity vector, collision vector, all intersection vectors
    if (state.collider) {
      //   console.log(state.collider.geometry.boundsTree, state.playerMesh);
    }
    const bvh = state.collider.geometry.boundsTree;
    for (let i = 0, l = spheres.length; i < l; i++) {
      //   console.log(deltaTime);
      const sphere = spheres[i];
      const sphereCollider = sphere.collider;

      // move the sphere
      sphere.velocity.y += params.gravity * deltaTime;
      sphereCollider.center.addScaledVector(sphere.velocity, deltaTime);

      // remove the spheres if they've left the world
      if (sphereCollider.center.y < -80) {
        spheres.splice(i, 1);
        i--;
        l--;

        sphere.material.dispose();
        sphere.geometry.dispose();
        scene.remove(sphere);
        continue;
      }

      // get the sphere position in world space
      tempSphere.copy(sphere.collider);
      //   console.log(bvh);
      let collided = false;
      bvh.shapecast({
        intersectsBounds: (box) => {
          return box.intersectsSphere(tempSphere);
        },

        intersectsTriangle: (tri) => {
          // get delta between closest point and center
          tri.closestPointToPoint(tempSphere.center, deltaVec);
          deltaVec.sub(tempSphere.center);
          const distance = deltaVec.length();
          if (distance < tempSphere.radius) {
            // move the sphere position to be outside the triangle
            const radius = tempSphere.radius;
            const depth = distance - radius;
            deltaVec.multiplyScalar(1 / distance);
            tempSphere.center.addScaledVector(deltaVec, depth);

            collided = true;
          }
        },

        traverseBoundsOrder: (box) => {
          return box.distanceToPoint(tempSphere.center) - tempSphere.radius;
        },
      });

      if (collided) {
        // get the delta direction and reflect the velocity across it
        deltaVec
          .subVectors(tempSphere.center, sphereCollider.center)
          .normalize();
        sphere.velocity.reflect(deltaVec);

        // dampen the velocity and apply some drag
        const dot = sphere.velocity.dot(deltaVec);
        sphere.velocity.addScaledVector(deltaVec, -dot * 0.5);
        sphere.velocity.multiplyScalar(Math.max(1.0 - deltaTime, 0));

        // update the sphere collider position
        sphereCollider.center.copy(tempSphere.center);

        // find the point on the surface that was hit
        tempVec
          .copy(tempSphere.center)
          .addScaledVector(deltaVec, -tempSphere.radius);
        onCollide(sphere, null, tempVec, deltaVec, dot, 0.05);
      }
    }

    // Handle sphere collisions
    for (let i = 0, l = spheres.length; i < l; i++) {
      const s1 = spheres[i];
      const c1 = s1.collider;
      for (let j = i + 1; j < l; j++) {
        const s2 = spheres[j];
        const c2 = s2.collider;

        // If they actually intersected
        deltaVec.subVectors(c1.center, c2.center);
        const depth = deltaVec.length() - (c1.radius + c2.radius);
        if (depth < 0) {
          deltaVec.normalize();

          // get the magnitude of the velocity in the hit direction
          const v1dot = s1.velocity.dot(deltaVec);
          const v2dot = s2.velocity.dot(deltaVec);

          // distribute how much to offset the spheres based on how
          // quickly they were going relative to each other. The ball
          // that was moving should move back the most. Add a max value
          // to avoid jitter.
          const offsetRatio1 = Math.max(v1dot, 0.2);
          const offsetRatio2 = Math.max(v2dot, 0.2);

          const total = offsetRatio1 + offsetRatio2;
          const ratio1 = offsetRatio1 / total;
          const ratio2 = offsetRatio2 / total;

          // correct the positioning of the spheres
          c1.center.addScaledVector(deltaVec, -ratio1 * depth);
          c2.center.addScaledVector(deltaVec, ratio2 * depth);

          // Use the momentum formula to adjust velocities
          const velocityDifference = new THREE.Vector3();
          velocityDifference
            .addScaledVector(deltaVec, -v1dot)
            .addScaledVector(deltaVec, v2dot);

          const velDiff = velocityDifference.length();
          const m1 = s1.mass;
          const m2 = s2.mass;

          // Compute new velocities in the moving frame of the sphere that
          // moved into the other.
          let newVel1, newVel2;
          const damping = 0.5;
          if (
            velocityDifference.dot(s1.velocity) >
            velocityDifference.dot(s2.velocity)
          ) {
            newVel1 = (damping * velDiff * (m1 - m2)) / (m1 + m2);
            newVel2 = (damping * velDiff * 2 * m1) / (m1 + m2);

            // remove any existing relative velocity from the moving sphere
            newVel1 -= velDiff;
          } else {
            newVel1 = (damping * velDiff * 2 * m2) / (m1 + m2);
            newVel2 = (damping * velDiff * (m2 - m1)) / (m1 + m2);

            // remove any existing relative velocity from the moving sphere
            newVel2 -= velDiff;
          }

          // Apply new velocities
          velocityDifference.normalize();
          s1.velocity.addScaledVector(velocityDifference, newVel1);
          s2.velocity.addScaledVector(velocityDifference, newVel2);

          tempVec.copy(c1.center).addScaledVector(deltaVec, -c1.radius);
          onCollide(s1, s2, tempVec, deltaVec, velDiff, 0);
        }
      }

      s1.position.copy(c1.center);
    }
  }
}

export default Sphere;
