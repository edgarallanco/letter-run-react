import * as CANNON from 'cannon-es';
import { loadPoolNoodles, updatePosition } from 'src/utils/LoadPoolNoodles';
import { loadPlanes } from 'src/utils/LoadPoolPlanes';
import { CylinderGeometry, Euler, Mesh, MeshBasicMaterial } from 'three';
import * as THREE from 'three';
import { Vec3 } from 'cannon-es';
const timeStep = 1 / 60;

const world = new CANNON.World({
  gravity: new CANNON.Vec3(0, -9.81, 0)
});

let pBody = null;
let offset = new CANNON.Vec3();
let startPos = new CANNON.Vec3();
let endPos = new CANNON.Vec3();
let speed = 2;
let previousTime = 0;
let pBodyMesh = null;

const Nx = 20;
const Ny = 25;
const mass = 1;
const clothSize = 25;
const dist = clothSize / Nx;
const planePos = new Vec3(37.84847808876685, 3.8, 20.23125183212886)

const shape = new CANNON.Particle();

const particles = [];

for (let i = 0; i < Nx + 1; i++) {
  particles.push([]);
  for (let j = 0; j < Ny + 1; j++) {
    const particle = new CANNON.Body({
      mass: j === Ny || j === 0 ? 0 : mass,
      shape,
      position: new CANNON.Vec3(((planePos.x + i) - Nx * 0.5) * dist, 3.8, ((planePos.y + j) - Ny * 0.5) * dist),
      // velocity: new CANNON.Vec3(0, 0, -0.1 * (Ny - j))
    });
    particle.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
    particles[i].push(particle);
    world.addBody(particle);
  }
}

function connect(i1, j1, i2, j2) {
  world.addConstraint(new CANNON.DistanceConstraint(
    particles[i1][j1],
    particles[i2][j2],
    dist
  ));
}

for (let i = 0; i < Nx + 1; i++) {
  for (let j = 0; j < Ny + 1; j++) {
    if (i < Nx)
      connect(i, j, i + 1, j);
    if (j < Ny)
      connect(i, j, i, j + 1);
  }
}

const clothGeometry = new THREE.PlaneGeometry(clothSize, clothSize, Nx, Ny);

const clothMat = new THREE.MeshPhongMaterial({
  side: THREE.DoubleSide,
  wireframe: true,
  color: 0x00ff00
  // map: new THREE.TextureLoader().load('./texture.jpg')
});

const clothMesh = new THREE.Mesh(clothGeometry, clothMat);
clothMesh.position.copy(planePos);
clothMesh.quaternion.setFromEuler(new Euler(-Math.PI / 2, 0, 0));

function updateParticules() {
  for (let i = 0; i < Nx + 1; i++) {
    for (let j = 0; j < Ny + 1; j++) {
      const index = j * (Nx + 1) + i;

      const positionAttribute = clothGeometry.attributes.position;

      const position = particles[i][Ny - j].position;

      positionAttribute.setXYZ(index, position.x, position.y, position.z);

      positionAttribute.needsUpdate = true;
    }
  }
}

export const setupPhysics = (scene) => {
  // scene.add(clothMesh);
  let groundMaterial = new CANNON.Material('ground');
  groundMaterial.friction = 0.3;
  groundMaterial.restitution = 0;
  groundMaterial.contactEquationStiffness = 6000;
  groundMaterial.contactEquationRelaxation = 0.000001;

  world.defaultMaterial = groundMaterial;

  let groundBody = new CANNON.Body({
    shape: new CANNON.Box(new CANNON.Vec3(20, 20, 1)),
    type: CANNON.Body.STATIC,
    material: groundMaterial
  });
  groundBody.position.set(37.84847808876685, 1.8, 20.23125183212886);
  groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
  world.addBody(groundBody);

  let noodleMaterial = new CANNON.Material('noodle');
  noodleMaterial.friction = 0.2;
  noodleMaterial.restitution = 0;

  let playerMaterial = new CANNON.Material('player');
  playerMaterial.friction = 0.2;
  playerMaterial.restitution = 0;
  let playerShape = new CANNON.Cylinder(0.5, 0.5, 3);

  let pMeshGeom = new CylinderGeometry(0.5, 0.5, 3);
  pBodyMesh = new Mesh(pMeshGeom, new MeshBasicMaterial({ color: 0x00ff00 }));
  // scene.add(pBodyMesh);

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
    friction: 0.2,
    restitution: 0
  });

  let groundContact = new CANNON.ContactMaterial(groundMaterial, noodleMaterial, {
    friction: 0.5,
    restitution: 0
  });

  world.addContactMaterial(groundContact);
  world.addContactMaterial(contactMaterial);
  world.addBody(pBody);

  loadPoolNoodles(scene, world, noodleMaterial);
  loadPlanes(scene, world);
}

export const worldStep = (player) => {
  world.step(timeStep);
  // updateParticules()

  // pBody.position.copy(player.position);
  startPos.copy(pBody.position);
  endPos.copy(player.position);

  let direction = new CANNON.Vec3();
  endPos.vsub(startPos, direction);
  let length = direction.length();
  direction.normalize();
  speed = length / timeStep;
  direction.scale(speed, pBody.velocity);

  pBody.quaternion.copy(player.quaternion);
  // pBody.position.y = 3.5;
  // pBody.position.vadd(offset, player.position);
  // startPos.normalize();
  direction.scale(1 * length, endPos);
  startPos.vadd(offset, pBody.position);
  // console.log(pBody.velocity);
  // pBody.velocity.vadd(1, 1, 1);
  // pBody.velocity.set(2, 0, 2);
  pBodyMesh.position.copy(pBody.position);
  pBodyMesh.quaternion.copy(pBody.quaternion);

  previousTime = world.time;

  updatePosition();
}