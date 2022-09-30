import * as CANNON from 'cannon-es';
import { loadPoolNoodles, updatePosition } from 'src/utils/LoadPoolNoodles';
import { loadPlanes } from 'src/utils/LoadPoolPlanes';
const timeStep = 1 / 60;

const world = new CANNON.World({
  gravity: new CANNON.Vec3(0, -9.81, 0)
});

let pBody = null;

export const setupPhysics = (scene) => {
  let groundBody = new CANNON.Body({
    shape: new CANNON.Plane(),
    type: CANNON.Body.STATIC
  });
  groundBody.position.set(0, 2.8, 0);
  groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
  world.addBody(groundBody);

  let noodleMaterial = new CANNON.Material('noodle');
  noodleMaterial.friction = 0.5;
  noodleMaterial.restitution = 0.2;

  let playerMaterial = new CANNON.Material('player');
  playerMaterial.friction = 0.5;
  playerMaterial.restitution = 0.2;
  let playerShape = new CANNON.Cylinder(0.5, 0.5, 2);

  pBody = new CANNON.Body({
    mass: 1,
    shape: playerShape,
    type: CANNON.Body.KINEMATIC,
    material: playerMaterial,
    // position: new CANNON.Vec3(state.playerMesh.position.x, state.playerMesh.position.y, state.playerMesh.position.z)
    velocity: new CANNON.Vec3(2, 0, 2)
  });
  // console.log(state.playerMesh);
  // let playerShape = new CANNON.Vec3(1, 1, 1);
  // pBody.addShape(playerShape);

  let contactMaterial = new CANNON.ContactMaterial(playerMaterial, noodleMaterial, {
    friction: 0.5,
    restitution: 0.1
  });
  // contactMaterial.friction = 0.5;
  // contactMaterial.restitution = 0.2;

  // world.addContactMaterial(contactMaterial);
  world.addBody(pBody);

  loadPoolNoodles(scene, world, noodleMaterial);
  loadPlanes(scene, world);
}

export const worldStep = (player) => {
  world.step(timeStep);

  pBody.position.copy(player.position);
  pBody.quaternion.copy(player.quaternion);
  pBody.position.y = 3.5;
  // pBody.velocity.set(2, 0, 2);

  updatePosition();
}