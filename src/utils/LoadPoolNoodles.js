import { useGLTF, useAnimations } from '@react-three/drei';
import { BoxGeometry, CylinderGeometry, Euler, Mesh, MeshBasicMaterial, SphereGeometry, TorusGeometry, Vector3, Cylinder } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as CANNON from 'cannon-es';
const loader = new GLTFLoader();

export const noodles = [
  // {
  //   name: "raft",
  //   filename: "./../resources/models/raft.glb",
    
  // },
  {
    name: "ring_1",
    filename: "https://fargamot.s3.amazonaws.com/resources/models/pink_ring.glb",
    position: new Vector3(35.51932849514347, 3.0149306909942626, 15.341705365864758),
    // geometry: new SphereGeometry(1, 20, 10),
    geometry: new CylinderGeometry(1, 1, 0.5, 100),
    rotation: new Euler(0, 0, 0),
    physics: new CANNON.Cylinder(1, 1, 0.5, 100),
    rotate: false
  },
  {
    name: "ring_2",
    filename: "https://fargamot.s3.amazonaws.com/resources/models/yellow_ring.glb",
    position: new Vector3(43.70883094989104, 3.0149306909942626, 18.540877822233906),
    // geometry: new TorusGeometry(0.8, 0.2, 20, 100),
    // geometry: new SphereGeometry(1, 20, 10),
    geometry: new CylinderGeometry(1, 1, 0.5, 100),
    rotation: new Euler(0, 0, 0),
    physics: new CANNON.Cylinder(1, 1, 0.5, 100),
    rotate: false
  },
  {
    name: "noodle",
    filename: "https://fargamot.s3.amazonaws.com/resources/models/purple_noodle.glb",
    position: new Vector3(33.5110924256302, 3.0149306909942626, 27.12094054470053),
    geometry: new CylinderGeometry(1, 1, 0.5, 100),
    rotation: new Euler(0, 0, 0),
    physics: new CANNON.Cylinder(1, 1, 0.5, 100),
    rotate: false
  },
  {
    name: "ball",
    filename: "https://fargamot.s3.amazonaws.com/resources/models/white_ball.glb",
    position: new Vector3(38.72937366844723, 3.0149306909942626, 21.85546584699992),
    geometry: new CylinderGeometry(0.6, 0.6, 0.5, 100),
    rotation: new Euler(0, 0, 0),
    physics: new CANNON.Cylinder(0.6, 0.6, 0.5, 100),
    rotate: true
  },
  // {
  //   name: "water",
  //   filename: "./../resources/models/10_N_Water.glb"
  // },
];

const poolItems = [];

export const loadPoolNoodles = (scene, world, material) => {
  let raftGeometry= new BoxGeometry(2, 1, 4);
  let raftMesh = new Mesh(raftGeometry,  new MeshBasicMaterial({ color: 0xff0000 }));
  raftMesh.position.set(42.565580399700676, 3.0149306909942626, 25.2293704771954);
  raftMesh.quaternion.setFromEuler(new Euler(0, - Math.PI / 5.5, 0))
  // scene.add(raftMesh);

  let raftBody = new CANNON.Body({
    type: CANNON.Body.STATIC,
    shape: new CANNON.Box(new CANNON.Vec3(2, 1, 4))
  });
  raftBody.position.set(42.565580399700676, 3.0149306909942626, 25.2293704771954);
  raftBody.quaternion.setFromEuler(0, - Math.PI / 5.5, 0);
  world.addBody(raftBody);

  noodles.forEach(function(noodle) {
    // console.log(world)
    // const { scene } = useGLTF(noodle.filename);
    // console.log(scene);
    // scene.position(noodle.position);
    // scene1.scene.add(scene);
    loader.load(noodle.filename, function(gltf) {
      gltf.scene.scale.setScalar(1.5);
      gltf.scene.traverse(function(child) {
        if(child.isMesh) {
          // console.log(child);
          child.castShadow = true;
          child.receiveShadow = true;
        } else if(child.isLight) {
          // console.log(child);
        }
      })

      let poolMesh = gltf.scene.children[0];
      poolMesh.scale.setScalar(1.5);
      poolMesh.position.copy(noodle.position);
      poolMesh.material.vertexColor = true;
      // console.log(gltf);
      // console.log(poolMesh);
      scene.add(poolMesh);
      let mesh = new Mesh(noodle.geometry, new MeshBasicMaterial({ color: 0xff0000 }));
      // mesh.rotation.copy(noodle.rotation);
      mesh.quaternion.setFromEuler(noodle.rotation);
      mesh.position.copy(noodle.position);
      // scene.add(mesh);

      // noodle.physics.material = material;

      let pBody = new CANNON.Body({
        mass: 1,
        shape: noodle.physics,
        position: noodle.position,
        // fixedRotation: !noodle.rotate,
        material: material
        // torque: new CANNON.Vec3(1, 1, 1),
        // linearDamping: new CANNON.Vec3(1, 0, 1)
        // force: new CANNON.Vec3(1, 0, 1)
      });
      pBody.linearDamping = 0.1;
      // pBody.linearFactor = new CANNON.Vec3(1, 1, 0);
      pBody.quaternion.copy(mesh.quaternion);
      world.addBody(pBody);

      // pBody.addEventListener("collide", (e) => {
      //   console.log("Player collide with: " + noodle.name);
      // });

      // let lockConstraint = new CANNON.LockConstraint(pBody, ground);
      // world.addConstraint(lockConstraint);

      let poolItem = {
        mesh: poolMesh,
        helper: mesh,
        pBody: pBody
      }

      // console.log(poolItem);
      poolItems.push(poolItem);
    })
  });
}

export const updatePosition = (playerPosition) => {
  // console.log(poolItems);
  let geoms = [];
  poolItems.forEach((item, index) => {
    item.mesh.position.copy(item.pBody.position);
    item.mesh.quaternion.copy(item.pBody.quaternion);
    // item.mesh.position.x = item.pBody.position.x;
    // item.mesh.position.z = item.pBody.position.z;

    // let geometry = item.mesh.geometry.clone();
    
    // console.log(Math.abs(playerPosition.x - item.mesh.position.x))
    // console.log(item.mesh.position);
    // playerCollidesMesh = Math.abs(playerPosition.x - item.mesh.position.x) < 1 || Math.abs(playerPosition.z - item.mesh.position.z) < 1;
    
    item.helper.position.copy(item.pBody.position);
    item.helper.quaternion.copy(item.pBody.quaternion);
    // item.helper.position.x = item.pBody.position.x;
    // item.helper.position.z = item.pBody.position.z;
    geoms.push(item.helper);
  });

  return geoms;
}