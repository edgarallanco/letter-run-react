import { useGLTF, useAnimations } from '@react-three/drei';
import { Vector3 } from 'three';


export const noodles = [
  // {
  //   name: "raft",
  //   filename: "./../resources/models/raft.glb",
    
  // },
  {
    name: "ring_1",
    filename: "./../resources/models/ring_1.glb",
    position: new Vector3(35.51932849514347, 2.3149306909942626, 15.341705365864758)
  },
  {
    name: "ring_2",
    filename: "./../resources/models/ring_2.glb",
    position: new Vector3(43.70883094989104, 2.3149306909942626, 20.540877822233906)
  },
  {
    name: "noodle",
    filename: "./../resources/models/noodle.glb",
    position: new Vector3(33.5110924256302, 2.3149306909942626, 27.12094054470053)
  },
  // {
  //   name: "water",
  //   filename: "./../resources/models/10_N_Water.glb"
  // },
];

export const loadPoolNoodles = (world) => {
  noodles.forEach((noodle) => {
    console.log(world)
    const { scene } = useGLTF(noodle.filename);
    console.log(scene);
    scene.position(noodle.position);
    world.scene.add(scene);
  });
}